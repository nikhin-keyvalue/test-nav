import { components } from '@generated/crm-service-types';

export interface Connection {
  id?: string;
  linkId?: string;
  linkName?: string;
  entity?: components['schemas']['EntityType'];
  connectionType?: components['schemas']['ConnectionType'];
}
