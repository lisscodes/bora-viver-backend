import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organizador } from './organizador.entity';
import { Participante } from './participante.entity';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ name: 'nome_completo', length: 200 })
  nomeCompleto: string;

  @Column({ length: 254, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  telefone: string | null;

  @Column({
    name: 'data_cadastro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataCadastro: Date;

  @Column({ default: true })
  ativo: boolean;

  @Column({ name: 'documentacao_identidade_validada', default: false })
  documentacaoIdentidadeValidada: boolean;

  @Column({ name: 'biometria_facial_validada', default: false })
  biometriaFacialValidada: boolean;

  @OneToOne(() => Organizador, (o) => o.usuario)
  organizador?: Organizador;

  @OneToOne(() => Participante, (p) => p.usuario)
  participante?: Participante;
}
