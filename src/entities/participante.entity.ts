import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { ContatoEmergencia } from './contato-emergencia.entity';
import { Inscricao } from './inscricao.entity';
import { Usuario } from './usuario.entity';

@Entity({ name: 'participante' })
export class Participante {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apelido: string | null;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToOne(() => ContatoEmergencia, (c) => c.participante)
  contatoEmergencia?: ContatoEmergencia;

  @OneToMany(() => Inscricao, (i) => i.participante)
  inscricoes: Inscricao[];
}
