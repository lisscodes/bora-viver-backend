import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participante } from './participante.entity';

@Entity({ name: 'contato_emergencia' })
export class ContatoEmergencia {
  @PrimaryGeneratedColumn({ name: 'id_contato' })
  idContato: number;

  @Column({ name: 'usuario_id_participante', unique: true })
  usuarioIdParticipante: number;

  @Column({ name: 'nome_completo_contato', length: 200 })
  nomeCompletoContato: string;

  @Column({ name: 'telefone_contato', length: 40 })
  telefoneContato: string;

  @Column({ name: 'parentesco_ou_observacao', type: 'text', nullable: true })
  parentescoOuObservacao: string | null;

  @OneToOne(() => Participante)
  @JoinColumn({ name: 'usuario_id_participante' })
  participante: Participante;
}
