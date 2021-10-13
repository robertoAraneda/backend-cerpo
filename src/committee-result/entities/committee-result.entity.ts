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

@Entity('committee_results')
export class CommitteeResult {
  constructor(partial: Partial<CommitteeResult>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({
    comment: 'Identificador principal resultado comité',
  })
  id: number;

  @Column({
    default: true,
  })
  active: boolean;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: string;

  @OneToMany(() => Case, (cases) => cases.committeeResult)
  cases: Case[];
}
