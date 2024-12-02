import { Injectable } from '@nestjs/common';
import { PresentStudentsDto } from '../dtos/present-students.dto';
import { AddPresentStudentsProvider } from './add-present-students.provider';
import { CreateClassDto } from '../dtos/create-class.dto';
import { CreateClassProvider } from './create-class.provider';

@Injectable()
export class ClassesService {
  constructor(
    private readonly addPresentStudentsProvider: AddPresentStudentsProvider,

    private readonly createClassProvider: CreateClassProvider,
  ) {}

  public async createClass(createClassDto: CreateClassDto) {
    return await this.createClassProvider.createClass(createClassDto);
  }

  public async registerPresentStudentsByRegistrationNumber(
    presentStudentsDto: PresentStudentsDto,
  ) {
    return await this.addPresentStudentsProvider.addPresentStudentsByRegistrationNumber(
      presentStudentsDto.presentStudents,
      presentStudentsDto.classId,
    );
  }
}
