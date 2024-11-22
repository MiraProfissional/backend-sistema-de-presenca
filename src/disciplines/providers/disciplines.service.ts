import { Injectable } from '@nestjs/common';
import { CreateDisciplineProvider } from './create-discipline.provider';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ActiveUserData } from 'src/auth/active-user.interface';
import { GetDisciplinesParamDto } from '../dtos/get-disciplines-param.dto';
import { GetDisciplineByIdProvider } from './get-discipline-by-id.provider';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Discipline } from '../discipline.entity';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDisciplineDto } from '../dtos/update-discipline.dto';
import { UpdateDisciplineProvider } from './update-discipline.provider';
import { DeleteDisciplineByIdProvider } from './delete-discipline-by-id.provider';
import { SoftDeleteDisciplineByIdProvider } from './soft-delete-discipline-by-id.provider';

@Injectable()
export class DisciplinesService {
  constructor(
    //Injecting createDisciplineProvider
    private readonly createDisciplineProvider: CreateDisciplineProvider,

    //Injecting deleteDisciplineByIdProvider
    private readonly deleteDisciplineByIdProvider: DeleteDisciplineByIdProvider,

    //Injecting disciplinesRepository
    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    //Injecting getDisciplineByIdProvider
    private readonly getDisciplineByIdProvider: GetDisciplineByIdProvider,

    //Injecting paginationProvider
    private readonly paginationProvider: PaginationProvider,

    //Injecting softDeleteDisciplineByIdProvider
    private readonly softDeleteDisciplineByIdProvider: SoftDeleteDisciplineByIdProvider,

    //Injecting updateDisciplineProvider
    private readonly updateDisciplineProvider: UpdateDisciplineProvider,
  ) {}

  public async createDisciplines(
    createDisciplineDto: CreateDisciplineDto,
    user: ActiveUserData,
  ): Promise<Discipline> {
    return await this.createDisciplineProvider.createDiscipline(
      createDisciplineDto,
      user,
    );
  }

  public async getDiscplines(
    getDisciplinesParamDto: GetDisciplinesParamDto,
    paginationQueryDto: PaginationQueryDto,
  ) {
    if (getDisciplinesParamDto.id) {
      return this.findOneDisciplineById(getDisciplinesParamDto);
    } else {
      return this.findAllDisciplines(paginationQueryDto);
    }
  }

  public async findOneDisciplineById(
    getDisciplinesParamDto: GetDisciplinesParamDto,
  ): Promise<Discipline> {
    return await this.getDisciplineByIdProvider.getDisciplineById(
      getDisciplinesParamDto.id,
    );
  }

  public async findAllDisciplines(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Discipline>> {
    const disciplines = await this.paginationProvider.paginateQuery(
      {
        limit: paginationQueryDto.limit,
        page: paginationQueryDto.page,
      },
      this.disciplinesRepository,
    );

    return disciplines;
  }

  public async updateDiscipline(
    updateDisciplineDto: UpdateDisciplineDto,
  ): Promise<Discipline> {
    return await this.updateDisciplineProvider.updateDiscipline(
      updateDisciplineDto,
    );
  }

  public async deleteDisciplineById(id: number) {
    return await this.deleteDisciplineByIdProvider.deleteDisciplineById(id);
  }

  public async softDeleteDisciplineById(id: number) {
    return await this.softDeleteDisciplineByIdProvider.softDeleteDisciplineById(
      id,
    );
  }
}
