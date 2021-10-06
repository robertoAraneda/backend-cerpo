import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './repositories/organization.repository';
import { CaseRepository } from '../case/repositories/case.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationRepository, CaseRepository])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
