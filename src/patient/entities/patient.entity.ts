import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Case } from '../../case/entities/case.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { Region } from '../../region/entities/region.entity';

@Entity('patients')
export class Patient {
  constructor(partial: Partial<Patient>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ comment: 'Identificador paciente' })
  id: number;

  @Column({
    unique: true,
  })
  rut: string;

  @Column()
  given: string;

  @Column({ name: 'father_family' })
  fatherFamily: string;

  @Column({ name: 'mother_family' })
  motherFamily: string;

  @Column({ type: 'date' })
  birthdate: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  mobile: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @OneToMany(() => Case, (cases) => cases.deliveryRoute)
  cases: Case[];

  /*
  @ManyToOne(() => Region, (region) => region.patient)
  @JoinColumn({ name: 'region_id' })
  region: Region;

   */
}
