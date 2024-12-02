import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../class.entity';

@Injectable()
export class AddPresentStudentsProvider {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  public async addPresentStudentsByRegistrationNumber(
    presentStudentsRegistration: number[],
  ) {
    return presentStudentsRegistration;
  }
}
