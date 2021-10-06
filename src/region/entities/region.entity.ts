import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Commune } from '../../commune/entities/commune.entity';

@Entity('regions')
export class Region {
  constructor(partial: Partial<Region>) {
    Object.assign(this, partial);
  }

  @PrimaryColumn({ comment: 'Identificador principal', unique: true })
  code: string;

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

  @OneToMany(() => Commune, (communes) => communes.region, { eager: true })
  communes: Commune[];
}
