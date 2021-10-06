import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Case } from '../../case/entities/case.entity';

@Entity('status_cases')
export class StatusCase {
  constructor(partial: Partial<StatusCase>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ comment: 'Identificador principal uuid' })
  id: number;

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

  @OneToMany(() => Case, (cases) => cases.system)
  cases: Case[];
}
