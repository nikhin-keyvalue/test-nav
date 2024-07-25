export enum SORT_ORDER_VALUES {
  ASCENDING = 'Asc',
  DESCENDING = 'Desc',
}

export const DEFAULT_LIST_QUERY_PARAMS = {
  offset: 0,
  limit: 10,
  sortOrder: SORT_ORDER_VALUES.ASCENDING,
};

export const VAT_MULTIPLIER = 1.21;

export const ALLOWED_PARAMS = [
  'limit',
  'offset',
  'name',
  'type',
  'phase',
  'isActive',
  'sortBy',
  'sortOrder',
  'status',
  'dealerId',
  'salespersonId',
  'customerId',
] as const;

export enum ConnectionRelationType {
  'OWNER' = 'Owner',
  'FRIEND' = 'Friend',
  'FAMILY' = 'Family',
  'CLIENT' = 'Client',
  'HOLDING' = 'Holding',
  'EMPLOYEE' = 'Employee',
  'CUSTOMER' = 'Customer',
  'EMPLOYER' = 'Employer',
  'DIRECTOR' = 'Director',
  'SUPPLIER' = 'Supplier',
  'NEIGHBOUR' = 'Neighbour',
  'SUBSIDIARY' = 'Subsidiary',
  'OWNED_ENTITY' = 'OwnedEntity',
  'ACQUAINTANCE' = 'Acquaintance',
  'PARTNER_ORGANISATION' = 'PartnerOrganisation',
}

export const personRelationTypesList = [
  ConnectionRelationType.FAMILY,
  ConnectionRelationType.FRIEND,
  ConnectionRelationType.NEIGHBOUR,
  ConnectionRelationType.ACQUAINTANCE,
];

export const personOrganisationRelationTypesList = [
  ConnectionRelationType.OWNER,
  ConnectionRelationType.EMPLOYEE,
  ConnectionRelationType.CUSTOMER,
  ConnectionRelationType.DIRECTOR,
];

export const organisationPersonRelationTypesList = [
  ConnectionRelationType.EMPLOYER,
  ConnectionRelationType.SUPPLIER,
  ConnectionRelationType.DIRECTOR,
  ConnectionRelationType.OWNED_ENTITY,
];

export const organisationRelationTypesList = [
  ConnectionRelationType.CLIENT,
  ConnectionRelationType.HOLDING,
  ConnectionRelationType.SUPPLIER,
  ConnectionRelationType.SUBSIDIARY,
  ConnectionRelationType.PARTNER_ORGANISATION,
];
export const PARAMS_WITH_METADATA = ['customerId'];

export const AUTH_COOKIE = 'webdealerami';

export const EMAIL_MESSAGE_INPUT_CHAR_LIMIT = 90;
export const EMAIL_REGEX =
  /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;

export const isValidEmailAddress = (input: string): boolean =>
  input.length < 250 && EMAIL_REGEX.test(input);
export const dutchNumberRegex =
  /^-?(\d{1,3}(?:[.,]\d{3})*(?:(?:[.,]\d{1,2}){0,1}){0,1}|\d{1,2}(?:[.,]\d{1,2})?)([eE][-+]?\d+)?$/;

export const NAME_REGEX =
  /^[\wäöüÄÖÜßäöåÄÖÅаАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯΑ-Ωα-ωίϊΐόάέύϋΰήώěščřžýáíéóúůďťňĎŇŤŠČŘŽÝÁÍÉÚŮĚÓÇĞIİÖŞÜçğşıüö'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ*(){}|~<>;:\\[\]]{1,}$/;

export const INITIALS_REGEX =
  /^[\wäöüÄÖÜßäöåÄÖÅаАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯΑ-Ωα-ωίϊΐόάέύϋΰήώěščřžýáíéóúůďťňĎŇŤŠČŘŽÝÁÍÉÚŮĚÓÇĞIİÖŞÜçğşıüö'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ*(){}|~<>;:\\[\]]*$/;
export const nullFn = () => null;

export const ALPHA_NUMERIC_WITH_HYPHEN_REGEX = /^(?=.*\S)[a-zA-Z0-9.\- ]+$/;

export const euroSymbol = '€';

export enum LocaleList {
  en_GB = 'en_GB',
  nl_NL = 'nl_NL',
}

export const LOCALE_LIST_ARRAY: Array<LocaleList> = [
  LocaleList.en_GB,
  LocaleList.nl_NL,
];
