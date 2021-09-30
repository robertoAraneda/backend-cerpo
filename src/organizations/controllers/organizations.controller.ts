import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from '../services/organizations.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetOrganizationsFilterDto } from '../dto/get-organizations-filter.dto';
import { Organization } from '../entities/organization.entity';

@Controller('organizations')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }

  @Get()
  getOrganizations(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetOrganizationsFilterDto,
  ): Promise<Organization[]> {
    return this.organizationsService.getOrganizations(filterDto);
  }

  @Get(':id')
  getOrganizationById(@Param('id') id: string): Promise<Organization> {
    return this.organizationsService.getOrganizationById(id);
  }

  @Patch(':id')
  updateOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.updateOrganization(
      id,
      updateOrganizationDto,
    );
  }

  @Delete(':id')
  removeOrganization(@Param('id') id: string): Promise<void> {
    return this.organizationsService.removeOrganization(id);
  }
}
