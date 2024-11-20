import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { GetUsersParamDto } from './dtos/users/get-users-param.dto';
import { CreateTeacherDto } from './dtos/teachers/create-teacher.dto';
import { PatchTeacherDto } from './dtos/teachers/patch-teacher.dto';
import { CreateStudentDto } from './dtos/students/create-student.dto';
import { PatchStudentDto } from './dtos/students/patch-student.dto';
import { UserType } from './enums/user-type.enum';
import { GetUsersQueryDto } from './dtos/users/get-users-query.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Injecting Users Service

  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  @Get('/:id?')
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query() getUsersQueryDto: GetUsersQueryDto,
  ) {
    return this.usersService.getUsers(getUsersParamDto, getUsersQueryDto);
  }

  @ApiOperation({
    summary: 'Create a Student user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student user created successfully',
  })
  @Post('/alunos')
  @Auth(AuthType.None)
  public createStudents(@Body() createUserDto: CreateStudentDto) {
    return this.usersService.createUser(UserType.STUDENT, createUserDto);
  }

  @ApiOperation({
    summary: 'Create a Teacher user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher user created successfully',
  })
  @Post('/professores')
  @Auth(AuthType.None)
  public createTeacher(@Body() createUserDto: CreateTeacherDto) {
    return this.usersService.createUser(UserType.TEACHER, createUserDto);
  }

  @ApiOperation({
    summary: 'Update a teacher user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Teachers updated successfully',
  })
  @Patch('/professores')
  public updateTeachers(@Body() patchTeacherDto: PatchTeacherDto) {
    return this.usersService.updateUser(UserType.TEACHER, patchTeacherDto);
  }

  @ApiOperation({
    summary: 'Update a teacher user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
  })
  @Patch('/alunos')
  public updateStudents(@Body() patchStudentDto: PatchStudentDto) {
    return this.usersService.updateUser(UserType.STUDENT, patchStudentDto);
  }

  @ApiOperation({
    summary: 'Delete a user on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @Delete()
  public deleteUser(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
