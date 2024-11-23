import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetDisciplineByIdProvider {
  constructor(
    //Injecting disciplineRepository
    @InjectRepository(Discipline)
    private readonly disciplineRepository: Repository<Discipline>,
  ) {}

  public async getDisciplineById(id: number) {
    let discipline: Discipline | undefined = undefined;

    try {
      discipline = await this.disciplineRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (!discipline) {
      throw new BadRequestException(
        `Discipline with id: ${id} does not exist, please check de id`,
      );
    }

    return discipline;
  }
}
