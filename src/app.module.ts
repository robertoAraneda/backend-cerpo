import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { PatientsModule } from './patients/patients.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SystemsModule } from './systems/systems.module';
import { DeliveryRoutesModule } from './delivery-routes/delivery-routes.module';
import { StatusCasesModule } from './status-cases/status-cases.module';
import { RegionsModule } from './regions/regions.module';
import { CommitteeResultsModule } from './committee-results/committee-result.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(typeormConfig),
    PatientsModule,
    AuthModule,
    OrganizationsModule,
    SystemsModule,
    DeliveryRoutesModule,
    StatusCasesModule,
    RegionsModule,
    CommitteeResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
