import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

/** Class to connect to Users table and perform business operations */
@Injectable()
export class UsersService {
  /** The constructor to connect AuthService with UsersService by Dependency Injection*/
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /* 
    Injecting usersRepository
    */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    // Inject createUserProvider
    private readonly createUserProvider: CreateUserProvider,

    //Injecting paginationProvider
    private readonly paginationProvider: PaginationProvider,

    //Injecting getUserByIdProvider
    private readonly getUserByIdProvider: GetUserByIdProvider,

    //Injecting patchUserProvider
    private readonly patchUserProvider: PatchUserProvider,

    //Injecting deleteUserByIdProvider
    private readonly deleteUserByIdProvider: DeleteUserByIdProvider,
  ) {}

  // Creating function for create users in the database
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
    if (getUsersQueryDto.userType) {
      return await this.getGroupUsers(getUsersQueryDto);
    }
    if (getUsersParamDto.id) {
      return await this.findOneUserById(getUsersParamDto.id);
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
    const users = await this.paginationProvider.paginateQuery(
      {
        limit: getUsersQueryDto.limit,
        page: getUsersQueryDto.page,
      },
      this.userRepository,
    );

    return users;
  }

  /** The method to get one specific user by your ID from the database */
  public async findOneUserById(id: number) {
    return await this.getUserByIdProvider.getUserById(id);
  }

  public async findOneUserByEmail(email: string) {
    console.log('Entrou na FindOneUserByEmailProvider');

    console.log('Email usado (TypeORM):', email);
    console.log('Parâmetros enviados (query):', [email]);

    const user = await this.userRepository.query(
      `SELECT * FROM public."user" WHERE TRIM(email) = $1 LIMIT 1`,
      [email.trim()],
    );

    console.log('Resultado (TRIM aplicado):', user);

    if (!user || user.length === 0) {
      throw new UnauthorizedException('User does not exist');
    }

    return user[0]; // Retorne apenas o primeiro resultado
  }

  public async findAllTeachers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<User>> {
    const teachers = await this.paginationProvider.paginateQueryForUsers(
      {
        limit: paginationQueryDto.limit,
        page: paginationQueryDto.page,
      },
      this.userRepository,
      UserType.TEACHER,
    );

    return teachers;
  }

  public async findAllStudents(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<User>> {
    console.log('Entrou');
    const users = await this.paginationProvider.paginateQueryForUsers(
      {
        limit: paginationQueryDto.limit,
        page: paginationQueryDto.page,
      },
      this.userRepository,
      UserType.STUDENT,
    );
    console.log('Saiu');
    return users;
  }

  public async updateUser(
    userType: UserType,
    patchUserDto: PatchTeacherDto | PatchStudentDto,
  ) {
    return await this.patchUserProvider.updateUser(userType, patchUserDto);
  }

  public async deleteUser(id: number) {
    console.log('deleteUserByIdProvider', this.deleteUserByIdProvider);
    return await this.deleteUserByIdProvider.deleteUserById(id);
  }
}
