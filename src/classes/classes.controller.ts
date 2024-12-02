import { Body, Controller, Post } from '@nestjs/common';
import { PresentStudentsDto } from './dtos/present-students.dto';
import { ClassesService } from './providers/classes.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({
    summary: 'Create a class on the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Class created successfully',
  })
  @Post()
  public createClasses(@Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(createClassDto);
  }

  @ApiOperation({
    summary: "Receive students's registration number to add into a Class",
  })
  @ApiResponse({
    status: 200,
    description: 'Students added successfully',
  })
  @Post('receive-students')
  public receivePresentStudents(
    @Body() presentStudentsDto: PresentStudentsDto,
  ) {
    return this.classesService.registerPresentStudentsByRegistrationNumber(
      presentStudentsDto,
    );
  }
}
