import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { GetUserInformationProvider } from './get-user-information.provider';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    //Inject getUserInformationProvider
    private readonly getUserInformationProvider: GetUserInformationProvider,

    //Inject signInProvider
    private readonly signInProvider: SignInProvider,

    //Inject refreshTokenProvider
    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }

  public async getUserInformation(user: ActiveUserData) {
    return await this.getUserInformationProvider.getUserInformation(user);
  }
}
