import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { PatientModule } from './patient/patient.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { SystemModule } from './system/system.module';
import { DeliveryRouteModule } from './delivery-route/delivery-route.module';
import { StatusCaseModule } from './status-case/status-case.module';
import { RegionModule } from './region/region.module';
import { CommitteeResultsModule } from './committee-result/committee-result.module';
import { PatientDecisionModule } from './patient-decision/patient-decision.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(typeormConfig),
    PatientModule,
    AuthModule,
    OrganizationModule,
    SystemModule,
    DeliveryRouteModule,
    StatusCaseModule,
    RegionModule,
    CommitteeResultsModule,
    PatientDecisionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
