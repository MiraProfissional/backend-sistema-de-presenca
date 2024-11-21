import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    //Inject usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string) {
    const user = await this.usersRepository.query(
      `SELECT * FROM public."user" WHERE TRIM(email) = $1 LIMIT 1`,
      [email.trim()],
    );

    if (!user || user.length === 0) {
      throw new UnauthorizedException('User does not exist');
    }

    return user[0]; // Retorne apenas o primeiro resultado
  }
}
