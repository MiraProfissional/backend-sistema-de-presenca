import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-teacher-param.dto';
import { Repository } from 'typeorm';
import { Teacher } from '../teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTeacherDto } from '../dtos/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  public async getTeachers(getUsersParamDto: GetUsersParamDto) {
    if (getUsersParamDto.id) {
      return this.findOneById(getUsersParamDto.id);
    }
    return this.findAll();
  }

  public async findAll() {
    return true;
  }

  public async findOneById(id: number) {
    return id;
  }

  public async createTeacher(createTeacherDto: CreateTeacherDto) {
    const teacher = this.teacherRepository.create(createTeacherDto);
    return 'Create Teacher';
  }
}
