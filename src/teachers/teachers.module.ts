import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './providers/teachers.service';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
