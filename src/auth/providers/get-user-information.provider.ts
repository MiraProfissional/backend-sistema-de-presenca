import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/users/entities/student.entity';
import { UserType } from 'src/users/enums/user-type.enum';

@Injectable()
export class GetUserInformationProvider {
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

  public async getUserInformation(user: ActiveUserData) {
    return await this.findOneUserById(user.sub, user.userType);
  }

  public async findOneUserById(id: number, userType: string) {
    let user: Teacher | Student | undefined = undefined;

    if (userType == UserType.STUDENT) {
      try {
        user = await this.studentsRepository.findOneBy({
          id: id,
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Could not fetch the student user',
        });
      }
    } else {
      try {
        user = await this.teachersRepository.findOneBy({
          id: id,
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
