import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Teacher } from 'src/users/entities/teacher.entity';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class GetDisciplinesLinkedToAnIdProvider {
  constructor(
    //Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    //Injecting usersService
    private readonly usersService: UsersService,
  ) {}

  public async getDisciplinesLinkedToAnId(userId: number, userType: string) {
    let user: Teacher | Student | undefined = undefined;

    try {
      user = await this.usersService.findOneUserById(userId, userType);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    const disciplineIds = user.disciplines.map((discipline) => discipline.id);

    let disciplines: Discipline[] = [];

    try {
      disciplines = await this.disciplinesRepository.find({
        where: { id: In(disciplineIds) },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    if (!disciplines) {
      throw new BadRequestException(
        'The user does not have any disciplines linked to him',
      );
    }

    return disciplines;
  }
}
