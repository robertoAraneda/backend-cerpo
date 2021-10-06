import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Region } from '../../region/entities/region.entity';

@Entity('communes')
export class Commune {
  constructor(partial: Partial<Commune>) {
    Object.assign(this, partial);
  }

  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: string;

  @ManyToOne(() => Region, (region) => region.communes)
  @JoinColumn({ name: 'region_code', referencedColumnName: 'code' })
  region: Region;
}
