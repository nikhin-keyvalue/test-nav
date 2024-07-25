export type AddressType = {
  isPrimary: boolean;
  city?: string | undefined;
  street?: string | undefined;
  postalCode?: string | undefined;
  houseNumber?: string | undefined;
  countryCode?: string | undefined;
};

export type PhoneType = {
  isPrimary: boolean;
  number?: string | undefined;
};

export type EmailType = {
  isPrimary: boolean;
  email?: string | undefined;
};

export type OrganisationFormType = {
  isActive: boolean;
  emails: EmailType[];
  name?: string | undefined;
  type?: string | undefined;
  website?: string | undefined;
  KvKNumber?: string | undefined;
  VATNumber?: string | undefined;
  addresses?: AddressType[] | undefined;
  phoneNumbers?: PhoneType[] | undefined;
};

export interface FormProps {
  newEmail?: string;
  searchAddress?: string;
  newPhoneNumber?: string;
  newAddress?: AddressType;
}
