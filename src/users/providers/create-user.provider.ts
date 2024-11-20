import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from '../dtos/students/create-student.dto';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';
import { UserType } from '../enums/user-type.enum';
import { Student } from '../entities/student.entity';
import { Teacher } from '../entities/teacher.entity';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    //Inject hashingProvider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(
    userType: UserType,
    createUserDto: CreateStudentDto | CreateTeacherDto,
  ): Promise<Student | Teacher> {
    let existingUser = undefined;

    try {
      if (userType === UserType.STUDENT) {
        existingUser = await this.studentRepository.findOne({
          where: { email: createUserDto.email },
        });
      } else if (userType === UserType.TEACHER) {
        existingUser = await this.teacherRepository.findOne({
          where: { email: createUserDto.email },
        });
      }
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists. Please check your email.',
      );
    }

    let newUser: Student | Teacher;

    if (userType === UserType.STUDENT) {
      newUser = this.studentRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      return this.studentRepository.save(newUser);
    } else if (userType === UserType.TEACHER) {
      newUser = this.teacherRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      return this.teacherRepository.save(newUser);
    } else {
      throw new BadRequestException('Invalid user type.');
    }
  }
}
