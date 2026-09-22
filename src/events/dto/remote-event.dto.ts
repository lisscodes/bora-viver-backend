/**
 * Contrato JSON consumido pelo Retrofit (RemoteEvent no Android).
 */
export class RemoteEventDto {
  id: string;
  title: string;
  description: string;
  date: string;
  location_name: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
}

export class CreateEventDto {
  title: string;
  description?: string;
  date?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  image_url?: string | null;
  tipo_ou_categoria?: string;
  data_hora_inicio?: string;
  data_hora_fim?: string;
  limite_participantes?: number;
  gratuito?: boolean;
  usuario_id_organizador?: number;
  cidade?: string;
  estado?: string;
}

export class UpdateEventDto {
  title?: string;
  description?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string | null;
  tipo_ou_categoria?: string;
  data_hora_inicio?: string;
  data_hora_fim?: string;
  status_publicacao?: string;
  gratuito?: boolean;
}
