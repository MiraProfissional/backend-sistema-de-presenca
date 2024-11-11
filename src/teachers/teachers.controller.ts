import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-teacher-param.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeachersService } from './providers/teachers.service';
import { CreateTeacherDto } from './dtos/create-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  @Get('/:id?')
  public getTeachers(@Param() getUsersParamDto: GetUsersParamDto) {
    return this.teachersService.getTeachers(getUsersParamDto);
  }

  @Post()
  public createTeachers(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.createTeacher(createTeacherDto);
  }
}
