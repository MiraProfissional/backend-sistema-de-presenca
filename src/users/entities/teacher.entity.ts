import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';

@Entity()
export class Teacher extends User {
  @Column()
  identifier: string;

  @OneToMany(() => Discipline, (discipline) => discipline.teacher)
  disciplines: Discipline[];
}
