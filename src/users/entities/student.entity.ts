import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity('aluno')
export class Student extends User {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  registration: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  course: string;
}
