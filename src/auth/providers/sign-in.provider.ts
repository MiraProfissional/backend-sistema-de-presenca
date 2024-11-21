import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class SignInProvider {
  constructor(
    //Inject usersService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

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

    //Inject hashingProvider
    private readonly hashingProvider: HashingProvider,

    //Inject generateTokenProvider
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.verifyUser(signInDto.email);

    let isEqual: boolean = false;

    isEqual = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }

    //Returning the Token
    return await this.generateTokenProvider.generateTokens(user);
  }

  public async verifyUser(email: string) {
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
