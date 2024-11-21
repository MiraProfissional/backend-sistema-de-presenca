import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';
import { Teacher } from 'src/users/entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/users/entities/student.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PaginationProvider {
  constructor(
    // Injecting request
    @Inject(REQUEST)
    private readonly request: Request,

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
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    // Create de request URLs
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newURL = new URL(this.request.url, baseURL);

    // Calculating the page numbers
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page == totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page == 1
        ? paginationQuery.page
        : paginationQuery.page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        currentPage: paginationQuery.page,
        totalPages: totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }

  public async paginateQueryAllUsers(
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<User>> {
    const teachers = await this.teachersRepository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    const students = await this.studentsRepository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    const allUsers = [...teachers, ...students];
    // Create de request URLs
    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newURL = new URL(this.request.url, baseURL);

    // Calculating the page numbers
    const totalItems =
      (await this.studentsRepository.count()) +
      (await this.teachersRepository.count());
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page == totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page == 1
        ? paginationQuery.page
        : paginationQuery.page - 1;

    const finalResponse: Paginated<User> = {
      data: allUsers,
      meta: {
        itemsPerPage: paginationQuery.limit,
        totalItems: totalItems,
        currentPage: paginationQuery.page,
        totalPages: totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };

    return finalResponse;
  }
}
