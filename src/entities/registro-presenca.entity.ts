import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inscricao } from './inscricao.entity';

@Entity({ name: 'registro_presenca' })
export class RegistroPresenca {
  @PrimaryGeneratedColumn({ name: 'id_registro_presenca' })
  idRegistroPresenca: number;

  @Column({ name: 'id_inscricao', unique: true })
  idInscricao: number;

  @Column({ name: 'data_hora_checkin', type: 'timestamp' })
  dataHoraCheckin: Date;

  @Column({ name: 'data_hora_checkout', type: 'timestamp', nullable: true })
  dataHoraCheckout: Date | null;

  @Column({ name: 'observacao_opcional', type: 'text', nullable: true })
  observacaoOpcional: string | null;

  @OneToOne(() => Inscricao)
  @JoinColumn({ name: 'id_inscricao' })
  inscricao: Inscricao;
}
