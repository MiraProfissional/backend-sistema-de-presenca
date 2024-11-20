import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class DeleteUserByIdProvider {
  constructor(
    //Injecting userRepository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async deleteUserById(id: number) {
    let user = undefined;

    try {
      user = await this.userRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (!user) {
      throw new BadRequestException('The user ID does not exist');
    }

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    return { deleted: true, id };
  }
}
