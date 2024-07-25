import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';
import { getCodeList } from 'country-list';

import { formatDate } from '@/utils/date';

import { addressFormTestIds, personFormTestIds } from '../../constants/testIds';
import { generateUniqueEmailId } from '../common/generateUniqueEmailId';

type AddressItem = {
  country: string;
  houseNumber: string;
  postalCode: string;
  street: string;
  city: string;
  fullPrimaryAddressValue: string;
};

interface PersonInputDataProps {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  initials: string;
  phone: string;
  type: string;
  gender: string;
  driversLicenseNumber: string;
  title: string;
  // note: status is active by default in create person flow
  status: string;
  dob: string;
  formattedDob: string;
  licenseExpiry: string;
  formattedLicenseExpiry: string;
  primaryAddress: AddressItem;
  alternateAddress: AddressItem;
  alternateEmail: string;
  phoneNumbers?: Record<
    string,
    {
      number: string;
      country: string;
      countryShortCode: string;
      phoneNumberCode: string;
    }
  >;
}

export const address1 = {
  country: 'Brazil',
  houseNumber: '3',
  postalCode: '345678',
  street: 'lehar street',
  city: 'leyat',
  fullPrimaryAddressValue: 'Brazil, 345678, 3, lehar street, leyat',
};

export const address2 = {
  country: 'Angola',
  houseNumber: '2',
  postalCode: '456789',
  street: 'heret street',
  city: 'heron',
  fullPrimaryAddressValue: 'Angola, 456789, 2, heret street, heron',
};

const getFormattedFullAddress = (addressData: {
  country: string;
  houseNumber: string;
  postalCode: string;
  street: string;
  city: string;
  fullPrimaryAddressValue: string;
}): string => {
  const { country, houseNumber, street, postalCode, city } = addressData || {};
  // country-code corresponding to the country name is being send to BE. Country-code is being shown in the Details page.
  const countryList = getCodeList();
  const selectedCountryCode = Object.keys(countryList)
    .find((countryCode) => countryList[countryCode] === country)
    ?.toUpperCase();
  const fullPrimaryAddressValue = `${selectedCountryCode}, ${houseNumber}, ${street}, ${postalCode}, ${city}`;
  return fullPrimaryAddressValue;
};

export const getNewPersonDetails = (): PersonInputDataProps => {
  const inputData = {
    email: generateUniqueEmailId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    middleName: faker.person.middleName(),
    initials: faker.person.firstName(),
    phone: '+525512545677',
    type: 'Private',
    gender: 'Female',
    driversLicenseNumber: 'ABD1234',
    title: 'U',
    // note: status is active by default in create person flow
    status: 'Active',
    dob: '25/12/2000',
    formattedDob: '2000-12-25',
    licenseExpiry: '01/02/2050',
    formattedLicenseExpiry: '2050-02-01',
    primaryAddress: {
      country: 'Mexico',
      houseNumber: faker.location.buildingNumber(),
      postalCode: '123456',
      street: faker.location.street(),
      city: faker.location.city(),
      fullPrimaryAddressValue: '',
    },
    alternateAddress: {
      country: 'Aruba',
      houseNumber: faker.location.buildingNumber(),
      postalCode: '443322',
      street: faker.location.street(),
      city: faker.location.city(),
      fullPrimaryAddressValue: '',
    },
    alternateEmail: generateUniqueEmailId(),
    phoneNumbers: {
      sample1: {
        number: '867865679',
        country: 'Netherlands',
        countryShortCode: 'NL',
        phoneNumberCode: '+31',
      },
      sample2: {
        number: '5924444',
        country: 'Aruba',
        countryShortCode: 'AW',
        phoneNumberCode: '+297',
      },
      sample3: {
        number: '434525686',
        country: 'Belgium',
        countryShortCode: 'BE',
        phoneNumberCode: '+32',
      },
    },
  };

  inputData.primaryAddress.fullPrimaryAddressValue = getFormattedFullAddress(
    inputData.primaryAddress
  );

  return inputData;
};

export const getSampleEditPersonData = (): PersonInputDataProps => {
  const inputData = {
    email: generateUniqueEmailId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    middleName: faker.person.middleName(),
    initials: faker.person.firstName(),
    // aruba phn no.
    phone: '+2975924444',
    type: 'Private',
    gender: 'Male',
    driversLicenseNumber: 'GHI5678',
    title: 'Jij',
    status: 'Inactive',
    dob: '17/08/1995',
    formattedDob: '1995-08-17',
    licenseExpiry: '04/05/2045',
    formattedLicenseExpiry: '2045-05-04',
    primaryAddress: {
      country: 'Mexico',
      houseNumber: faker.location.buildingNumber(),
      postalCode: '123456',
      street: faker.location.street(),
      city: faker.location.city(),
      fullPrimaryAddressValue: '',
    },
    alternateAddress: {
      country: 'Aruba',
      houseNumber: faker.location.buildingNumber(),
      postalCode: '443322',
      street: faker.location.street(),
      city: faker.location.city(),
      fullPrimaryAddressValue: '',
    },
    alternateEmail: generateUniqueEmailId(),
  };

  inputData.alternateAddress.fullPrimaryAddressValue = getFormattedFullAddress(
    inputData.alternateAddress
  );

  return inputData;
};

export const createNewPerson = async (
  page: Page,
  personData: PersonInputDataProps
) => {
  // enter values in the form
  await page.getByLabel('First name').click();
  await page.getByLabel('First name').fill(personData.firstName);

  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill(personData.lastName);

  await page.getByLabel('Initials').click();
  await page.getByLabel('Initials').fill(personData.initials);

  await page.getByLabel('Middle name').click();
  await page.getByLabel('Middle name').fill(personData.middleName);

  await page.getByLabel('Gender').click();
  await page.getByRole('option', { name: personData.gender }).click();

  await page.getByLabel('Birthday').click();
  await page.getByLabel('Birthday').fill(personData.dob);

  await page.getByLabel('Driver License Expiry').click();
  await page.getByLabel('Driver License Expiry').fill(personData.licenseExpiry);

  await page.getByLabel('Drivers License Number').click();
  await page
    .getByLabel('Drivers License Number')
    .fill(personData.driversLicenseNumber);

  // input primary email
  await page.getByLabel('Add e-mail address').click();
  await page.getByLabel('Add e-mail address').fill(personData.email);

  await page.getByLabel('Type').click();
  await page.getByRole('option', { name: 'Private' }).click();

  await page.getByLabel('Title').click();
  await page.getByRole('option', { name: personData.title }).click();

  // input alternate email
  await page.getByLabel('Add e-mail address').click();
  await page.getByLabel('Add e-mail address').fill(personData.alternateEmail);

  // enter phone number
  await page.getByLabel('Phone number country').selectOption('MX');
  await page.getByPlaceholder('Add phone number').click();
  await page.getByPlaceholder('Add phone number').fill(personData.phone);

  // adding address
  await page.getByRole('button', { name: 'Add address' }).click();
  await page.getByTestId(addressFormTestIds.country).click();
  await page
    .getByRole('option', { name: personData.primaryAddress?.country })
    .click();
  await page.getByTestId(`${addressFormTestIds.postalCode}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.postalCode}-input`)
    .fill(personData.primaryAddress.postalCode);
  await page.getByTestId(`${addressFormTestIds.houseNumber}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.houseNumber}-input`)
    .fill(personData.primaryAddress.houseNumber);
  await page.getByTestId(`${addressFormTestIds.street}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.street}-input`)
    .fill(personData.primaryAddress.street);
  await page.getByTestId(`${addressFormTestIds.city}-input`).click();
  await page
    .getByTestId(`${addressFormTestIds.city}-input`)
    .fill(personData.primaryAddress.city);
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(
    page.getByRole('button', { name: 'Save & Close' }).nth(1)
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  await expect(page).toHaveURL(/.*details/);
};

export const verifyCreatedPersonInDetailsPage = async (
  page: Page,
  personData: PersonInputDataProps
) => {
  const personDetailsBlock = page.getByTestId('person-details-block');
  await personDetailsBlock.waitFor();
  await expect(personDetailsBlock).toBeVisible();
  await expect(personDetailsBlock.getByTestId('initials-value')).toHaveText(
    personData.initials
  );
  await expect(personDetailsBlock.getByTestId('first-name-value')).toHaveText(
    personData.firstName
  );
  await expect(personDetailsBlock.getByTestId('last-name-value')).toHaveText(
    personData.lastName
  );
  await expect(personDetailsBlock.getByTestId('gender-value')).toHaveText(
    personData.gender
  );
  await expect(personDetailsBlock.getByTestId('dob-value')).toHaveText(
    formatDate(personData.formattedDob)
  );
  await expect(personDetailsBlock.getByTestId('title-value')).toHaveText(
    personData.title
  );
  await expect(
    personDetailsBlock.getByTestId('drivers-license-number-value')
  ).toHaveText(personData.driversLicenseNumber);
  await expect(
    personDetailsBlock.getByTestId('drivers-license-expiry-value')
  ).toHaveText(formatDate(personData.formattedLicenseExpiry));
  await expect(personDetailsBlock.getByTestId('person-type-value')).toHaveText(
    personData.type
  );
  await expect(personDetailsBlock.getByTestId('status-value')).toHaveText(
    personData.status
  );
  await expect(
    personDetailsBlock.getByTestId('primary-address-value')
  ).toHaveText(personData.primaryAddress.fullPrimaryAddressValue);
  await expect(
    personDetailsBlock.getByTestId('primary-phone-number-value')
  ).toHaveText(personData.phone);
  await expect(
    personDetailsBlock.getByTestId('primary-email-value')
  ).toHaveText(personData.email);
  await expect(
    personDetailsBlock.getByTestId('secondary-email-value')
  ).toHaveText(personData.alternateEmail);
};

export const editPerson = async (
  page: Page,
  personData: PersonInputDataProps
) => {
  // enter values in the form
  await page.getByLabel('First name').click();
  await page.getByLabel('First name').fill(personData.firstName);

  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill(personData.lastName);

  await page.getByLabel('Initials').click();
  await page.getByLabel('Initials').fill(personData.initials);

  await page.getByLabel('Middle name').click();
  await page.getByLabel('Middle name').fill(personData.middleName);

  await page.getByLabel('Gender').click();
  await page
    .getByRole('option', { name: personData.gender, exact: true })
    .click();

  await page.getByLabel('Birthday').click();
  await page.getByLabel('Birthday').fill(personData.dob);

  await page.getByLabel('Driver License Expiry').click();
  await page.getByLabel('Driver License Expiry').fill(personData.licenseExpiry);

  await page.getByLabel('Drivers License Number').click();
  await page
    .getByLabel('Drivers License Number')
    .fill(personData.driversLicenseNumber);

  await page.getByLabel('Title').click();
  await page.getByRole('option', { name: personData.title }).click();

  // status toggle
  await page.getByTestId('status-checkbox').getByRole('checkbox').click();

  // add phone number
  await page.getByPlaceholder('Add phone number').click();
  await page.getByPlaceholder('Add phone number').fill(personData.phone);

  // adding address
  await page.getByRole('button', { name: 'Add address' }).click();
  await page.getByTestId(addressFormTestIds.country).click();
  await page
    .getByRole('option', { name: personData.alternateAddress.country })
    .click();
  await page.getByLabel('Postal code').click();
  await page
    .getByLabel('Postal code')
    .fill(personData.alternateAddress.postalCode);
  await page.getByLabel('House Number').click();
  await page
    .getByLabel('House Number')
    .fill(personData.alternateAddress.houseNumber);
  await page.getByLabel('Street').click();
  await page.getByLabel('Street').fill(personData.alternateAddress.street);
  await page.getByLabel('City').click();
  await page.getByLabel('City').fill(personData.alternateAddress.city);
  await page.getByRole('button', { name: 'Add' }).click();

  // input email
  await page
    .getByTestId(personFormTestIds.newEmail)
    .locator('input')
    .fill(personData.email);
  await page.getByTestId(personFormTestIds.newEmail).press('Enter');

  await expect(
    page.getByRole('button', { name: 'Save & Close' }).nth(1)
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Save & Close' }).nth(1).click();
  await expect(page).toHaveURL(/.*details/);
};

export const verifyEditedPersonInDetailsPage = async (
  page: Page,
  personData: PersonInputDataProps
) => {
  const personDetailsBlock = page.getByTestId('person-details-block');
  await personDetailsBlock.waitFor();
  await expect(personDetailsBlock).toBeVisible();
  await expect(personDetailsBlock.getByTestId('initials-value')).toHaveText(
    personData.initials
  );
  await expect(personDetailsBlock.getByTestId('first-name-value')).toHaveText(
    personData.firstName
  );
  await expect(personDetailsBlock.getByTestId('last-name-value')).toHaveText(
    personData.lastName
  );
  await expect(personDetailsBlock.getByTestId('gender-value')).toHaveText(
    personData.gender
  );
  await expect(personDetailsBlock.getByTestId('dob-value')).toHaveText(
    formatDate(personData.formattedDob)
  );
  await expect(personDetailsBlock.getByTestId('title-value')).toHaveText(
    personData.title
  );
  await expect(
    personDetailsBlock.getByTestId('drivers-license-number-value')
  ).toHaveText(personData.driversLicenseNumber);
  await expect(
    personDetailsBlock.getByTestId('drivers-license-expiry-value')
  ).toHaveText(formatDate(personData.formattedLicenseExpiry));
  await expect(personDetailsBlock.getByTestId('status-value')).toHaveText(
    personData.status
  );

  // verify alternate address
  await expect(
    personDetailsBlock.getByTestId('alternate-address-value')
  ).toHaveText(personData.alternateAddress.fullPrimaryAddressValue);
};
