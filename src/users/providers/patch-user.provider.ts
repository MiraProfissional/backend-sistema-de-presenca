import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { PatchTeacherDto } from '../dtos/teachers/patch-teacher.dto';
import { PatchStudentDto } from '../dtos/students/patch-student.dto';
import { UserType } from '../enums/user-type.enum';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from '../entities/user.entity';

@Injectable()
export class PatchUserProvider {
  constructor(
    //Injecting teacherRepository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //Injecting teacherRepository
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    //Injecting studentRepository
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    //Inject hashingProvider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async updateUser(
    userType: UserType,
    patchUserDto: PatchTeacherDto | PatchStudentDto,
  ) {
    let user = undefined;

    try {
      user = await this.userRepository.findOne({
        where: { id: patchUserDto.id },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    // Update the common properties
    user.name = patchUserDto.name ?? user.name;
    user.email = patchUserDto.email ?? user.email;
    if (patchUserDto.password) {
      user.password = await this.hashingProvider.hashPassword(
        patchUserDto.password,
      );
    }
    user.dateBirth = patchUserDto.dateBirth ?? user.dateBirth;
    user.cpf = patchUserDto.cpf ?? user.cpf;
    user.cellphone = patchUserDto.cellphone ?? user.cellphone;

    if (userType == UserType.STUDENT) {
      user.registration =
        (patchUserDto as PatchStudentDto).registration ?? user.registration;
      user.course = (patchUserDto as PatchStudentDto).course ?? user.course;

      try {
        await this.studentRepository.save(user);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    } else if (userType == UserType.TEACHER) {
      user.identifier =
        (patchUserDto as PatchTeacherDto).identifier ?? user.identifier;

      try {
        await this.teacherRepository.save(user);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    }

    return user;
  }
}
