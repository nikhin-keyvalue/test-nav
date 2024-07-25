import { SyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  AddressType,
  EmailType,
  NewOrganisation,
  PhoneType,
} from '@/types/api';

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

export interface OrganisationFormProps {
  newEmail?: string;
  newPhoneNumber?: string;
  newAddress?: AddressType;
}

export interface AddressTypeWithIndex extends AddressType {
  index: number;
}

export type ExternalHandlersType = {
  onSubmit: (e: SyntheticEvent) => void;
  onCancel: (e: SyntheticEvent) => void;
};
export interface CreateEditOrganisationFormProps {
  isPending: boolean;
  externalHandlers?: ExternalHandlersType;
  isEditPage: boolean;
  onAddAddressClick: () => void;
  getEditAddress: (address: AddressTypeWithIndex) => void;
  formMethods: UseFormReturn<NewOrganisation & OrganisationFormProps>;
  isFromQQ?: boolean;
}
