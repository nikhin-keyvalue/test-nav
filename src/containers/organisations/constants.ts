import { z } from 'zod';

import { NAME_REGEX } from '@/constants/common';
import { ORGANISATION_TYPES } from '@/constants/filter';
import { asOptionalField } from '@/utils/validations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NewOrganisation = (t: (arg: any) => string) => ({
  KvKNumber: asOptionalField(
    z.string().min(8, { message: t('minEightCharacter') })
  ),
  VATNumber: asOptionalField(z.string()),
  website: asOptionalField(z.string()),
  // Validation is also done in component level, this is used in Address dialog for KVK fetch validation
  newAddress: z.object({
    countryCode: asOptionalField(z.string()),
    houseNumber: asOptionalField(
      z
        .string({ required_error: t('mandatoryMessage') })
        .or(z.number({ required_error: t('mandatoryMessage') }))
    ),
    street: asOptionalField(
      z.string({ required_error: t('mandatoryMessage') })
    ),
    postalCode: asOptionalField(
      z.string({ required_error: t('mandatoryMessage') })
    ),
    city: asOptionalField(z.string()),
    isPrimary: asOptionalField(z.boolean()),
  }),
  newPhoneNumber: asOptionalField(z.string()),
  newEmail: asOptionalField(z.string()),
  name: z
    .string({ required_error: t('mandatoryMessage') })
    .min(1, { message: t('mandatoryMessage') })
    .regex(NAME_REGEX, t('enterValidName')),
  type: z.enum(
    [
      ORGANISATION_TYPES.DEALER,
      ORGANISATION_TYPES.ORGANISATION,
      ORGANISATION_TYPES.LEASING_COMPANY,
    ],
    { required_error: t('mandatoryMessage') }
  ),
  phoneNumbers: z
    .array(
      z.object({
        number: z.string(),
        isPrimary: z.boolean(),
        countryCode: z.string(),
      })
    )
    .optional(),
  emails: z
    .array(
      z.object({
        email: z.string(),
        isPrimary: z.boolean(),
      })
    )
    .min(1, { message: t('mandatoryMessage') }),
  addresses: z
    .array(
      z.object({
        countryCode: asOptionalField(z.string()),
        houseNumber: asOptionalField(
          z
            .string({ required_error: t('mandatoryMessage') })
            .or(z.number({ required_error: t('mandatoryMessage') }))
        ),
        street: asOptionalField(
          z.string({ required_error: t('mandatoryMessage') })
        ),
        postalCode: asOptionalField(
          z.string({ required_error: t('mandatoryMessage') })
        ),
        city: asOptionalField(z.string()),
        isPrimary: asOptionalField(z.boolean()),
      })
    )
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NewOrganisationValidationSchema = (t: (arg: any) => string) =>
  z.object(NewOrganisation(t));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditOrganisationValidationSchema = (t: (arg: any) => string) =>
  z.object({
    ...NewOrganisation(t),
    isActive: z.boolean(),
  });

export const postCodeAccessibleCountries = [
  'NL',
  'AT',
  'DK',
  'BE',
  'FR',
  'DE',
  'LU',
  'ES',
  'CH',
  'GB',
];
