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
export class DeleteDisciplineStudentsByIdProvider {
  constructor(
    //Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    //Injecting usersService
    private readonly usersService: UsersService,
  ) {}

  public async deleteDisciplineStudentsById(
    disciplineId: number,
    addStudentsDto: AddStudentsDto,
  ) {
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
        `Discipline with id: ${disciplineId} does not exist, please check de discipline id`,
      );
    }

    let studentsToRemove: Student[] = [];

    try {
      studentsToRemove = await this.usersService.findUsersById(
        addStudentsDto.studentsId,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    if (studentsToRemove.length !== addStudentsDto.studentsId.length) {
      throw new BadRequestException(
        `Some student id does not exist, please check the students ids`,
      );
    }

    const absentStudents = studentsToRemove.filter(
      (studentToRemove) =>
        !discipline.students.some(
          (student) => student.id === studentToRemove.id,
        ),
    );

    if (absentStudents.length > 0) {
      throw new BadRequestException(
        `Students with IDs [${absentStudents.map(
          (student) => student.id,
        )}] are not associated with the discipline`,
      );
    }

    const newStudents: Student[] = [];

    for (const presentStudents of discipline.students) {
      let shouldKeep = true;
      for (const removeStudents of studentsToRemove) {
        if (presentStudents.id === removeStudents.id) {
          shouldKeep = false;
          break;
        }
      }
      if (shouldKeep) {
        newStudents.push(presentStudents);
      }
    }

    /*
    discipline.students = discipline.students.filter(
      (student) =>
        !studentsToRemove.some(
          (studentToRemove) => studentToRemove.id === student.id,
        ),
    );
    */

    discipline.students = newStudents;

    try {
      await this.disciplinesRepository.save(discipline);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    return {
      deleted: true,
      studentsId: addStudentsDto.studentsId,
    };
  }
}
