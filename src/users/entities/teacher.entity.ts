import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Discipline } from 'src/disciplines/discipline.entity';

@Entity()
export class Teacher extends User {
  @Column({
    type: 'int',
    nullable: false,
    unique: true,
  })
  identifier: number;

  @OneToMany(() => Discipline, (discipline) => discipline.teacher)
  disciplines: Discipline[];
}
