import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Class } from '../class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from '../dtos/create-class.dto';
import { DisciplinesService } from 'src/disciplines/providers/disciplines.service';

@Injectable()
export class CreateClassProvider {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,

    private readonly disciplinesService: DisciplinesService,
  ) {}

  public async createClass(createClassDto: CreateClassDto) {
    const discipline = await this.disciplinesService.findOneDisciplineById(
      createClassDto.disciplineId,
    );

    if (!discipline) {
      throw new BadRequestException('The discipline ID does not exist');
    }

    const currentDate = new Date(); // Data atual
    const [hours, minutes] = discipline.startTime.split(':').map(Number);

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes,
      0,
    );

    const newClass = this.classesRepository.create({
      ...createClassDto,
      date: date,
    });

    return newClass;

    // try {
    //   return await this.classesRepository.save(newClass);
    // } catch (error) {
    //   throw new RequestTimeoutException(error, {
    //     description: 'Error connecting to the database',
    //   });
    // }
  }
}
