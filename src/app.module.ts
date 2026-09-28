import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5432')),
        username: config.get<string>('DB_USER', 'bora'),
        password: config.get<string>('DB_PASSWORD', 'bora'),
        database: config.get<string>('DB_NAME', 'bora_viver'),
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
    }),
    EventsModule,
  ],
  providers: [DatabaseBootstrapService],
})
export class AppModule {}
