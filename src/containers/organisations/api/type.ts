import { paths } from '@generated/crm-service-types';

type AddressDataType = {
  type: string;
  indAfgeschermd: string;
  volledigAdres: string;
  straatnaam: string;
  huisnummer: number;
  postcode: string;
  plaats: string;
  land: string;
};

type TradeNameDataType = {
  naam: string;
  volgorde: number;
};

type SbiActivityDataType = {
  sbiCode: string;
  sbiOmschrijving: string;
  indHoofdactiviteit: string;
};

type LinkDataType = {
  rel: string;
  href: string;
};

type MainBranchDataTye = {
  vestigingsnummer: string;
  kvkNummer: string;
  formeleRegistratiedatum: string;
  materieleRegistratie: { datumAanvang: string };
  eersteHandelsnaam: string;
  indHoofdvestiging: string;
  indCommercieleVestiging: string;
  totaalWerkzamePersonen: number;
  adressen: AddressDataType[];
  websites: string[];
  links: LinkDataType[];
};

type OwnerDataType = {
  rechtsvorm: string;
  uitgebreideRechtsvorm: string;
  links: LinkDataType[];
};

type EmbeddeDataType = {
  hoofdvestiging: MainBranchDataTye;
  eigenaar: OwnerDataType;
};

export type KvkDetailsType = {
  kvkNummer: string;
  indNonMailing: string;
  naam: string;
  formeleRegistratiedatum: string;
  materieleRegistratie: { datumAanvang: string };
  totaalWerkzamePersonen: number;
  handelsnamen: TradeNameDataType[];
  sbiActiviteiten: SbiActivityDataType[];
  links: LinkDataType[];
  _embedded: EmbeddeDataType;
};

export type GETOrganisationByIdPathParameters =
  paths['/organisations/{organisationId}']['get']['parameters']['path'];
export type GETOrganisationByIdQueryParameters =
  paths['/organisations/{organisationId}']['get']['parameters']['query'];
