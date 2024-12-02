import { Body, Controller, Post } from '@nestjs/common';
import { PresentStudentsDto } from './dtos/present-students.dto';
import { ClassesService } from './providers/classes.service';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Post('receive-students')
  public receivePresentStudents(
    @Body() presentStudentsDto: PresentStudentsDto,
  ) {
    return this.classesService.registerPresentStudentsByRegistrationNumber(
      presentStudentsDto,
    );
  }
}
