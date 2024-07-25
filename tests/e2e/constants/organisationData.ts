export const orgCookieName = 'TEST_ORG_ID';
export const editOrgCookieName = 'TEST_EDIT_ORG_ID';

export const createOrgData = {
  name: 'createOrgTestCompany',
  type: 'Dealer',
  // note: status is active by default in create organisation flow
  status: 'Active',
  website: 'www.orite.com',
  VATNumber: '000099998B57',
  opportunitiesAndDeliveries: {
    deliveries: null,
    opportunities: null,
  },
  email: 'orgtestemail@gmail.com',
  alternateEmail: 'alternateorgtestemail@gmail.com',
  phoneNumberList: {
    phone: '+525512545677',
    alternatePhoneNumber1: '9567894758',
    alternatePhoneNumber2: '(602) 518-8663',
    alternatePhoneNumber2Text: '+16025188663',
  },
  address: {
    city: 'bay',
    country: 'Mexico',
    countryCode: 'MX',
    postalCode: '123456',
    street: 'baylee street',
    houseNumber: '221',
  },
  kvkData: {
    name: 'Orite',
    KvKNumber: '70729271',
    website: 'www.orite.io',
    address: {
      houseNumber: '63',
      street: 'Onyxhorst',
      postalCode: '2592HC',
      city: "'s-Gravenhage",
      country: 'Netherlands',
    },
    addressString:
      "Netherlands, 2592HC, 63, Onyxhorst, 's-Gravenhage (Primary)",
  },
  postCodetestAddress: {
    houseNumber: '8',
    city: 'Amsterdam',
    postalCode: '1057VS',
    street: 'Balboaplein',
    country: 'Netherlands',
    postCodeAddressString: 'Netherlands, 1057VS, 8, Balboaplein, Amsterdam',
  },
};

export const editOrgData = {
  name: 'editOrgOrginalCompany',
  type: 'Organisation',
  // note: status is active by default in create organisation flow
  status: 'Active',
  website: 'www.plafondplaatje.nl',
  VATNumber: '000099998B58',
  opportunitiesAndDeliveries: {
    deliveries: null,
    opportunities: null,
  },
  email: 'editorgtestemail@gmail.com',
  alternateEmail: 'alternateeditorgtestemail@gmail.com',
  phoneNumberList: {
    phone: '+525512545678',
    alternatePhoneNumber1: '9567894759',
    alternatePhoneNumber2: '(602) 518-8664',
    alternatePhoneNumber2Text: '+16025188664',
  },
  address: {
    city: 'bay',
    country: 'Mexico',
    countryCode: 'MX',
    postalCode: '123456',
    street: 'baylee street',
    houseNumber: '221',
  },
  kvkData: {
    name: 'B.V. Plafondplaatje.nl',
    KvKNumber: '34179501',
    website: 'www.plafondplaatje.nl',
    address: {
      houseNumber: '25',
      street: 'Wijkermeerstraat',
      postalCode: '2131HB',
      city: "'Hoofddorp",
      country: 'Netherlands',
    },
    addressString:
      'Netherlands, 2131HB, 25, Wijkermeerstraat, Hoofddorp (Primary)',
  },
  postCodetestAddress: {
    houseNumber: '8',
    city: 'Amsterdam',
    postalCode: '1057VS',
    street: 'Balboaplein',
    country: 'Netherlands',
    postCodeAddressString: 'Netherlands, 1057VS, 8, Balboaplein, Amsterdam',
  },
};

export const testDataForOrgEdit = {
  name: 'editOrgTestCompany',
  type: 'Organisation',
  // note: status is active by default in create organisation flow
  status: 'Active',
  website: 'www.plafondplaatje.nl',
  VATNumber: '000099998B59',
  opportunitiesAndDeliveries: {
    deliveries: null,
    opportunities: null,
  },
  email: 'editorgtestemail2@gmail.com',
  alternateEmail: 'alternateeditorgtestemail2@gmail.com',
  phoneNumberList: {
    phone: '+525512545679',
    alternatePhoneNumber1: '9567894750',
    alternatePhoneNumber2: '(602) 518-8665',
    alternatePhoneNumber2Text: '+16025188665',
  },
  address: {
    city: 'bay',
    country: 'Mexico',
    countryCode: 'MX',
    postalCode: '123456',
    street: 'baylee street',
    houseNumber: '221',
  },
  kvkData: {
    name: 'B.V. Plafondplaatje.nl',
    KvKNumber: '34179501',
    website: 'www.plafondplaatje.nl',
    address: {
      houseNumber: '25',
      street: 'Wijkermeerstraat',
      postalCode: '2131HB',
      city: "'Hoofddorp",
      country: 'Netherlands',
    },
    addressString:
      'Netherlands, 2131HB, 25, Wijkermeerstraat, Hoofddorp (Primary)',
  },
  postCodetestAddress: {
    houseNumber: '8',
    city: 'Amsterdam',
    postalCode: '1057VS',
    street: 'Balboaplein',
    country: 'Netherlands',
    postCodeAddressString: 'Netherlands, 1057VS, 8, Balboaplein, Amsterdam',
  },
};
