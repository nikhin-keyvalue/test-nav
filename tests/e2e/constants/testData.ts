// These are initial test data for the end to end tests
export const endToEndTestReadOnlyOrganisation =
  'end to end test read only organisation';

export type PersonTestData = {
  firstName: string;
  lastName: string;
  organisation?: typeof endToEndTestReadOnlyOrganisation;
};
export const businessPersonTestData: PersonTestData = {
  firstName: 'business person',
  lastName: 'read only',
  organisation: endToEndTestReadOnlyOrganisation,
};

export const privatePersonTestData: PersonTestData = {
  firstName: 'private person',
  lastName: 'read only',
};
