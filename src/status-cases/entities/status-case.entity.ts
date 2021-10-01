import { IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('status_case')
export class StatusCase {
  constructor(partial: Partial<StatusCase>) {
    Object.assign(this, partial);
  }

  @IsUUID()
  @PrimaryGeneratedColumn('uuid', { comment: 'Identificador principal uuid' })
  id: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
