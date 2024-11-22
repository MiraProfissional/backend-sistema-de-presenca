import { Module } from '@nestjs/common';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './providers/disciplines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './discipline.entity';
import { CreateDisciplineProvider } from './providers/create-discipline.provider';
import { UsersModule } from 'src/users/users.module';
import { GetDisciplineByIdProvider } from './providers/get-discipline-by-id.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discipline]),
    UsersModule,
    PaginationModule,
  ],
  controllers: [DisciplinesController],
  providers: [
    DisciplinesService,
    CreateDisciplineProvider,
    GetDisciplineByIdProvider,
  ],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}
