import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class GetUsersByRegistrationNumberProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}
  public async findStudentsByRegistrationNumber(
    registrationNumbers: number[],
  ): Promise<Student[]> {
    let students: Student[] = [];

    try {
      students = await this.studentsRepository.find({
        where: { registrationNumber: In(registrationNumbers) },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (registrationNumbers.length !== students.length) {
      throw new BadRequestException(
        'Some registration number does not exist, please check your ids',
      );
    }

    return students;
  }

  public async findTeachersByRegistrationNumber(
    registrationNumbers: number[],
  ): Promise<Teacher[]> {
    let teachers: Teacher[] = [];

    try {
      teachers = await this.teachersRepository.find({
        where: { registrationNumber: In(registrationNumbers) },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (registrationNumbers.length !== teachers.length) {
      throw new BadRequestException(
        'Some registration number does not exist, please check your ids',
      );
    }

    return teachers;
  }
}
