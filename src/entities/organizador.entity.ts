import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Atividade } from './atividade.entity';
import { Usuario } from './usuario.entity';

@Entity({ name: 'organizador' })
export class Organizador {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'nome_instituicao_ou_grupo', length: 180 })
  nomeInstituicaoOuGrupo: string;

  @Column({ name: 'descricao_grupo', type: 'text', nullable: true })
  descricaoGrupo: string | null;

  @Column({ name: 'link_rede_social', type: 'varchar', length: 500, nullable: true })
  linkRedeSocial: string | null;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(() => Atividade, (a) => a.organizador)
  atividades: Atividade[];
}
