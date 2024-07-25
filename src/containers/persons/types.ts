import { SyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { NewPerson, Organisations } from '@/types/api';

import { AddressTypeWithIndex } from '../organisations/editOrganisation/types';
import { CreatePersonFormProps } from './editPersons/types';

export type AddressType = {
  countryCode?: string | undefined;
  houseNumber?: string | undefined;
  street?: string | undefined;
  postalCode?: string | undefined;
  city?: string | undefined;
  isPrimary: boolean;
};

export interface CreatePersonProps {
  organisations: Organisations['data'];
}

export type ExternalHandlersType = {
  onSubmit: (e: SyntheticEvent) => void;
  onCancel: (e: SyntheticEvent) => void;
};

export interface CreateEditPersonFormProps {
  externalHandlers?: ExternalHandlersType;
  isPending: boolean;
  isFromQQ?: boolean;
  isEditPage: boolean;
  onAddAddressClick: () => void;
  organisations: Organisations['data'];
  getEditAddress: (address: AddressTypeWithIndex) => void;
  formMethods: UseFormReturn<NewPerson & CreatePersonFormProps>;
  isDuplicatePerson?: boolean;
}
