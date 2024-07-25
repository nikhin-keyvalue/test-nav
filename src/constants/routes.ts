export const personAndOrganisationRoutes = ['/persons', '/organisations'];

export const opportunityAndDeliveryRoutes = [
  '/vehicles',
  '/quotations',
  '/deliveries',
  '/crm-settings',
  '/opportunities',
  '/miscellaneous',
  '/email-templates',
];

export const routes = {
  opportunity: {
    opportunities: '/opportunities',
    opportunitiesNew: '/opportunities/new',
  },
  delivery: {
    deliveries: '/deliveries',
  },
  quotation: {
    quotations: '/quotations',
    quotationsQuick: '/quotations/quick',
  },
};

export const routeRegex = {
  opportunity: {
    opportunities: /\/opportunities($|\?)/,
    opportunitiesNew: /.*opportunities\/new/,
    opportunitiesEdit: /\/opportunities\/\w+\/edit/,
    opportunitiesDetails: /\/opportunities\/\w+\/details/,
  },
  person: {
    personDetails: /\/persons\/\w+\/details/,
  },
  vehicles: { vehicles: /\/vehicles($|\?)/ },
  delivery: {
    deliveries: /\/deliveries($|\?)/,
    deliveriesEdit: /\/deliveries\/\w+\/edit/,
    deliveriesIdDetails: /\/deliveries\/\w+\/details/,
  },
  quotation: {
    quotationsQuick: /.*quotations\/quick/,
    quotationsNewOpportunityId:
      /.*\/quotations\/new\?opportunityId=[A-Za-z0-9]+/,
    quotations: /\/quotations($|\?)/,
    quotationsNew: /.*quotations\/new/,
    quotationsEdit: /\/quotations\/\w+\/edit/,
    anyQuotation: /\/quotations.*/, // Accepts edit, create
    duplicateQuotation: /\/opportunities\/\w+\/quotation\/\w/,
  },
};

export const SETTINGS_ROUTE_REGEX = /\/crm-settings($|\?)/;
export const CRM_ROLE_ROUTES_REGEX = /\/(?:persons|organisations)(?:\/.*)?/;
export const SALES_ROLE_ROUTES_REGEX =
  // eslint-disable-next-line no-useless-escape
  /\/(?:opportunities|quotations|vehicles|deliveries|miscellaneous|email-templates)(?:\/[^\/]+\/(?:details|edit)?|(?:$|\?))|\/quotations\/quick/;

export enum USER_ROLES {
  ROLE_CRM = 'ROLE_CRM',
  ROLE_SALES = 'ROLE_SALES',
  ROLE_DEALER_ADMIN = 'ROLE_DEALER_ADMIN',
};
