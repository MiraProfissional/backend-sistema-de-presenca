import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { GetUserByIdProvider } from './providers/get-user-by-id.provider';
import { User } from './entities/user.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { PatchUserProvider } from './providers/patch-user.provider';
import { DeleteUserByIdProvider } from './providers/delete-user-by-id.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    GetUserByIdProvider,
    PatchUserProvider,
    DeleteUserByIdProvider,
  ],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Student, Teacher]),
    PaginationModule,
  ],
  exports: [UsersService, FindOneUserByEmailProvider],
})
export class UsersModule {}
