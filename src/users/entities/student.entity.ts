import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';
import { Class } from 'src/classes/class.entity';

@Entity()
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
  disciplines: Discipline[];

  @ManyToMany(() => Class, (classe) => classe.presentStudents)
  classes: Class[];
}
