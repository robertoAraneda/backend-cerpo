import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../auth/role.enum';
import { Case } from '../../case/entities/case.entity';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ comment: 'Identificador principal uuid' })
  id: number;

  @Column()
  given: string;

  @Column({ name: 'father_family' })
  fatherFamily: string;

  @Column({ name: 'mother_family' })
  motherFamily: string;

  @Column({
    unique: true,
  })
  rut: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @Column({ nullable: true })
  salt: string;

  @Column({
    enum: Role,
    nullable: true,
  })
  role: Role;

  @OneToMany(() => Case, (cases) => cases.system)
  cases: Case[];
}
