'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { definitions } from '@generated/workflow-task-management-types';
import { Grid } from '@mui/material';
import { useParams } from 'next/navigation';

import { NoData } from '@/components';
import CalendarSection from '@/components/blocks/calendar/CalendarSection';
import DetailBlock from '@/components/blocks/DetailBlock';
import NotesSection from '@/components/blocks/notes/NotesSection';
import WorkflowBlock from '@/components/blocks/workflows/WorkflowBlock';
import EditButton from '@/components/EditButton';
import FormPageHeader from '@/components/FormPageHeader';
import StatusBar from '@/components/status-bar/StatusBar';
import { STATUS_BAR_TYPES } from '@/components/status-bar/types';
import { Role } from '@/components/user-details/types';
import { MiscellaneousSettingsResponse } from '@/containers/miscellaneous/types';
import { ESignMethodResponse } from '@/containers/quotations/api/type';
import { useTranslations } from '@/hooks/translation';
import { PersonsDetails } from '@/types/api';
import { DocumentParentEntities } from '@/types/common';

import { opportunityTestIds } from '../../../../tests/e2e/constants/testIds';
import {
  OpportunityDetails as OpportunityDetailsType,
  QuotationDetailsSummaryType,
} from '../api/type';
import Quotations from '../components/Quotation';
import VehiclePhotos from '../components/vehicle-photos/VehiclePhotos';
import { DocumentCategories, OpportunityDocumentResponse } from '../types';
import DocumentsBlock from './DocumentsBlock';
import OpportunityDetailsBlock from './OpportunityDetailsBlock';

const OpportunityDetails = ({
  customerDetails,
  isDealerPreview,
  webdealerBaseUrl,
  opportunityDetails,
  opportunityDocumentCategories,
  workflowData,
  roles,
  dealerESignInfo,
  miscellaneousSettings,
}: {
  isDealerPreview: boolean;
  webdealerBaseUrl: string;
  customerDetails: PersonsDetails | null;
  opportunityDocumentCategories: DocumentCategories[];
  opportunityDetails: OpportunityDetailsType | undefined | null;
  workflowData: definitions['IWorkflowListDto'];
  roles: Role[];
  dealerESignInfo: ESignMethodResponse;
  miscellaneousSettings: MiscellaneousSettingsResponse;
}) => {
  const t = useTranslations();
  const { id: opportunityId } = useParams();
  const isImmutable =
    opportunityDetails?.status === 'ClosedWon' ||
    opportunityDetails?.status === 'ClosedLost';

  const showWorkflows =
    roles?.includes('ROLE_TASK_ADMIN') || roles?.includes('ROLE_TASK');

  return (
    <>
      <FormPageHeader isDetailPage>
        <Typography variant='titleLargeBold' className='text-secondary'>
          {t('details.opportunityDetails')}
        </Typography>
      </FormPageHeader>
      {opportunityDetails ? (
        <div>
          <StatusBar
            type={STATUS_BAR_TYPES.OPPORTUNITY}
            status={opportunityDetails?.status}
          />
          <Grid container columnSpacing={3}>
            <Grid
              item
              sm={5.99}
              xs={12}
              gap={2}
              display='flex'
              flexDirection='column'
            >
              <Grid item>
                <DetailBlock
                  testId={opportunityTestIds.opportunitiesDetailsBlockContainer}
                  title='Opportunity details'
                  button={
                    <EditButton
                      disabled={isImmutable}
                      href={`/opportunities/${opportunityId}/edit`}
                    />
                  }
                  needAccordion={false}
                >
                  <OpportunityDetailsBlock
                    opportunityDetails={opportunityDetails}
                  />
                </DetailBlock>
              </Grid>
              <Grid item>
                <CalendarSection
                  customerDetails={customerDetails}
                  events={opportunityDetails?.events || []}
                />
              </Grid>
              {showWorkflows && (
                <Grid item>
                  <WorkflowBlock
                    workflows={workflowData?.workflows}
                    href={`/opportunities/${opportunityId}/workflows?dealerId=${opportunityDetails?.dealer?.dealerId}`}
                  />
                </Grid>
              )}
              <Grid item>
                <NotesSection noteList={opportunityDetails?.notes} />
              </Grid>
            </Grid>
            <Grid
              item
              sm={5.99}
              xs={12}
              gap={2}
              display='flex'
              flexDirection='column'
            >
              <VehiclePhotos
                isDealerPreview={isDealerPreview}
                webdealerBaseUrl={webdealerBaseUrl}
                vehicles={opportunityDetails?.vehicles || []}
              />
              <Quotations
                opportunityId={opportunityId as string}
                quotationAccordionData={
                  opportunityDetails?.quotations as QuotationDetailsSummaryType
                }
                disableAdd={isImmutable}
                disableDuplicate={isImmutable}
                dealerESignInfo={dealerESignInfo}
                miscellaneousSettings={miscellaneousSettings}
              />
              <Grid item>
                <DocumentsBlock
                  documentList={
                    (opportunityDetails?.documents as OpportunityDocumentResponse[]) ||
                    []
                  }
                  documentCategories={opportunityDocumentCategories}
                  parentType={DocumentParentEntities.OPPORTUNITIES}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div className='h-[76vh] w-full'>
          <NoData />
        </div>
      )}
    </>
  );
};

export default OpportunityDetails;
