import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationTypeEnum } from '../enums/organization-type.enum';

export const CreateOrganizationStub: CreateOrganizationDto = {
  telecom: 'telecom',
  type: OrganizationTypeEnum.CONSULTANT,
  name: 'Organization 1',
};
