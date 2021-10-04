import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('committee_results')
export class CommitteeResult {
  constructor(partial: Partial<CommitteeResult>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ comment: 'Identificador principal' })
  id: number;

  @Column({
    default: true,
  })
  active: boolean;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
