import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Atividade } from './atividade.entity';
import { Participante } from './participante.entity';
import { RegistroPresenca } from './registro-presenca.entity';

@Entity({ name: 'inscricao' })
export class Inscricao {
  @PrimaryGeneratedColumn({ name: 'id_inscricao' })
  idInscricao: number;

  @Column({ name: 'usuario_id_participante' })
  usuarioIdParticipante: number;

  @Column({ name: 'id_atividade' })
  idAtividade: number;

  @Column({
    name: 'data_hora_solicitacao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataHoraSolicitacao: Date;

  @Column({ length: 32, default: 'solicitada' })
  situacao: string;

  @ManyToOne(() => Participante, (p) => p.inscricoes)
  @JoinColumn({ name: 'usuario_id_participante' })
  participante: Participante;

  @ManyToOne(() => Atividade, (a) => a.inscricoes)
  @JoinColumn({ name: 'id_atividade' })
  atividade: Atividade;

  @OneToOne(() => RegistroPresenca, (r) => r.inscricao)
  registroPresenca?: RegistroPresenca;
}
