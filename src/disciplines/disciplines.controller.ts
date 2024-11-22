import { Body, Controller, Post } from '@nestjs/common';
import { DisciplinesService } from './providers/disciplines.service';
import { CreateDisciplineDto } from './dtos/create-discipline.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActiveUser } from 'src/auth/decorators/active-user-data.decorator';
import { ActiveUserData } from 'src/auth/active-user.interface';

@Controller('disciplines')
export class DisciplinesController {
  constructor(
    //Injecting disciplinesService
    private readonly disciplinesService: DisciplinesService,
  ) {}

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
}
