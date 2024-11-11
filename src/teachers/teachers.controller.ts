import { Controller, Get, Param } from '@nestjs/common';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeachersService } from './providers/teachers.service';

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
}
