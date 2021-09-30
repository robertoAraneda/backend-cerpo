import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationTypeEnum } from '../enums/organization-type.enum';

export const OrganizationStub: CreateOrganizationDto = {
  name: 'Organization 1',
  type: OrganizationTypeEnum.CONSULTANT,
  telecom: 'Telecom 1',
};
