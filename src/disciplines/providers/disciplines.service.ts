import { Injectable } from '@nestjs/common';
import { CreateDisciplineProvider } from './create-discipline';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ActiveUserData } from 'src/auth/active-user.interface';

@Injectable()
export class DisciplinesService {
  constructor(
    //Injecting createDisciplineProvider
    private readonly createDisciplineProvider: CreateDisciplineProvider,
  ) {}

  public async createDisciplines(
    createDisciplineDto: CreateDisciplineDto,
    user: ActiveUserData,
  ) {
    return await this.createDisciplineProvider.createDiscipline(
      createDisciplineDto,
      user,
    );
  }
}
