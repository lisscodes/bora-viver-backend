import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Atividade } from './entities/atividade.entity';
import { ContatoEmergencia } from './entities/contato-emergencia.entity';
import { Inscricao } from './entities/inscricao.entity';
import { Local } from './entities/local.entity';
import { Organizador } from './entities/organizador.entity';
import { Participante } from './entities/participante.entity';
import { RegistroPresenca } from './entities/registro-presenca.entity';
import { Usuario } from './entities/usuario.entity';
import { EventsModule } from './events/events.module';
import { DatabaseBootstrapService } from './database/database-bootstrap.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(__dirname, '..', 'data', 'gevents.sqlite'),
      entities: [
        Usuario,
        Organizador,
        Participante,
        ContatoEmergencia,
        Local,
        Atividade,
        Inscricao,
        RegistroPresenca,
      ],
      synchronize: false,
      logging: false,
    }),
    EventsModule,
  ],
  providers: [DatabaseBootstrapService],
})
export class AppModule {}
