import dayjs from 'dayjs';
import { z } from 'zod';

import { INITIALS_REGEX, NAME_REGEX } from '@/constants/common';
import { PERSON_TYPES } from '@/constants/filter';
import { ApiErrorsType, PersonTypeEnum } from '@/types/common';
import { asOptionalField } from '@/utils/validations';

export enum GENDERS {
  MALE = 'Male',
  FEMALE = 'Female',
  UNKNOWN = 'Unspecified',
}

export enum POLITEFORM {
  JIJ = 'Jij',
  U = 'U',
}

export const genders = {
  male: GENDERS.MALE,
  female: GENDERS.FEMALE,
  unspecified: GENDERS.UNKNOWN,
};

export const apiErrors: ApiErrorsType = {
  duplicateObject: 'DUPLICATE_OBJECT',
  objectNotFount: 'OBJECT_NOT_FOUND',
  inputValidationFailed: 'INPUT_VALIDATION_FAILED',
  malformedMessageBody: 'MALFORMED_MESSAGE_BODY',
  invalidActionAttempt: 'INVALID_ACTION_ATTEMPTED',
};

export const politeForms = [POLITEFORM.JIJ, POLITEFORM.U];

export const personTypes = [PersonTypeEnum.Business, PersonTypeEnum.Private];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const personValidationObject = (t: (arg: any) => string) => ({
  initials: asOptionalField(
    z.string().regex(INITIALS_REGEX, t('enterValidName'))
  ),
  firstName: asOptionalField(
    z
      .string()
      .min(1, { message: t('mandatoryMessage') })
      .max(255)
      .regex(NAME_REGEX, t('enterValidName'))
  ),
  newDateOfBirth: asOptionalField(
    z.any().refine((value) => dayjs(value).isBefore(dayjs()), {
      message: t('futureDateNotAllowed'),
    })
  ),
  driversLicenseNumber: asOptionalField(z.string()),
  driversLicenseExpiry: asOptionalField(z.unknown()),
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
  newDriversLicenseExpiry: asOptionalField(z.unknown()),
  newPhoneNumber: asOptionalField(z.string()),
  newEmail: asOptionalField(z.string()),
  middleName: asOptionalField(
    z.string().regex(NAME_REGEX, t('enterValidName'))
  ),
  lastName: z
    .string({ required_error: t('mandatoryMessage') })
    .min(1, t('mandatoryMessage'))
    .regex(NAME_REGEX, t('enterValidName')),
  gender: z.enum([GENDERS.MALE, GENDERS.FEMALE, GENDERS.UNKNOWN], {
    required_error: t('mandatoryMessage'),
  }),
  type: z.enum([PERSON_TYPES.BUSINESS, PERSON_TYPES.PRIVATE], {
    required_error: t('mandatoryMessage'),
  }),
  politeForm: asOptionalField(
    z.enum([POLITEFORM.U, POLITEFORM.JIJ]).optional()
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
          z.string({
            required_error: t('mandatoryMessage'),
          })
        ),
        postalCode: asOptionalField(
          z.string({ required_error: t('mandatoryMessage') })
        ),
        city: asOptionalField(z.string()),
        isPrimary: asOptionalField(z.boolean()),
      })
    )
    .optional(),
  organisation: asOptionalField(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  organisationId: asOptionalField(z.string()),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AddPersonValidationSchema = (t: (arg: any) => string) =>
  z
    .object(personValidationObject(t))
    .passthrough()
    .refine(
      // Check if type is BUSINESS, and if so, ensure organisation is provided
      (data) =>
        !(data.type === PERSON_TYPES.BUSINESS && !data.organisation?.id),
      {
        path: ['organisation'],
        message: t('organisationRequired'),
      }
    );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PersonEditValidationSchema = (t: (arg: any) => string) =>
  z
    .object({
      ...personValidationObject(t),
      id: z.string(),
      isActive: z.boolean(),
    })
    .passthrough()
    .refine(
      // Check if type is BUSINESS, and if so, ensure organisation is provided
      (data) =>
        !(data.type === PERSON_TYPES.BUSINESS && !data.organisation?.id),
      {
        path: ['organisation'],
        message: t('organisationRequired'),
      }
    );

export const SINGLE_VALUED_SEARCH_PARAMS = [
  'sortBy',
  'sortOrder',
  'name',
  'email',
  'isActive',
];
