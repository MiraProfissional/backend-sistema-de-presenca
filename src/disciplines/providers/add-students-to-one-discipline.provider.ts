import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discipline } from '../discipline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddStudentsDto } from '../dtos/add-students.dto';
import { UsersService } from 'src/users/providers/users.service';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class AddStudentsToOneDisciplineProvider {
  constructor(
    //Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    //Injecting usersService
    private readonly usersService: UsersService,
  ) {}

  public async addStudentsToOneDiscipline(
    disciplineId: number,
    addStudentsDto: AddStudentsDto,
  ): Promise<Discipline> {
    let discipline: Discipline | undefined = undefined;

    try {
      discipline = await this.disciplinesRepository.findOne({
        where: { id: disciplineId },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (!discipline) {
      throw new BadRequestException(
        `Discipline with id: ${disciplineId} does not exist, please check the discipline id`,
      );
    }

    let students: Student[] = [];

    try {
      students = await this.usersService.findStudentsById(
        addStudentsDto.studentsId,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (students.length !== addStudentsDto.studentsId.length) {
      throw new BadRequestException(
        `Some student id does not exist, please check the students ids`,
      );
    }

    const alreadyEnrolled: number[] = students
      .filter((student) =>
        discipline.students.some((existing) => existing.id === student.id),
      )
      .map((student) => student.id);

    if (alreadyEnrolled.length > 0) {
      throw new BadRequestException(
        `The following student IDs are already enrolled in the discipline: ${alreadyEnrolled.join(
          ', ',
        )}. Please provide only new student IDs.`,
      );
    }

    discipline.students = [...discipline.students, ...students];

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
