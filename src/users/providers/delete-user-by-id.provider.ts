import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteUsersQueryDto } from '../dtos/users/delete-user.dto';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';
import { UserType } from '../enums/user-type.enum';

@Injectable()
export class DeleteUserByIdProvider {
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

  public async deleteUserById(deleteUsersQueryDto: DeleteUsersQueryDto) {
    let user: Teacher | Student | undefined = undefined;

    if (deleteUsersQueryDto.userType == UserType.STUDENT) {
      try {
        user = await this.studentsRepository.findOne({
          where: { id: deleteUsersQueryDto.id },
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    } else {
      try {
        user = await this.teachersRepository.findOne({
          where: { id: deleteUsersQueryDto.id },
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    }

    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    if (deleteUsersQueryDto.userType == UserType.STUDENT) {
      try {
        await this.studentsRepository.delete(deleteUsersQueryDto.id);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    } else {
      try {
        await this.teachersRepository.delete(deleteUsersQueryDto.id);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    }

    return {
      deleted: true,
      id: deleteUsersQueryDto.id,
      userType: deleteUsersQueryDto.userType,
    };
  }
}
