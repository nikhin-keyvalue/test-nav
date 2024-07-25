export enum PERSON_TYPES {
  BUSINESS = 'Business',
  PRIVATE = 'Private',
}

export enum ORGANISATION_TYPES {
  DEALER = 'Dealer',
  ORGANISATION = 'Organisation',
  LEASING_COMPANY = 'LeasingCompany',
}

const personTypesList = [PERSON_TYPES.BUSINESS, PERSON_TYPES.PRIVATE];

const organisationTypesList = [
  ORGANISATION_TYPES.DEALER,
  ORGANISATION_TYPES.ORGANISATION,
  ORGANISATION_TYPES.LEASING_COMPANY,
];

const phaseList = [
  'Buyer',
  'Prospect',
  'FormerBuyer',
  'FormerProspect',
  'Relation',
] as const;
const statusList = ['Active', 'Inactive'] as const;

const singleOptionFields = [
  'name',
  'sortOrder',
  'limit',
  'offset',
  'sortBy',
] as const;

export {
  personTypesList,
  phaseList,
  statusList,
  organisationTypesList,
  singleOptionFields,
};
