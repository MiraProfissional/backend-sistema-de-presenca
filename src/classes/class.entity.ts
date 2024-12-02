import { Discipline } from 'src/disciplines/discipline.entity';
import { Student } from 'src/users/entities/student.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  date: Date;

  @Column({
    type: 'int',
    nullable: false,
  })
  timeCameraWasOn: number;

  @ManyToOne(() => Discipline, (discipline) => discipline.classes)
  discipline: Discipline;

  @ManyToMany(() => Student, (student) => student.classes, { eager: true })
  presentStudents?: Student[];
}
