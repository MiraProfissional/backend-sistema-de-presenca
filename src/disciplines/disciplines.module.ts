import { Module } from '@nestjs/common';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './providers/disciplines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './discipline.entity';
import { CreateDisciplineProvider } from './providers/create-discipline';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discipline]), UsersModule],
  controllers: [DisciplinesController],
  providers: [DisciplinesService, CreateDisciplineProvider],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}
