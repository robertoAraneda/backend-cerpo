import { Module } from '@nestjs/common';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationsController } from './controllers/organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsRepository } from './repositories/organizations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationsRepository])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
