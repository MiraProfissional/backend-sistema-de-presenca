import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './providers/students.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
