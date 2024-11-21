import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';

@Entity()
@TableInheritance({
  column: {
    name: 'type',
    type: 'enum',
    enum: UserType,
  },
})
export class User {
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
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  dateBirth: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  cpf: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  cellphone: string;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
  })
  type: UserType;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
