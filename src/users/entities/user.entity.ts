import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { Role } from '../../auth/role.enum';

@Entity('users')
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
  @IsUUID()
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador principal uuid' })
  id: string;

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
}
