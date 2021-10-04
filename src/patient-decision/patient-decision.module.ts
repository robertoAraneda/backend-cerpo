import { Module } from '@nestjs/common';
import { PatientDecisionService } from './services/patient-decision.service';
import { PatientDecisionController } from './controllers/patient-decision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientDecisionRepository } from './repositories/patient-decision.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientDecisionRepository])],
  controllers: [PatientDecisionController],
  providers: [PatientDecisionService],
})
export class PatientDecisionModule {}
