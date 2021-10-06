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

@Entity('systems')
export class System {
  constructor(partial: Partial<System>) {
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

  @OneToMany(() => Case, (cases) => cases.system)
  cases: Case[];
}
