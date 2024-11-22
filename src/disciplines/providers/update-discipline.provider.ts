import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDisciplineDto } from '../dtos/update-discipline.dto';

@Injectable()
export class UpdateDisciplineProvider {
  constructor(
    //Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,
  ) {}

  public async updateDiscipline(updateDisciplineDto: UpdateDisciplineDto) {
    let discipline: Discipline | undefined = undefined;

    try {
      discipline = await this.disciplinesRepository.findOne({
        where: { id: updateDisciplineDto.id },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    if (!discipline) {
      throw new BadRequestException(
        `Discipline with id: ${updateDisciplineDto.id} was not found, please check your id`,
      );
    }

    discipline.name = updateDisciplineDto.name ?? discipline.name;
    discipline.code = updateDisciplineDto.code ?? discipline.code;
    discipline.ipCamera = updateDisciplineDto.ipCamera ?? discipline.ipCamera;

    try {
      await this.disciplinesRepository.save(discipline);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    return discipline;
  }
}
