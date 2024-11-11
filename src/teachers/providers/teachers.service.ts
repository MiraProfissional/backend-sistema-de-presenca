import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class TeachersService {
  public async getTeachers(getUsersParamDto: GetUsersParamDto) {
    if (getUsersParamDto.id) {
      return this.findOneById(getUsersParamDto.id);
    }
    return this.findAll();
  }

  public async findAll() {
    return true;
  }

  public async findOneById(id: number) {
    return id;
  }
}
