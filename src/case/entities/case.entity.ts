import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patient/entities/patient.entity';
import { System } from '../../system/entities/system.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { User } from '../../user/entities/user.entity';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { Organization } from '../../organization/entities/organization.entity';

@Entity('cases')
export class Case {
  constructor(partial: Partial<Case>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ comment: 'Identificador caso' })
  id: number;

  @Column({
    comment: 'Edad gestacional ecografía de referencia',
    name: 'gestational_age_reference_ultrasound',
  })
  gestationalAgeReferenceUltrasound: string;

  @Column({
    comment: 'Conclusión ecografía de referencia',
    name: 'conclusion_reference_ultrasound',
  })
  conclusionReferenceUltrasound: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  diagnosis: string;

  @Column({
    length: 2,
    comment: 'Número de embarazos',
    name: 'diagnosis_gravida',
  })
  diagnosisGravida: string;

  @Column({
    length: 2,
    comment: 'Número de partos viables',
    name: 'diagnosis_para',
  })
  diagnosisPara: string;

  @Column({
    length: 2,
    comment: 'Número de abortos',
    name: 'diagnosis_abortus',
  })
  diagnosisAbortus: string;

  @Column({
    type: 'text',
  })
  echocardiogram: string;

  @Column({
    type: 'text',
  })
  neurosonography: string;

  @Column({
    type: 'text',
    name: 'fetal_magnetic_resonance',
  })
  fetalMagneticResonance: string;

  @Column({
    type: 'text',
    name: 'invasive_procedure',
  })
  invasiveProcedure: string;

  @Column({
    type: 'text',
  })
  karyogram: string;

  @Column({
    type: 'text',
  })
  doppler: string;

  @Column({
    type: 'text',
  })
  torch: string;

  @Column({
    type: 'text',
  })
  psychosocial: string;

  @Column({
    comment: 'Fecha ecografía',
    type: 'date',
    name: 'reference_ultrasound_at',
  })
  referenceUltrasoundAt: string;

  @Column({
    comment: 'Fecha última regla',
    type: 'date',
    name: 'last_menstrual_period_at',
  })
  lastMenstrualPeriodAt: string;

  @Column({
    comment: 'Fecha último control',
    type: 'date',
    name: 'last_control_at',
  })
  lastControlAt: string;

  @Column({
    comment: 'Fecha próximo control',
    type: 'date',
    name: 'next_control_at',
  })
  nextControlAt: string;

  @Column({
    comment: 'Fecha probable de parto',
    type: 'date',
    name: 'estimated_date_confinement',
  })
  estimatedDateConfinement: string;

  @Column({
    comment: 'Fecha alto riesgo',
    type: 'date',
    name: 'high_risk_at',
  })
  highRiskAt: string;

  @Column({
    comment: 'Fecha visita psicólogo',
    type: 'date',
    name: 'psychologist_visit_at',
  })
  psychologistVisitAt: string;

  @Column({
    comment: 'Fecha parto',
    type: 'date',
    name: 'due_date_at',
  })
  dueDateAt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: string;

  @Column({ nullable: true })
  active: boolean;

  @ManyToOne(() => Patient, (patient) => patient.cases)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => System, (system) => system.cases)
  @JoinColumn({ name: 'system_id' })
  system: System;

  @ManyToOne(() => DeliveryRoute, (deliveryRoute) => deliveryRoute.cases)
  @JoinColumn({ name: 'delivery_route_id' })
  deliveryRoute: DeliveryRoute;

  @ManyToOne(() => User, (practitioner) => practitioner.cases)
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: User;

  @ManyToOne(() => CommitteeResult, (committeeResult) => committeeResult.cases)
  @JoinColumn({ name: 'committee_result_id' })
  committeeResult: CommitteeResult;

  @ManyToOne(() => StatusCase, (statusCase) => statusCase.cases)
  @JoinColumn({ name: 'status_case_id' })
  statusCase: StatusCase;

  @ManyToOne(() => Organization, (organization) => organization.cases)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
