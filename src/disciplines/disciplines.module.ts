import { Module } from '@nestjs/common';
import { DisciplinesController } from './disciplines.controller';
import { DisciplinesService } from './providers/disciplines.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discipline } from './discipline.entity';
import { CreateDisciplineProvider } from './providers/create-discipline.provider';
import { UsersModule } from 'src/users/users.module';
import { GetDisciplineByIdProvider } from './providers/get-discipline-by-id.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { UpdateDisciplineProvider } from './providers/update-discipline.provider';
import { DeleteDisciplineByIdProvider } from './providers/delete-discipline-by-id.provider';
import { SoftDeleteDisciplineByIdProvider } from './providers/soft-delete-discipline-by-id.provider';
import { AddStudentsToOneDisciplineProvider } from './providers/add-students-to-one-discipline.provider';
import { DeleteDisciplineStudentsByIdProvider } from './providers/delete-discipline-students-by-id.provider';

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
    UpdateDisciplineProvider,
    DeleteDisciplineByIdProvider,
    SoftDeleteDisciplineByIdProvider,
    AddStudentsToOneDisciplineProvider,
    DeleteDisciplineStudentsByIdProvider,
  ],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}
