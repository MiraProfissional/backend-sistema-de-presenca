import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './providers/classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { AddPresentStudentsProvider } from './providers/add-present-students.provider';
import { CreateClassProvider } from './providers/create-class.provider';
import { DisciplinesModule } from 'src/disciplines/disciplines.module';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, AddPresentStudentsProvider, CreateClassProvider],
  imports: [TypeOrmModule.forFeature([Class]), DisciplinesModule],
})
export class ClassesModule {}
