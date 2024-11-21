import { User } from 'src/users/entities/user.entity';
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

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    nullable: false,
  })
  teacher: User;

  @ManyToMany(() => User, (user) => user.id, { eager: true })
  @JoinTable()
  students: User[];
}
