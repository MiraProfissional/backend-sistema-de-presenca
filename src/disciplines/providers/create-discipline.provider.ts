import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { UsersService } from 'src/users/providers/users.service';
import { Teacher } from 'src/users/entities/teacher.entity';

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

    let teacher: Teacher | undefined = undefined;

    teacher = await this.usersService.findOneUserById(user.sub, user.userType);

    try {
      existingDiscipline = await this.disciplinesRepository.findOne({
        where: {
          teacher: teacher,
          startTime: createDisciplineDto.startTime,
          endTime: createDisciplineDto.endTime,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (existingDiscipline) {
      throw new ConflictException(
        'A discipline with the same start time, end time, and teacher already exists.',
      );
    }

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
