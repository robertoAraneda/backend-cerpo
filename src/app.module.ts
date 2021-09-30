import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { PatientsModule } from './patients/patients.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(typeormConfig),
    PatientsModule,
    AuthModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
