import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationTypeEnum } from '../enums/organization-type.enum';

@Entity('organizations')
export class Organization {
  constructor(partial: Partial<Organization>) {
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

  @Column({
    nullable: true,
  })
  telecom: string;

  @Column()
  type: OrganizationTypeEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
