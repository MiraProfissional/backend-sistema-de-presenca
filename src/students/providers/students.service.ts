import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../student.entity';
import { Repository } from 'typeorm';
import { GetUsersParamDto } from 'src/teachers/dtos/get-teacher-param.dto';
import { CreateTeacherDto } from 'src/teachers/dtos/create-teacher.dto';
import { PatchTeacherDto } from 'src/teachers/dtos/patch-teacher.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  public async getStudents(getUsersParamDto: GetUsersParamDto) {
    if (getUsersParamDto.id) {
      return await this.findOneById(getUsersParamDto.id);
    }
    return await this.findAll();
  }

  public async findAll() {
    let students = undefined;

    try {
      students = await this.studentRepository.find();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }
    return students;
  }

  public async findOneById(id: number) {
    let student = undefined;
    try {
      student = await this.studentRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    // Handle the student does not exist
    if (!student) {
      throw new BadRequestException('The student ID does not exist');
    }

    return student;
  }

  public async createStudent(createStudentDto: CreateTeacherDto) {
    let existingStudent = undefined;

    try {
      // Checking if already exist an user with same email
      existingStudent = await this.studentRepository.findOne({
        where: { email: createStudentDto.email },
      });
    } catch (error) {
      // Might save the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    // Handle exception
    if (existingStudent) {
      throw new BadRequestException(
        'The student already exists, please check your email.',
      );
    }

    // Create a new user
    let newStudent = this.studentRepository.create(createStudentDto);

    try {
      newStudent = await this.studentRepository.save(newStudent);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    return newStudent;
  }

  public async updateStudent(patchStudentDto: PatchTeacherDto) {
    // Find the Student
    let student = undefined;

    try {
      student = await this.studentRepository.findOneBy({
        id: patchStudentDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    if (!student) {
      throw new BadRequestException('The post ID does not exist');
    }

    // Update the properties
    student.name = patchStudentDto.name ?? patchStudentDto.name;
    student.email = patchStudentDto.email ?? patchStudentDto.email;
    student.password = patchStudentDto.password ?? patchStudentDto.password;
    student.dateBirth = patchStudentDto.dateBirth ?? patchStudentDto.dateBirth;
    student.cpf = patchStudentDto.cpf ?? patchStudentDto.cpf;
    student.cellphone = patchStudentDto.cellphone ?? patchStudentDto.cellphone;

    // Save the Student
    try {
      await this.studentRepository.save(student);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    return student;
  }

  public async deleteStudent(id: number) {
    try {
      // Deleting the Student
      await this.studentRepository.delete(id);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unbale to process your request at the moment, please try later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    // Confirmation
    return { deleted: true, id };
  }
}
