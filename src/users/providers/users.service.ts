import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-user.provider';
import { Repository } from 'typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { GetUserByIdProvider } from './get-user-by-id.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreateTeacherDto } from '../dtos/teachers/create-teacher.dto';
import { CreateStudentDto } from '../dtos/students/create-student.dto';
import { GetUsersParamDto } from '../dtos/users/get-users-param.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { PatchStudentDto } from '../dtos/students/patch-student.dto';
import { PatchTeacherDto } from '../dtos/teachers/patch-teacher.dto';
import { UserType } from '../enums/user-type.enum';
import { PatchUserProvider } from './patch-user.provider';
import { DeleteUserByIdProvider } from './delete-user-by-id.provider';
import { GetUsersQueryDto } from '../dtos/users/get-users-query.dto';
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';
import { DeleteUsersQueryDto } from '../dtos/users/delete-user.dto';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindUsersByIdProvider } from './find-users-by-id.provider';
import { GetUsersByRegistrationNumberProvider } from './get-users-by-registration-number.provider';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly createUserProvider: CreateUserProvider,

    private readonly deleteUserByIdProvider: DeleteUserByIdProvider,

    private readonly findOneUserByEmail: FindOneUserByEmailProvider,

    private readonly findUsersByIdProvider: FindUsersByIdProvider,

    private readonly getUserByIdProvider: GetUserByIdProvider,

    private readonly getUsersByRegistrationNumberProvider: GetUsersByRegistrationNumberProvider,

    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    private readonly paginationProvider: PaginationProvider,

    private readonly patchUserProvider: PatchUserProvider,
  ) {}

  public async createUser(
    userType: UserType,
    createUserDto: CreateTeacherDto | CreateStudentDto,
  ) {
    return this.createUserProvider.createUser(userType, createUserDto);
  }

  public async getUsers(
    getUsersParamDto: GetUsersParamDto,
    getUsersQueryDto: GetUsersQueryDto,
  ) {
    if (getUsersParamDto.id) {
      return await this.findOneUserById(
        getUsersParamDto.id,
        getUsersQueryDto.userType,
      );
    }
    if (getUsersQueryDto.userType) {
      return await this.getGroupUsers(getUsersQueryDto);
    }
    if (!getUsersParamDto.id) {
      return await this.findAll(getUsersQueryDto);
    }
  }

  public async getGroupUsers(getUsersQueryDto: GetUsersQueryDto) {
    const paginationQueryDto: PaginationQueryDto = {
      limit: getUsersQueryDto.limit,
      page: getUsersQueryDto.page,
    };

    if (getUsersQueryDto.userType == UserType.STUDENT) {
      return await this.findAllStudents(paginationQueryDto);
    } else if (getUsersQueryDto.userType == UserType.TEACHER) {
      return await this.findAllTeachers(paginationQueryDto);
    }
  }

  /** The method to get all the users from the database */
  public async findAll(
    getUsersQueryDto: GetUsersQueryDto,
  ): Promise<Paginated<User>> {
    const paginationQueryDto: PaginationQueryDto = {
      limit: getUsersQueryDto.limit,
      page: getUsersQueryDto.page,
    };
    const users =
      await this.paginationProvider.paginateQueryAllUsers(paginationQueryDto);

    return users;
  }

  /** The method to get one specific user by your ID from the database */
  public async findOneUserById(id: number, userType: string) {
    return await this.getUserByIdProvider.getUserById(id, userType);
  }

  public async findUserByEmail(email: string) {
    return await this.findOneUserByEmail.findOneUserByEmail(email);
  }

  public async findAllTeachers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Teacher>> {
    const teachers = await this.paginationProvider.paginateQuery(
      {
        limit: paginationQueryDto.limit,
        page: paginationQueryDto.page,
      },
      this.teachersRepository,
    );

    return teachers;
  }

  public async findAllStudents(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Student>> {
    const students = await this.paginationProvider.paginateQuery(
      {
        limit: paginationQueryDto.limit,
        page: paginationQueryDto.page,
      },
      this.studentsRepository,
    );
    return students;
  }

  public async updateUser(
    userType: UserType,
    patchUserDto: PatchTeacherDto | PatchStudentDto,
  ) {
    return await this.patchUserProvider.updateUser(userType, patchUserDto);
  }

  public async deleteUser(deleteUsersQueryDto: DeleteUsersQueryDto) {
    return await this.deleteUserByIdProvider.deleteUserById(
      deleteUsersQueryDto,
    );
  }

  public async findStudentsById(ids: number[]) {
    return this.findUsersByIdProvider.findStudentsById(ids);
  }

  public async findTeachersById(ids: number[]) {
    return this.findUsersByIdProvider.findTeachersById(ids);
  }

  public async findStudentsByRegistrationNumber(registrationNumbers: number[]) {
    return await this.getUsersByRegistrationNumberProvider.findStudentsByRegistrationNumber(
      registrationNumbers,
    );
  }

  public async findTeachersByRegistrationNumber(registrationNumbers: number[]) {
    return await this.getUsersByRegistrationNumberProvider.findTeachersByRegistrationNumber(
      registrationNumbers,
    );
  }
}
