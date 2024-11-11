import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-teacher-param.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeachersService } from './providers/teachers.service';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { PatchTeacherDto } from './dtos/patch-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @ApiOperation({
    summary: 'Fetches a list of registered teachers on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers fetched successfully based on the query',
  })
  @Get('/:id?')
  public getTeachers(@Param() getUsersParamDto: GetUsersParamDto) {
    return this.teachersService.getTeachers(getUsersParamDto);
  }

  @ApiOperation({
    summary: 'Create a teacher user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers created successfully',
  })
  @Post()
  public createTeachers(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.createTeacher(createTeacherDto);
  }

  @ApiOperation({
    summary: 'Update a teacher user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers updated successfully',
  })
  @Patch()
  public updateTeachers(@Body() updateTeacherDto: PatchTeacherDto) {
    return this.teachersService.updateTeacher(updateTeacherDto);
  }
}
