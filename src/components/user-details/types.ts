interface Tenant {
  id: number;
  displayValue: string;
  groupName: string;
}

export type Role =
| 'ROLE_DEALER_ADMIN'
| 'ROLE_DEALER'
| 'ROLE_DEALER_PREVIEW'
| 'ROLE_TASK_ADMIN'
| 'ROLE_USER'
| 'ROLE_ARTICLE_API'
| 'ROLE_DEALER_ADMIN_PREVIEW'
| 'ROLE_RELATION'
| 'ROLE_VEHICLE_API'
| 'ROLE_RELATION_PREVIEW'
| 'ROLE_TASK'
| 'ROLE_CRM'
| 'ROLE_SALES'
| 'ROLE_INSIGHTS';


export interface UserDetails {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  activated: boolean;
  langKey: string;
  displayValue: string;
  tenant: Tenant;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  authorities: Array<Role>;
  firebaseNamespace: string;
  locale: string;
  localeList: string[];
}
