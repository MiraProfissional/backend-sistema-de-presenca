import { ChildEntity, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';

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

  @ManyToMany(() => Discipline, (discipline) => discipline.students)
  disciplines: Student[];
}
