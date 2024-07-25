'use server';

import { UserDetails } from '@/components/user-details/types';
import { metaFactoryFetcher } from '@/utils/api';

// TODO : Remove dummy data
const user: UserDetails = {
  id: 1,
  login: 'user1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  imageUrl: '/AM-i-Logo.svg',
  activated: true,
  langKey: 'en',
  displayValue: 'John Doe',
  tenant: {
    id: 1,
    displayValue: 'Tenant 1',
    groupName: 'Group 1',
  },
  createdBy: 'system',
  createdDate: '2020-01-01T00:00:00Z',
  lastModifiedBy: 'system',
  lastModifiedDate: '2020-01-01T00:00:00Z',
  authorities: [
    'ROLE_DEALER_ADMIN',
    'ROLE_DEALER',
    'ROLE_DEALER_PREVIEW',
    'ROLE_TASK_ADMIN',
    'ROLE_USER',
    'ROLE_ARTICLE_API',
    'ROLE_DEALER_ADMIN_PREVIEW',
    'ROLE_RELATION',
    'ROLE_VEHICLE_API',
    'ROLE_RELATION_PREVIEW',
    'ROLE_TASK',
  ],
  firebaseNamespace: 'default',
  locale: 'en',
  localeList: ['en', 'fr'],
};

export async function currentUser() {
  const res = await metaFactoryFetcher(`api/account`, undefined, {
    format: false,
    throwError: false,
  });

  if (res.ok) {
    const data: UserDetails = await res.json();
    return data;
  }

  return user;
}
