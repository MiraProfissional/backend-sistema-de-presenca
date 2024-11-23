import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../active-user.interface';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    //Inject jwtService
    private readonly jwtService: JwtService,

    //Inject jwtConfiguration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateTokens(user: Teacher | Student) {
    let userType = undefined;

    if (user instanceof Teacher) {
      userType = 'professor';
    } else {
      userType = 'aluno';
    }

    const payload = {
      email: user.email,
      userType: userType,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // Generate the access token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        payload,
      ),

      // Generate the refresh token
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
