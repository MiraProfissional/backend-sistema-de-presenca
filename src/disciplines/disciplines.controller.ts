import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DisciplinesService } from './providers/disciplines.service';
import { CreateDisciplineDto } from './dtos/create-discipline.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActiveUser } from 'src/auth/decorators/active-user-data.decorator';
import { ActiveUserData } from 'src/auth/active-user.interface';
import { GetDisciplinesParamDto } from './dtos/get-disciplines-param.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { UpdateDisciplineDto } from './dtos/update-discipline.dto';

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

  @Patch()
  public updateDisciplines(@Body() updateDisciplineDto: UpdateDisciplineDto) {
    return this.disciplinesService.updateDiscipline(updateDisciplineDto);
  }
}
