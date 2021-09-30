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

@Entity('patients')
export class Patient {
  constructor(partial: Partial<Patient>) {
    Object.assign(this, partial);
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador principal uuid' })
  id: string;

  @Column({
    unique: true,
  })
  rut: string;

  @Column()
  given: string;

  @Column({ name: 'father_family' })
  fatherFamily: string;

  @Column({ name: 'mother_family' })
  motherFamily: string;

  @Column({ type: 'date' })
  birthdate: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  mobile: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
