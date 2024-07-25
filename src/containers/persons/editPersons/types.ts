import { Dayjs } from 'dayjs';

import { AddressType } from '@/types/api';

interface Organisation {
  name?: string;
  id?: string;
}
export interface CreatePersonFormProps {
  id?: string;
  newEmail?: string;
  middleName?: string;
  searchAddress?: string;
  newPhoneNumber?: string;
  newAddress?: AddressType;
  organisation?: Organisation;
  newDateOfBirth?: Dayjs | null;
  newDriversLicenseExpiry?: Dayjs | null;
}
