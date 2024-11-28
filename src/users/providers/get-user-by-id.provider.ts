import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class GetUserByIdProvider {
  constructor(
    /* 
    Injecting teachersRepository
    */
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    /* 
    Injecting studentsRepository
    */
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  public async getUserById(id: number, userType: string) {
    let user: Teacher | Student | undefined = undefined;

    if (userType == UserType.STUDENT) {
      try {
        user = await this.studentsRepository.findOne({
          where: { id: id },
          relations: ['disciplines'],
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Could not fetch the student user',
        });
      }
    } else {
      try {
        user = await this.teachersRepository.findOne({
          where: { id: id },
          relations: ['disciplines'],
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Could not fetch the teacher user',
        });
      }
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
