import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DisciplinesService } from './providers/disciplines.service';
import { CreateDisciplineDto } from './dtos/create-discipline.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActiveUser } from 'src/auth/decorators/active-user-data.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { GetDisciplinesParamDto } from './dtos/get-disciplines-param.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { UpdateDisciplineDto } from './dtos/update-discipline.dto';
import { AddStudentsDto } from './dtos/add-students.dto';
import { GetLinkedDisciplinesByIdDto } from './dtos/get-linked-disciplines-by-id.dto';
import { ConnectDisciplineCameraDto } from './dtos/connect-discipline-camera.dto';

@Controller('disciplines')
export class DisciplinesController {
  constructor(
    //Injecting disciplinesService
    private readonly disciplinesService: DisciplinesService,
  ) {}

  @ApiOperation({
    summary: 'Fetch disciplines on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplines fetched successfully',
  })
  @Get('/:id?')
  public getDisciplines(
    @Param() getDisciplinesParamDto: GetDisciplinesParamDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.disciplinesService.getDiscplines(
      getDisciplinesParamDto,
      paginationQueryDto,
    );
  }

  @ApiOperation({
    summary: 'Get all disciplines linked to an user (professor or aluno)',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplines fetched  successfully',
  })
  @Get('/linked-disciplines/:userId')
  public getDisciplinesLinkedId(
    @Param('userId', ParseIntPipe) disciplineId: number,
    @Query() getLinkedDisciplinesByIdDto: GetLinkedDisciplinesByIdDto,
  ) {
    return this.disciplinesService.getDisciplinesLinkedToAnId(
      disciplineId,
      getLinkedDisciplinesByIdDto,
    );
  }

  @ApiOperation({
    summary: 'Add a student into a discipline',
  })
  @ApiResponse({
    status: 200,
    description: 'Student added successfully',
  })
  @Post('/:disciplineId/students')
  public addStudentToDiscipline(
    @Param('disciplineId', ParseIntPipe) disciplineId: number,
    @Body() addStudentsDto: AddStudentsDto,
  ) {
    return this.disciplinesService.addStudentsToDisciplineById(
      disciplineId,
      addStudentsDto,
    );
  }

  @ApiOperation({
    summary: "Turn on the discipline's camera",
  })
  @ApiResponse({
    status: 200,
    description: 'Camera turned on successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Post('connect-camera')
  public connectDisciplineCamera(
    @Body() connectDisciplineCameraDto: ConnectDisciplineCameraDto,
  ) {
    return this.disciplinesService.connectDisciplineCamera(
      connectDisciplineCameraDto,
    );
  }

  @ApiOperation({
    summary: 'Create a discipline on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Discipline created successfully',
  })
  @Post()
  public createDisciplines(
    @Body() createDisciplineDto: CreateDisciplineDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.disciplinesService.createDisciplines(createDisciplineDto, user);
  }

  @ApiOperation({
    summary: 'Updates a discipline on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Discipline updated successfully',
  })
  @Patch()
  public updateDisciplines(@Body() updateDisciplineDto: UpdateDisciplineDto) {
    return this.disciplinesService.updateDiscipline(updateDisciplineDto);
  }

  @ApiOperation({
    summary: 'Deletes a discipline on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Discipline deleted successfully',
  })
  @Delete()
  public deleteDisciplines(@Query('id', ParseIntPipe) id: number) {
    return this.disciplinesService.deleteDisciplineById(id);
  }

  @ApiOperation({
    summary: 'Removes a student from a discipline',
  })
  @ApiResponse({
    status: 200,
    description: 'Student removed successfully',
  })
  @Delete('/:disciplineId/students')
  public deleteDisciplineStudent(
    @Param('disciplineId', ParseIntPipe) disciplineId: number,
    @Body() deleteStudentsDto: AddStudentsDto,
  ) {
    return this.disciplinesService.addDisciplineStudentById(
      disciplineId,
      deleteStudentsDto,
    );
  }

  @ApiOperation({
    summary: 'Soft deletes a discipline on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Discipline soft deleted successfully',
  })
  @Delete('soft-delete')
  public softDeleteDisciplines(@Query('id', ParseIntPipe) id: number) {
    return this.disciplinesService.softDeleteDisciplineById(id);
  }
}
