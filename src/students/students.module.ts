import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './providers/students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [TypeOrmModule.forFeature([Student])],
})
export class StudentsModule {}
