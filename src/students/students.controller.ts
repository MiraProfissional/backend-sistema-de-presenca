import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentsService } from './providers/students.service';
import { GetUsersParamDto } from 'src/teachers/dtos/get-teacher-param.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTeacherDto } from 'src/teachers/dtos/create-teacher.dto';
import { PatchTeacherDto } from 'src/teachers/dtos/patch-teacher.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @ApiOperation({
    summary: 'Fetches a list of registered students on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Students fetched successfully based on the query',
  })
  @Get('/:id?')
  public getStudents(@Param() getUsersParamDto: GetUsersParamDto) {
    return this.studentService.getStudents(getUsersParamDto);
  }

  @ApiOperation({
    summary: 'Create a student user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Students created successfully',
  })
  @Post()
  public createStudents(@Body() createStudentDto: CreateTeacherDto) {
    return this.studentService.createStudent(createStudentDto);
  }

  @ApiOperation({
    summary: 'Update a student user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Students updated successfully',
  })
  @Patch()
  public updateStudents(@Body() updateStudentDto: PatchTeacherDto) {
    return this.studentService.updateStudent(updateStudentDto);
  }

  @ApiOperation({
    summary: 'Delete a student user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Students deleted successfully',
  })
  @Delete()
  public deleteStudents(@Query('id', ParseIntPipe) id: number) {
    return this.studentService.deleteStudent(id);
  }
}
