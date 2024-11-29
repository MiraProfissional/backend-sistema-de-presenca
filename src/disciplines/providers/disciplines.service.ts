import { Injectable } from '@nestjs/common';
import { CreateDisciplineProvider } from './create-discipline.provider';
import { CreateDisciplineDto } from '../dtos/create-discipline.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
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
import { AddStudentsDto } from '../dtos/add-students.dto';
import { AddStudentsToOneDisciplineProvider } from './add-students-to-one-discipline.provider';
import { DeleteDisciplineStudentsByIdProvider } from './delete-discipline-students-by-id.provider';
import { GetLinkedDisciplinesByIdDto } from '../dtos/get-linked-disciplines-by-id.dto';
import { GetDisciplinesLinkedToAnIdProvider } from './get-disciplines-linked-to-an-id.provider';
import { ConnectDisciplineCameraDto } from '../dtos/connect-discipline-camera.dto';
import { ConnectDisciplineCameraProvider } from './connect-discipline-camera.provider';

@Injectable()
export class DisciplinesService {
  constructor(
    private readonly addStudentsToOneDisciplineProvider: AddStudentsToOneDisciplineProvider,

    private readonly connectDisciplineCameraProvider: ConnectDisciplineCameraProvider,

    private readonly createDisciplineProvider: CreateDisciplineProvider,

    private readonly deleteDisciplineByIdProvider: DeleteDisciplineByIdProvider,

    private readonly deleteDisciplineStudentsByIdProvider: DeleteDisciplineStudentsByIdProvider,

    @InjectRepository(Discipline)
    private readonly disciplinesRepository: Repository<Discipline>,

    private readonly getDisciplineByIdProvider: GetDisciplineByIdProvider,

    private readonly getDisciplinesLinkedToAnIdProvider: GetDisciplinesLinkedToAnIdProvider,

    private readonly paginationProvider: PaginationProvider,

    private readonly softDeleteDisciplineByIdProvider: SoftDeleteDisciplineByIdProvider,

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

  public async addStudentsToDisciplineById(
    disciplineId: number,
    addStudentsDto: AddStudentsDto,
  ) {
    return await this.addStudentsToOneDisciplineProvider.addStudentsToOneDiscipline(
      disciplineId,
      addStudentsDto,
    );
  }

  public async addDisciplineStudentById(
    disciplineId: number,
    deleteStudentsDto: AddStudentsDto,
  ) {
    return await this.deleteDisciplineStudentsByIdProvider.deleteDisciplineStudentsById(
      disciplineId,
      deleteStudentsDto,
    );
  }

  public async getDisciplinesLinkedToAnId(
    userId: number,
    getLinkedDisciplinesByIdDto: GetLinkedDisciplinesByIdDto,
  ) {
    return await this.getDisciplinesLinkedToAnIdProvider.getDisciplinesLinkedToAnId(
      userId,
      getLinkedDisciplinesByIdDto.userType,
    );
  }

  public async connectDisciplineCamera(
    connectDisciplineCameraDto: ConnectDisciplineCameraDto,
  ) {
    return await this.connectDisciplineCameraProvider.connectDisciplineCamera(
      connectDisciplineCameraDto,
    );
  }
}
