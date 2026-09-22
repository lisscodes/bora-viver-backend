import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atividade } from '../entities/atividade.entity';
import { Local } from '../entities/local.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Atividade, Local])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
