import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class FindOneUserByEmailProvider {
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

  public async findOneUserByEmail(email: string) {
    let user: Teacher | Student | undefined = undefined;

    try {
      user = await this.teachersRepository.findOneBy({ email });
      if (!user) {
        user = await this.studentsRepository.findOneBy({ email });
      }
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
