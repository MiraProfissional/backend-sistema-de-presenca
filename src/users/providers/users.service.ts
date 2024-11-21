import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
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
import { Teacher } from '../entities/teacher.entity';
import { Student } from '../entities/student.entity';

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
    private readonly usersRepository: Repository<User>,

    /* 
    Injecting teachersRepository
    */
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,

    /* 
    Injecting studentsRepository
    */
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

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

  public async findOneUserByEmail(email: string) {
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.query(
        `SELECT * FROM public."user" WHERE TRIM(email) = $1 LIMIT 1`,
        [email.trim()],
      );
    } catch (error) {
      throw new RequestTimeoutException(error);
    }

    if (!user[0]) {
      throw new UnauthorizedException('User does not exist');
    }

    return user[0];
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

  public async deleteUser(id: number) {
    return await this.deleteUserByIdProvider.deleteUserById(id);
  }
}
