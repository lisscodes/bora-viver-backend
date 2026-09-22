import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inscricao } from './inscricao.entity';
import { Local } from './local.entity';
import { Organizador } from './organizador.entity';

@Entity({ name: 'atividade' })
export class Atividade {
  @PrimaryGeneratedColumn({ name: 'id_atividade' })
  idAtividade: number;

  @Column({ name: 'usuario_id_organizador' })
  usuarioIdOrganizador: number;

  @Column({ name: 'id_local' })
  idLocal: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ name: 'tipo_ou_categoria', type: 'varchar', length: 120, nullable: true })
  tipoOuCategoria: string | null;

  @Column({ name: 'data_hora_inicio', type: 'datetime' })
  dataHoraInicio: Date;

  @Column({ name: 'data_hora_fim', type: 'datetime', nullable: true })
  dataHoraFim: Date | null;

  @Column({ name: 'limite_participantes', type: 'integer', nullable: true })
  limiteParticipantes: number | null;

  @Column({ name: 'status_publicacao', length: 48, default: 'publicado' })
  statusPublicacao: string;

  @Column({ default: true })
  gratuito: boolean;

  /** Geolocalização do evento — feature principal do G Events */
  @Column({ type: 'real' })
  latitude: number;

  @Column({ type: 'real' })
  longitude: number;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string | null;

  @ManyToOne(() => Organizador, (o) => o.atividades)
  @JoinColumn({ name: 'usuario_id_organizador' })
  organizador: Organizador;

  @ManyToOne(() => Local, (l) => l.atividades)
  @JoinColumn({ name: 'id_local' })
  local: Local;

  @OneToMany(() => Inscricao, (i) => i.atividade)
  inscricoes: Inscricao[];
}
