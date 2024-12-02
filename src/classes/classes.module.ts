import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './providers/classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { AddPresentStudentsProvider } from './providers/add-present-students.provider';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService, AddPresentStudentsProvider],
  imports: [TypeOrmModule.forFeature([Class])],
})
export class ClassesModule {}
