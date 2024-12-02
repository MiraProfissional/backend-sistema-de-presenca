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

@Injectable()
export class PatchUserProvider {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async updateUser(
    userType: UserType,
    patchUserDto: PatchTeacherDto | PatchStudentDto,
  ) {
    let user: Teacher | Student | undefined = undefined;

    if (userType == UserType.STUDENT) {
      try {
        user = await this.studentsRepository.findOne({
          where: { id: patchUserDto.id },
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Could not fetch the student user.',
        });
      }
    } else {
      try {
        user = await this.teachersRepository.findOne({
          where: { id: patchUserDto.id },
        });
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Could not fetch the teacher user.',
        });
      }
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
    user.dateBirth = patchUserDto.dateBirth
      ? new Date(patchUserDto.dateBirth)
      : user.dateBirth;
    user.cpf = patchUserDto.cpf ?? user.cpf;
    user.cellphone = patchUserDto.cellphone ?? user.cellphone;
    user.registrationNumber =
      patchUserDto.registrationNumber ?? user.registrationNumber;

    if (user instanceof Student) {
      user.course = (patchUserDto as PatchStudentDto).course ?? user.course;

      try {
        await this.studentsRepository.save(user);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    } else if (user instanceof Teacher) {
      try {
        await this.teachersRepository.save(user);
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Error connecting to the database.',
        });
      }
    }

    return user;
  }
}
