import { Student } from 'src/users/entities/student.entity';
import { Teacher } from 'src/users/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Discipline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  ipCamera: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.id, {
    eager: true,
    nullable: false,
  })
  teacher: Teacher;

  @ManyToMany(() => Student, (student) => student.id, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  students?: Student[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;
}
