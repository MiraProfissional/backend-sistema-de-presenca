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
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    //Inject hashingProvider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async createUser(
    userType: UserType,
    createUserDto: CreateStudentDto | CreateTeacherDto,
  ): Promise<User> {
    let existingUser = undefined;

    console.log('userType:', userType);

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
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

    const newUser = this.usersRepository.create({
      ...createUserDto,
      type: userType,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    console.log('Dados antes do save:', newUser);

    try {
      const result = await this.usersRepository.save(newUser);
      console.log('Usuário salvo:', result);
      return result;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later.',
        { description: 'Error connecting to the database.' },
      );
    }
  }
}
