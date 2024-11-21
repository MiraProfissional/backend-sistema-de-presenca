import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';

@Module({
  providers: [PaginationProvider],
  imports: [TypeOrmModule.forFeature([User, Student, Teacher])],
  exports: [PaginationProvider],
})
export class PaginationModule {}
