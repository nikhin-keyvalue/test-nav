import { components, paths } from '@generated/crm-service-types';

export type Organisations =
  paths['/organisations']['get']['responses']['200']['content']['application/json'];

export type OrganisationType = components['schemas']['OrganisationType'];

export type Persons =
  paths['/persons']['get']['responses']['200']['content']['application/json'];

export type PersonsDetails =
  paths['/persons/{personId}']['get']['responses']['200']['content']['application/json'];

export type IOrganisationDetails =
  paths['/organisations/{organisationId}']['get']['responses']['200']['content']['application/json'];

export type NewPerson =
  paths['/persons']['post']['requestBody']['content']['application/json'];

export type NewOrganisation =
  paths['/organisations']['post']['requestBody']['content']['application/json'];

export type AddressItem = components['schemas']['Address'];

export type Opportunities =
  paths['/opportunities']['get']['responses']['200']['content']['application/json'];

export type NewOpportunities =
  paths['/opportunities']['post']['requestBody']['content']['application/json'];

export type OpportunityDetails =
  paths['/opportunities/{opportunityId}']['get']['responses']['200']['content']['application/json'];

export type EditOpportunity =
  paths['/opportunities/{opportunityId}']['put']['requestBody']['content']['application/json'];
export type NewNote =
  paths['/notes']['post']['requestBody']['content']['application/json'];

export type NewNoteResponse =
  paths['/notes']['post']['responses']['200']['content']['application/json'];

export type NoteItem = components['schemas']['Note'];

export type AddressType = components['schemas']['Address'];

export type EmailType = components['schemas']['Email'];

export type PhoneType = components['schemas']['Mobile'];
export type NewConnection =
  | paths['/organisations/{organisationId}/connections']['post']['requestBody']['content']['application/json']
  | paths['/persons/{personId}/connections']['post']['requestBody']['content']['application/json'];

export type TradeInToOptions = components['schemas']['TradeInTo'];

export type MarginOptions = components['schemas']['Margin'];

export type Address = components['schemas']['Address'];

export type Phase = components['schemas']['Phase'];

export type DealerType = {
  dealerName?: string;
  dealerId?: string;
  id?: string;
};

export type GenderType = components['schemas']['Gender'];

export type PersonTypeStrict = components['schemas']['PersonType'];

export type Status = components['schemas']['Status'];

export type ErrorObjectType = {
  url: string;
  isOk: boolean;
  message: string;
  statusCode: number;
  statusText: string;
  errorCode?: string;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  phase: string;
  phaseCount: number;
  email: string;
  phoneNumber: string;
  address: Address;
  status: string;
};
