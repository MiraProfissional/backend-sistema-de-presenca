import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  ipCamera: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.disciplines, {
    eager: true,
    nullable: false,
  })
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.disciplines, { eager: true })
  @JoinTable()
  students: Student[];
}
