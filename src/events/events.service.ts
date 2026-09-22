import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atividade } from '../entities/atividade.entity';
import { Local } from '../entities/local.entity';
import {
  CreateEventDto,
  RemoteEventDto,
  UpdateEventDto,
} from './dto/remote-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Atividade)
    private readonly atividadeRepo: Repository<Atividade>,
    @InjectRepository(Local)
    private readonly localRepo: Repository<Local>,
  ) {}

  async findAll(): Promise<RemoteEventDto[]> {
    const rows = await this.atividadeRepo.find({
      relations: { local: true },
      where: { statusPublicacao: 'publicado' },
      order: { dataHoraInicio: 'ASC' },
    });
    return rows.map((row) => this.toRemote(row));
  }

  async findById(id: string): Promise<RemoteEventDto> {
    const atividade = await this.findEntityOrFail(id);
    return this.toRemote(atividade);
  }

  async findNearby(
    lat: number,
    lng: number,
    radiusKm = 10,
  ): Promise<RemoteEventDto[]> {
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new BadRequestException('lat e lng são obrigatórios');
    }

    const all = await this.findAll();
    return all
      .map((event) => ({
        event,
        distance: this.haversineKm(lat, lng, event.latitude, event.longitude),
      }))
      .filter(({ distance }) => distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .map(({ event }) => event);
  }

  async create(dto: CreateEventDto): Promise<RemoteEventDto> {
    this.assertCoordinates(dto.latitude, dto.longitude);

    const local = this.localRepo.create({
      nomeOuReferencia: dto.location_name,
      enderecoCompleto: dto.location_name,
      cidade: dto.cidade ?? null,
      estado: dto.estado ?? null,
    });
    await this.localRepo.save(local);

    const start = dto.data_hora_inicio
      ? new Date(dto.data_hora_inicio)
      : this.parseDisplayDate(dto.date);

    const atividade = this.atividadeRepo.create({
      usuarioIdOrganizador: dto.usuario_id_organizador ?? 1,
      idLocal: local.idLocal,
      titulo: dto.title,
      descricao: dto.description ?? null,
      tipoOuCategoria: dto.tipo_ou_categoria ?? null,
      dataHoraInicio: start,
      dataHoraFim: dto.data_hora_fim ? new Date(dto.data_hora_fim) : null,
      limiteParticipantes: dto.limite_participantes ?? null,
      statusPublicacao: 'publicado',
      gratuito: dto.gratuito ?? true,
      latitude: dto.latitude,
      longitude: dto.longitude,
      imageUrl: dto.image_url ?? null,
    });

    const saved = await this.atividadeRepo.save(atividade);
    return this.findById(String(saved.idAtividade));
  }

  async update(id: string, dto: UpdateEventDto): Promise<RemoteEventDto> {
    const atividade = await this.findEntityOrFail(id);

    if (dto.latitude !== undefined || dto.longitude !== undefined) {
      this.assertCoordinates(
        dto.latitude ?? atividade.latitude,
        dto.longitude ?? atividade.longitude,
      );
    }

    if (dto.title !== undefined) atividade.titulo = dto.title;
    if (dto.description !== undefined) atividade.descricao = dto.description;
    if (dto.latitude !== undefined) atividade.latitude = dto.latitude;
    if (dto.longitude !== undefined) atividade.longitude = dto.longitude;
    if (dto.image_url !== undefined) atividade.imageUrl = dto.image_url;
    if (dto.tipo_ou_categoria !== undefined) {
      atividade.tipoOuCategoria = dto.tipo_ou_categoria;
    }
    if (dto.data_hora_inicio !== undefined) {
      atividade.dataHoraInicio = new Date(dto.data_hora_inicio);
    }
    if (dto.data_hora_fim !== undefined) {
      atividade.dataHoraFim = new Date(dto.data_hora_fim);
    }
    if (dto.status_publicacao !== undefined) {
      atividade.statusPublicacao = dto.status_publicacao;
    }
    if (dto.gratuito !== undefined) atividade.gratuito = dto.gratuito;

    if (dto.location_name !== undefined && atividade.local) {
      atividade.local.nomeOuReferencia = dto.location_name;
      await this.localRepo.save(atividade.local);
    }

    await this.atividadeRepo.save(atividade);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const atividade = await this.findEntityOrFail(id);
    await this.atividadeRepo.remove(atividade);
  }

  private async findEntityOrFail(id: string): Promise<Atividade> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new NotFoundException('Evento não encontrado');
    }

    const atividade = await this.atividadeRepo.findOne({
      where: { idAtividade: numericId },
      relations: { local: true },
    });

    if (!atividade) {
      throw new NotFoundException('Evento não encontrado');
    }

    return atividade;
  }

  private toRemote(atividade: Atividade): RemoteEventDto {
    return {
      id: String(atividade.idAtividade),
      title: atividade.titulo,
      description: atividade.descricao ?? '',
      date: this.formatDisplayDate(atividade.dataHoraInicio),
      location_name: atividade.local?.nomeOuReferencia ?? '',
      latitude: atividade.latitude,
      longitude: atividade.longitude,
      image_url: atividade.imageUrl,
    };
  }

  private formatDisplayDate(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }

  private parseDisplayDate(display?: string): Date {
    if (!display) {
      return new Date();
    }
    const [day, month] = display.split('/').map(Number);
    const year = new Date().getFullYear();
    return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0);
  }

  private assertCoordinates(lat: number, lng: number) {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new BadRequestException('latitude/longitude fora do intervalo válido');
    }
  }

  private haversineKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
