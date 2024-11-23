import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SoftDeleteDisciplineByIdProvider {
  constructor(
    //Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,
  ) {}

  public async softDeleteDisciplineById(id: number) {
    let discipline: Discipline | undefined = undefined;

    try {
      discipline = await this.disciplinesRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (!discipline) {
      throw new BadRequestException('The disciplines ID does not exist');
    }

    try {
      await this.disciplinesRepository.softDelete(id);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    return {
      softDeleted: true,
      id,
    };
  }
}
