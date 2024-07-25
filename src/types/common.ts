import { InputBaseComponentProps } from '@mui/material';

export type PaginationFields = 'limit' | 'offset';

export enum SINGLE_VALUED_SEARCH_PARAM_ENUM {
  NAME = 'name',
  SORT_ORDER = 'sortOrder',
  SORT_BY = 'sortBy',
}

export type SingleSelectionFields = 'name' | 'sortOrder' | 'sortBy';

export type ErrorMessageType =
  | 'DUPLICATE_OBJECT'
  | 'OBJECT_NOT_FOUND'
  | 'INPUT_VALIDATION_FAILED'
  | 'MALFORMED_MESSAGE_BODY'
  | 'INVALID_ACTION_ATTEMPTED'
  | '';

export type ApiErrorsType = {
  [key: string]: ErrorMessageType;
};

export type renameDialogFormType = {
  name: string;
};

// This interface is copied from Next's global.d.ts file since typecheck in
// tsc-files was not detecting the type for RequestInit in pre-commit typecheck
export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}
export interface RequestInit extends globalThis.RequestInit {
  next?: NextFetchRequestConfig | undefined;
}
export type MultiSelectionFields =
  | 'type'
  | 'phase'
  | 'isActive'
  | 'status'
  | 'dealerId'
  | 'salespersonId'
  | 'customerId';

export type GenderTypes = 'male' | 'female' | 'unspecified';

export type PoliteFormTypes = 'Jij' | 'U';

export type PersonType = 'Business' | 'Private' | undefined;

export enum PersonTypeEnum {
  Business = 'Business',
  Private = 'Private',
}

export enum DocumentParentEntities {
  OPPORTUNITIES = 'opportunities',
  DELIVERIES = 'deliveries',
}

export type FieldNames =
  | 'type'
  | 'name'
  | 'emails'
  | 'status'
  | 'dealer'
  | 'closeDate'
  | 'customerId'
  | 'phoneNumbers'
  | 'salespersons'
  | 'organisationId'
  | 'leasingCompanyId'
  | 'additionalComments';

export type CountryNameList =
  | 'Andorra'
  | 'UnitedArabEmirates'
  | 'Afghanistan'
  | 'AntiguaandBarbuda'
  | 'Anguilla'
  | 'Albania'
  | 'Armenia'
  | 'Angola'
  | 'Antarctica'
  | 'Argentina'
  | 'AmericanSamoa'
  | 'Austria'
  | 'Australia'
  | 'Aruba'
  | 'ÅlandIslands'
  | 'Azerbaijan'
  | 'BosniaandHerzegovina'
  | 'Barbados'
  | 'Bangladesh'
  | 'Belgium'
  | 'BurkinaFaso'
  | 'Bulgaria'
  | 'Bahrain'
  | 'Burundi'
  | 'Benin'
  | 'SaintBarthélemy'
  | 'Bermuda'
  | 'BruneiDarussalam'
  | 'BoliviaPlurinationalStateof'
  | 'BonaireSintEustatiusandSaba'
  | 'Brazil'
  | 'Bahamas'
  | 'Bhutan'
  | 'BouvetIsland'
  | 'Botswana'
  | 'Belarus'
  | 'Belize'
  | 'Canada'
  | 'CocosKeelingIslands'
  | 'CongoDemocraticRepublicofthe'
  | 'CentralAfricanRepublic'
  | 'Congo'
  | 'Switzerland'
  | 'CôtedIvoire'
  | 'CookIslands'
  | 'Chile'
  | 'Cameroon'
  | 'China'
  | 'Colombia'
  | 'CostaRica'
  | 'Cuba'
  | 'CaboVerde'
  | 'Curaçao'
  | 'ChristmasIsland'
  | 'Cyprus'
  | 'Czechia'
  | 'Germany'
  | 'Djibouti'
  | 'Denmark'
  | 'Dominica'
  | 'DominicanRepublic'
  | 'Algeria'
  | 'Ecuador'
  | 'Estonia'
  | 'Egypt'
  | 'WesternSahara'
  | 'Eritrea'
  | 'Spain'
  | 'Ethiopia'
  | 'Finland'
  | 'Fiji'
  | 'FalklandIslandsMalvinas'
  | 'MicronesiaFederatedStatesof'
  | 'FaroeIslands'
  | 'France'
  | 'Gabon'
  | 'UnitedKingdomofGreatBritainandNorthernIreland'
  | 'Grenada'
  | 'Georgia'
  | 'FrenchGuiana'
  | 'Guernsey'
  | 'Ghana'
  | 'Gibraltar'
  | 'Greenland'
  | 'Gambia'
  | 'Guinea'
  | 'Guadeloupe'
  | 'EquatorialGuinea'
  | 'Greece'
  | 'SouthGeorgiaandtheSouthSandwichIslands'
  | 'Guatemala'
  | 'Guam'
  | 'GuineaBissau'
  | 'Guyana'
  | 'HongKong'
  | 'HeardIslandandMcDonaldIslands'
  | 'Honduras'
  | 'Croatia'
  | 'Haiti'
  | 'Hungary'
  | 'Indonesia'
  | 'Ireland'
  | 'Israel'
  | 'IsleofMan'
  | 'India'
  | 'BritishIndianOceanTerritory'
  | 'Iraq'
  | 'IranIslamicRepublicof'
  | 'Iceland'
  | 'Italy'
  | 'Jersey'
  | 'Jamaica'
  | 'Jordan'
  | 'Japan'
  | 'Kenya'
  | 'Kyrgyzstan'
  | 'Cambodia'
  | 'Kiribati'
  | 'Comoros'
  | 'SaintKittsandNevis'
  | 'KoreaDemocraticPeoplesRepublicof'
  | 'KoreaRepublicof'
  | 'Kuwait'
  | 'CaymanIslands'
  | 'Kazakhstan'
  | 'LaoPeoplesDemocraticRepublic'
  | 'Lebanon'
  | 'SaintLucia'
  | 'Liechtenstein'
  | 'SriLanka'
  | 'Liberia'
  | 'Lesotho'
  | 'Lithuania'
  | 'Luxembourg'
  | 'Latvia'
  | 'Libya'
  | 'Morocco'
  | 'Monaco'
  | 'MoldovaRepublicof'
  | 'Montenegro'
  | 'SaintMartinFrenchpart'
  | 'Madagascar'
  | 'MarshallIslands'
  | 'NorthMacedonia'
  | 'Mali'
  | 'Myanmar'
  | 'Mongolia'
  | 'Macao'
  | 'NorthernMarianaIslands'
  | 'Martinique'
  | 'Mauritania'
  | 'Montserrat'
  | 'Malta'
  | 'Mauritius'
  | 'Maldives'
  | 'Malawi'
  | 'Mexico'
  | 'Malaysia'
  | 'Mozambique'
  | 'Namibia'
  | 'NewCaledonia'
  | 'Niger'
  | 'NorfolkIsland'
  | 'Nigeria'
  | 'Nicaragua'
  | 'Netherlands'
  | 'Norway'
  | 'Nepal'
  | 'Nauru'
  | 'Niue'
  | 'NewZealand'
  | 'Oman'
  | 'Panama'
  | 'Peru'
  | 'FrenchPolynesia'
  | 'PapuaNewGuinea'
  | 'Philippines'
  | 'Pakistan'
  | 'Poland'
  | 'SaintPierreandMiquelon'
  | 'Pitcairn'
  | 'PuertoRico'
  | 'PalestineStateof'
  | 'Portugal'
  | 'Palau'
  | 'Paraguay'
  | 'Qatar'
  | 'Réunion'
  | 'Romania'
  | 'Serbia'
  | 'RussianFederation'
  | 'Rwanda'
  | 'SaudiArabia'
  | 'SolomonIslands'
  | 'Seychelles'
  | 'Sudan'
  | 'Sweden'
  | 'Singapore'
  | 'SaintHelenaAscensionandTristandaCunha'
  | 'Slovenia'
  | 'SvalbardandJanMayen'
  | 'Slovakia'
  | 'SierraLeone'
  | 'SanMarino'
  | 'Senegal'
  | 'Somalia'
  | 'Suriname'
  | 'SouthSudan'
  | 'SaoTomeandPrincipe'
  | 'ElSalvador'
  | 'SintMaartenDutchpart'
  | 'SyrianArabRepublic'
  | 'Eswatini'
  | 'TurksandCaicosIslands'
  | 'Chad'
  | 'FrenchSouthernTerritories'
  | 'Togo'
  | 'Thailand'
  | 'Tajikistan'
  | 'Tokelau'
  | 'TimorLeste'
  | 'Turkmenistan'
  | 'Tunisia'
  | 'Tonga'
  | 'Türkiye'
  | 'TrinidadandTobago'
  | 'Tuvalu'
  | 'TaiwanProvinceofChina'
  | 'TanzaniaUnitedRepublicof'
  | 'Ukraine'
  | 'Uganda'
  | 'UnitedStatesMinorOutlyingIslands'
  | 'UnitedStatesofAmerica'
  | 'Uruguay'
  | 'Uzbekistan'
  | 'HolySee'
  | 'SaintVincentandtheGrenadines'
  | 'VenezuelaBolivarianRepublicof'
  | 'VirginIslandsBritish'
  | 'VirginIslandsUS'
  | 'VietNam'
  | 'Vanuatu'
  | 'WallisandFutuna'
  | 'Samoa'
  | 'Yemen'
  | 'Mayotte'
  | 'SouthAfrica'
  | 'Zambia'
  | 'Zimbabwe';

export type SearchParamKeys =
  | PaginationFields
  | SingleSelectionFields
  | MultiSelectionFields;

export type SearchParams = Record<SearchParamKeys, string>;

export interface QuickQuotationSearchParams extends SearchParams {
  opportunityId?: string;
  organisationId?: string;
  personId?: string;
  vehicleId?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  onClick: () => void;
}

export type AddressType = {
  countryCode?: string | undefined;
  houseNumber?: string | undefined;
  street?: string | undefined;
  postalCode?: string | undefined;
  city?: string | undefined;
  isPrimary: boolean;
};
export type PhoneType = {
  number?: string | undefined;
  isPrimary: boolean;
};

export type EmailType = {
  email?: string | undefined;
  isPrimary: boolean;
};

export interface PageProps {
  searchParams: SearchParams;
}

export interface EmailTemplatesPageProps {
  searchParams: SearchParams & { id: string };
}

export type DealerType = {
  dealerName?: string;
  dealerId?: string;
  id?: string;
};

export type SalesPersonType = {
  salesPersonId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  id?: string;
  loginId?: string;
};

export interface Option {
  id: string;
  name: string;
}

export enum ENTITIES {
  ORGANISATION = 'organisations',
  PERSON = 'persons',
}

export enum WORKFLOW_ENTITIES {
  DELIVERY = 'deliveries',
  OPPORTUNITY = 'opportunities',
  CARSTOCK = 'carstocks',
  PERSON = 'people',
  ORGANIZATION = 'organizations',
  LEAD = 'leads',
  CIC = 'cics',
}

export type ApiResponse = { success: boolean } | null;

export type NextServerActionAPIResponse = {
  success: boolean;
};

export type ProposalResponseDataType = {
  id?: string;
  proposalIdentifier?: string;
};

export type VoidFnType = () => void;

export type CustomerType = {
  id?: string;
  firstName?: string;
  lastName?: string;
};

export type PersonDetail = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  displayValue?: string;
};

// Extended mui types
export interface InputBaseComponentPropsWithTest
  extends InputBaseComponentProps {
  'data-testid'?: string;
}

export type InvalidFieldApiErrorResponseType = {
  name: string;
  fieldType: string;
  reason: string;
};

export type ObjectKeyValueStringType = {
  [key: string]: string;
};

export type DefaultErrorType = {
  isOk?: boolean;
  message?: string;
  statusCode?: number;
  statusText?: string;
  url?: string;
  invalidFields?: InvalidFieldApiErrorResponseType[];
  errorCode?: string; // TODO create a type with all error message when all api having proper error codes
};
