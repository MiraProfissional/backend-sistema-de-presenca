import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../class.entity';
import { UsersService } from 'src/users/providers/users.service';
import { Student } from 'src/users/entities/student.entity';

@Injectable()
export class AddPresentStudentsProvider {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,

    private readonly usersService: UsersService,
  ) {}

  public async addPresentStudentsByRegistrationNumber(
    presentStudentsRegistrationNumber: number[],
    classId: number,
  ): Promise<Class> {
    let existingClass: Class | undefined = undefined;

    try {
      existingClass = await this.classesRepository.findOne({
        where: { id: classId },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }

    if (!existingClass) {
      throw new BadRequestException('The class ID does not exist');
    }

    const studentsToAdd =
      await this.usersService.findStudentsByRegistrationNumber(
        presentStudentsRegistrationNumber,
      );

    const studentsNotAssociated = studentsToAdd.filter(
      (studentToAdd) =>
        !existingClass.discipline.students.some(
          (student: Student) => student.id === studentToAdd.id,
        ),
    );

    if (studentsNotAssociated.length > 0) {
      throw new BadRequestException(
        `Students with registration number [${studentsNotAssociated.map(
          (student) => student.registrationNumber,
        )}] are not associated with the discipline`,
      );
    }

    existingClass = { ...existingClass, presentStudents: studentsToAdd };

    try {
      return await this.classesRepository.save(existingClass);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database',
      });
    }
  }
}
