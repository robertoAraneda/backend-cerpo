import { OrganizationTypeEnum } from '../enums/organization-type.enum';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsNotEmpty() @IsString() name: string;

  @IsNotEmpty() @IsString() type: OrganizationTypeEnum;

  @IsString() @IsOptional() telecom?: string;
}
