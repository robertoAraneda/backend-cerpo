import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';

@Entity('delivery_routes')
export class DeliveryRoute {
  constructor(partial: Partial<DeliveryRoute>) {
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
