import { OrganizationTypeEnum } from '../enums/organization-type.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: OrganizationTypeEnum;

  @IsString()
  telecom?: string;
}
