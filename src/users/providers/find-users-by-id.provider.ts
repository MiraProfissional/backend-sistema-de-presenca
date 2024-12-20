import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../entities/teacher.entity';

@Injectable()
export class FindUsersByIdProvider {
  constructor(
    //Injecting studentsRepository
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  public async findStudentsById(ids: number[]): Promise<Student[]> {
    let students: Student[] = [];

    try {
      students = await this.studentsRepository.find({
        where: { id: In(ids) },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (ids.length !== students.length) {
      throw new BadRequestException(
        'Some user id does not exist, please check your ids',
      );
    }

    return students;
  }

  public async findTeachersById(ids: number[]): Promise<Teacher[]> {
    let teachers: Teacher[] = [];

    try {
      teachers = await this.teachersRepository.find({
        where: { id: In(ids) },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (ids.length !== teachers.length) {
      throw new BadRequestException(
        'Some user id does not exist, please check your ids',
      );
    }

    return teachers;
  }
}
