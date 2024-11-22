import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ActiveUserData } from 'src/auth/active-user.interface';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class CreateDisciplineProvider {
  constructor(
    // Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    private readonly usersService: UsersService,
  ) {}

  public async createDiscipline(
    createDisciplineDto: CreateDisciplineDto,
    user: ActiveUserData,
  ) {
    let existingDiscipline: Discipline | undefined = undefined;

    try {
      existingDiscipline = await this.disciplinesRepository.findOne({
        where: { name: createDisciplineDto.name },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (existingDiscipline) {
      throw new ConflictException(
        'The discipline already exists. Please, check the name',
      );
    }

    const teacher = await this.usersService.findOneUserById(
      user.sub,
      user.userType,
    );

    const newDiscipline = this.disciplinesRepository.create({
      ...createDisciplineDto,
      teacher: teacher,
    });

    try {
      return this.disciplinesRepository.save(newDiscipline);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }
  }
}
