import { components } from '@generated/crm-service-types';

export type MiscellaneousSettingsResponse =
  | components['schemas']['MiscellaneousSettings']
  | null;

export type EditMiscellaneousSettingsPayload =
  components['schemas']['MiscellaneousSettingsUpdateRequest'];

export interface EditMiscellaneousFormProps {
  showProposalPreviewOnCreate: boolean;
  publishOnlineProposalPriorSigning: boolean;
}
