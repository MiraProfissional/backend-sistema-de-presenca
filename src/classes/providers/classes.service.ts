import { Injectable } from '@nestjs/common';
import { PresentStudentsDto } from '../dtos/present-students.dto';
import { AddPresentStudentsProvider } from './add-present-students.provider';

@Injectable()
export class ClassesService {
  constructor(
    private readonly addPresentStudentsProvider: AddPresentStudentsProvider,
  ) {}

  public async registerPresentStudentsByRegistrationNumber(
    presentStudentsDto: PresentStudentsDto,
  ) {
    return await this.addPresentStudentsProvider.addPresentStudentsByRegistrationNumber(
      presentStudentsDto.presentStudents,
    );
  }
}
