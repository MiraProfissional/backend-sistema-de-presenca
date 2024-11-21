import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity('professor')
export class Teacher extends User {
  @Column()
  identifier: string;
}
