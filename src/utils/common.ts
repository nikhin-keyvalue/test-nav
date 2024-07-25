// eslint-disable-next-line import/no-extraneous-dependencies
import { trace } from '@opentelemetry/api';
import { getName } from 'country-list';

import {
  DEFAULT_LIST_QUERY_PARAMS,
  PARAMS_WITH_METADATA,
} from '@/constants/common';
import {
  opportunityAndDeliveryRoutes,
  personAndOrganisationRoutes,
} from '@/constants/routes';
import { AddressType } from '@/types/api';
import {
  ErrorMessageType,
  PersonDetail,
  SearchParamKeys,
  SearchParams,
} from '@/types/common';

export const getAddressToDisplay = (address: AddressType) => {
  const formattedArray: string[] = [];
  const keysInOrder = [
    'countryCode',
    'postalCode',
    'houseNumber',
    'street',
    'city',
    'isPrimary',
  ];

  type KeyType = {
    [key: string]: string | boolean | undefined;
  };

  keysInOrder.forEach((key) => {
    const val = address ? (address as KeyType)[key] : null;
    if (typeof val === 'string' && val.length) {
      if (key === 'countryCode') {
        formattedArray.unshift(getName(val) || val); // To insert country code at the beginning
      } else {
        formattedArray.push(val);
      }
    }
  });

  return formattedArray.join(', ');
};

export const checkAddressIncomplete = (addressVal: AddressType) => {
  const mandatoryFields = [
    'street',
    'postalCode',
    'houseNumber',
    'countryCode',
  ];
  // Element implicitly has an 'any' type because expression of type 'string' can't be used
  // to index type '{ a: number; b: number; }'. No index signature with a parameter of type
  // 'string' was found on type '{ a: number; b: number; }'. To fix this issue "item" was given
  // the type of the keys of addressVal
  return mandatoryFields.some(
    (item) => addressVal[item as keyof typeof addressVal] === ''
  );
};

type MyObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const replaceUndefinedAndEmptyStringsWithNull = (
  obj: MyObject
): MyObject => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceUndefinedAndEmptyStringsWithNull(item));
  }

  Object.keys(obj).forEach((key) => {
    obj[key] = replaceUndefinedAndEmptyStringsWithNull(obj[key]);

    if (obj[key] === undefined || obj[key] === '') {
      obj[key] = null;
    }
  });
  return obj;
};

interface MergeStringsOptions {
  separator?: string;
  values: (string | undefined)[];
}

export function mergeStrings({
  separator = ' ',
  values = [],
}: MergeStringsOptions): string {
  return values.filter(Boolean).join(separator);
}

export const sortString = (a: string, b: string) => a.localeCompare(b);
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes || bytes < 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export const generateSession = (length = 32) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let session = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    session += characters.charAt(randomIndex);
  }

  return session;
};

export const hasNumber = (inputStrting: string) => {
  const regex = /\d/; // Matches any single digit
  return regex.test(inputStrting);
};

export const checkPostalCode = (input: string) =>
  hasNumber(input) && !input?.endsWith(' ') && !input?.endsWith('-');

export const isAlphaNumericCharacters = (
  event: React.KeyboardEvent<HTMLDivElement>
) => {
  const { key } = event;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const otherAllowedKeys = [
    ' ',
    'Alt',
    'Shift',
    'Control',
    'CapsLock',
    'ArrowLeft',
    'Backspace',
    'ArrowRight',
  ];
  return characters.includes(key) || otherAllowedKeys.includes(key);
};

type EmptyValue<T> = T extends number
  ? 0
  : T extends string
    ? ''
    : T extends boolean
      ? false
      : T extends unknown[]
        ? []
        : T extends object
          ? object
          : undefined;

export const getEmptyValue = <T>(input: T): EmptyValue<T> => {
  if (typeof input === 'number') {
    return 0 as EmptyValue<T>;
  }
  if (typeof input === 'string') {
    return '' as EmptyValue<T>;
  }
  if (typeof input === 'boolean') {
    return false as EmptyValue<T>;
  }
  if (Array.isArray(input)) {
    return [] as EmptyValue<T>;
  }
  if (typeof input === 'object' && input !== null) {
    return {} as EmptyValue<T>;
  }
  return undefined as EmptyValue<T>;
};

export default formatBytes;

export function containsNonEmptyString(arr: string[]): boolean {
  return arr.some((str) => typeof str === 'string' && str.trim() !== '');
}

export function removeEmptyStringsFromArray(arr: string[]): string[] {
  if (arr.length > 0) {
    return arr.filter((str) => str !== '');
  }
  return [];
}

export const queryParamBuilder = (
  searchParams: SearchParams,
  defaultSortField: string,
  useDefaultParams: boolean = true
) => {
  const filterParams = new URLSearchParams({
    ...(useDefaultParams && DEFAULT_LIST_QUERY_PARAMS),
    ...searchParams,
    ...(!searchParams?.sortBy && { sortBy: defaultSortField }),
  });

  const multiValueParams = Object.keys(searchParams).filter(
    (key) =>
      key !== 'sortBy' &&
      key !== 'name' &&
      key !== 'sortOrder' &&
      (PARAMS_WITH_METADATA.includes(key) ||
        searchParams[key as SearchParamKeys]?.includes(','))
  ) as SearchParamKeys[];
  multiValueParams.forEach((key) => {
    filterParams.delete(key);

    if (searchParams[key]) {
      // Additional info is stored with a '|' symbol as delimiter
      if (PARAMS_WITH_METADATA.includes(key))
        searchParams[key].split(',').forEach((value) => {
          filterParams.append(key, value.split('|')[0]);
        });
      else
        searchParams[key].split(',').forEach((value) => {
          filterParams.append(key, value);
        });
    }
  });

  return filterParams.toString();
};

export function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export const getPersonFilterOptions = (personList: PersonDetail[]) =>
  personList.map((person) => ({
    id: person.id?.toString() ?? '',
    displayValue: mergeStrings({
      values: [person.firstName, person.middleName, person.lastName],
    }),
    email: person.email,
  }));

export const hexToRGBA = (hex: string, alpha: number) => {
  // Convert hexadecimal color code to RGB
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  // Return RGBA string with specified alpha
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// function to check if both boolean values (true and false) are present in a given string
export const isBooleanPairPresent = (value: string) =>
  value && value.includes('true') && value.includes('false');

export const getErrorMessage = (errorType: ErrorMessageType) => {
  switch (errorType) {
    case 'DUPLICATE_OBJECT': {
      return 'apiErrorMessage.duplicatePerson';
    }
    case 'OBJECT_NOT_FOUND': {
      return 'apiErrorMessage.itemNotFound';
    }
    case 'INPUT_VALIDATION_FAILED': {
      return 'apiErrorMessage.inputValidationFailed';
    }
    case 'MALFORMED_MESSAGE_BODY': {
      return 'apiErrorMessage.malformedMessageBody';
    }
    case 'INVALID_ACTION_ATTEMPTED': {
      return 'apiErrorMessage.invalidActionAttempted';
    }
    default: {
      return 'common.somethingWentWrong';
    }
  }
};

export const getTraceId = (spanName: string) => {
  const provider = trace.getTracerProvider();
  const rootSpan = provider.getTracer('crm-web').startSpan(spanName);
  const { traceId, spanId } = rootSpan.spanContext();
  const xrayTraceID: string = `${traceId}@${spanId}`;

  return xrayTraceID;
};
export const removeSpaceFromString = (value: string) =>
  value.replace(/\s/g, '');

export const isCrmPath = (pathName: string) =>
  personAndOrganisationRoutes.some((route) => pathName.startsWith(route));

export const isSalesPath = (pathName: string) =>
  opportunityAndDeliveryRoutes.some((route) => pathName.startsWith(route));

export const getURLSearchParamsString = <T>({
  queryParams,
}: {
  queryParams: T;
}) => {
  if (queryParams) {
    const urlSearchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value != null) {
        urlSearchParams.append(key, value.toString());
      }
    });
    return `?${urlSearchParams.toString()}`;
  }
  return '';
};
