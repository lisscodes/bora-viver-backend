import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Atividade } from './atividade.entity';

@Entity({ name: 'local' })
export class Local {
  @PrimaryGeneratedColumn({ name: 'id_local' })
  idLocal: number;

  @Column({ name: 'nome_ou_referencia', length: 140 })
  nomeOuReferencia: string;

  @Column({ name: 'endereco_completo', type: 'text', nullable: true })
  enderecoCompleto: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  estado: string | null;

  @Column({ type: 'varchar', length: 12, nullable: true })
  cep: string | null;

  @OneToMany(() => Atividade, (a) => a.local)
  atividades: Atividade[];
}
