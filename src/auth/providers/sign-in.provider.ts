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
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SignInProvider {
  constructor(
    //Inject usersService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    //Inject usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

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
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.query(
        `SELECT * FROM public."user" WHERE TRIM(email) = $1 LIMIT 1`,
        [email.trim()],
      );
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    if (!user[0]) {
      throw new UnauthorizedException('User does not exist');
    }

    return user[0];
  }
}
