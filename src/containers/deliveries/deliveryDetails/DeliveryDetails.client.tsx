'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { definitions } from '@generated/workflow-task-management-types';
import { Grid } from '@mui/material';

import NotesSection from '@/components/blocks/notes/NotesSection';
import WorkflowBlock from '@/components/blocks/workflows/WorkflowBlock';
import FormPageHeader from '@/components/FormPageHeader';
import StatusBar from '@/components/status-bar/StatusBar';
import { STATUS_BAR_TYPES } from '@/components/status-bar/types';
import { Role } from '@/components/user-details/types';
import Quotations from '@/containers/opportunities/components/Quotation';
import VehiclePhotos from '@/containers/opportunities/components/vehicle-photos/VehiclePhotos';
import DocumentsBlock from '@/containers/opportunities/opportunityDetails/DocumentsBlock';
import {
  DocumentCategories,
  OpportunityDocumentResponse,
} from '@/containers/opportunities/types';
import { ESignMethodResponse } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { DocumentParentEntities } from '@/types/common';

import { DeliveryResponse } from '../api/type';
import BonusSection from '../components/bonus/BonusSection';
import DeliveryActionsBlock from '../components/DeliveryActionsBlock';
import DeliveryDetailsBlock from '../components/DeliveryDetailsBlock';

const DeliveryDetailsUI = ({
  deliveryDetails,
  isDealerPreview,
  webdealerBaseUrl,
  deliveryDocumentCategories,
  workflowData,
  roles,
  dealerESignInfo,
}: {
  isDealerPreview: boolean;
  webdealerBaseUrl: string;
  deliveryDetails: DeliveryResponse;
  deliveryDocumentCategories?: DocumentCategories[];
  workflowData: definitions['IWorkflowListDto'];
  roles: Role[];
  dealerESignInfo: ESignMethodResponse;
}) => {
  const t = useTranslations('deliveries');

  const showWorkflows =
    roles?.includes('ROLE_TASK_ADMIN') || roles?.includes('ROLE_TASK');

  return (
    <>
      <FormPageHeader isDetailPage>
        <Typography variant='titleLargeBold' className='text-secondary'>
          {t('deliveryDetails')}
        </Typography>
      </FormPageHeader>
      <StatusBar
        type={STATUS_BAR_TYPES.DELIVERY}
        status={deliveryDetails?.status}
      />

      <Grid container gap={2} xs={12}>
        <Grid
          item
          gap={2}
          display='flex'
          flexDirection='column'
          md={5.8}
          xs={12}
        >
          <Grid item>
            <DeliveryDetailsBlock deliveryDetails={deliveryDetails} />
          </Grid>
          {showWorkflows && (
            <Grid item>
              <WorkflowBlock
                href={`/deliveries/${deliveryDetails.id}/workflows?dealerId=${deliveryDetails?.dealer?.dealerId}`}
                workflows={workflowData?.workflows}
              />
            </Grid>
          )}
          <Grid item>
            <NotesSection noteList={deliveryDetails.notes} />
          </Grid>
          <Grid item>
            <BonusSection bonusList={deliveryDetails.bonuses} />
          </Grid>
        </Grid>

        <Grid
          item
          gap={2}
          display='flex'
          flexDirection='column'
          md={5.8}
          xs={12}
        >
          <DeliveryActionsBlock
            currentState={deliveryDetails?.status}
            deliveryId={deliveryDetails?.id}
          />
          <VehiclePhotos
            isDealerPreview={isDealerPreview}
            webdealerBaseUrl={webdealerBaseUrl}
            vehicles={deliveryDetails?.vehicles || []}
          />

          <Quotations
            isDeliveryPage
            opportunityId={deliveryDetails.opportunity?.id as string}
            quotationAccordionData={
              deliveryDetails.quotation?.id ? [deliveryDetails.quotation] : []
            }
            dealerESignInfo={dealerESignInfo}
            disableDuplicate
          />
          <Grid item>
            <DocumentsBlock
              parentType={DocumentParentEntities.DELIVERIES}
              documentCategories={deliveryDocumentCategories}
              documentList={
                deliveryDetails.documents as OpportunityDocumentResponse[]
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DeliveryDetailsUI;
