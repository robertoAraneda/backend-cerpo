import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './controllers/organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationRepository])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
