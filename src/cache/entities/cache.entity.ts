import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cache {
  constructor(partial: Partial<Cache>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({
    comment: 'Identificador principal cache',
  })
  id: number;

  @Column()
  value: string;

  @Column({
    name: 'expires_in',
  })
  expiresIn: number;

  @Column()
  type: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: string;
}
