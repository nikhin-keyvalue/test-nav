import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Accordion from '@/components/Accordion';
import { Item } from '@/components/menus/types';
import SpinnerScreen from '@/components/SpinnerScreen';
import { MiscellaneousSettingsResponse } from '@/containers/miscellaneous/types';
import { getQuotationDetailsById } from '@/containers/quotations/api/actions';
import { getPrintableQuotation } from '@/containers/quotations/api/api';
import {
  ESignMethodResponse,
  LineGroupItemRequest,
  LineGroupItemsQuotationUpdateRequest,
  Quotation,
  QuotationCustomerType,
} from '@/containers/quotations/api/type';
import PrintQuotationDialog from '@/containers/quotations/components/PrintQuotationDialog';
import QuotationActionsBlock from '@/containers/quotations/components/QuotationActionsBlock';
import RejectQuotationDialog from '@/containers/quotations/components/RejectQuotationDialog';
import { ModalProps } from '@/containers/quotations/types';
import { checkIfLineItemsExist } from '@/containers/quotations/utils';
import { useTranslations } from '@/hooks/translation';
import { SalesPersonType } from '@/types/common';
import { mergeStrings } from '@/utils/common';
import { formatCurrencyAfterRounding } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { showErrorToast } from '@/utils/toast';

import { proposalTestIds } from '../../../../tests/e2e/constants/testIds';
import { QUOTATION_ELLIPSIS_MENU_OPTIONS, QUOTATION_STATUSES } from '../types';
import PreviewAllTenantGroups from './PreviewAllTenantGroups';
import QuotationActionModal from './QuotationActionModal';

const QuotationAccordion = (props: {
  currentUser: SalesPersonType;
  quotationItem: {
    id: string;
    proposalIdentifier: string;
    status:
      | 'Concept'
      | 'SharedQuotation'
      | 'PreliminaryAgreement'
      | 'AgreementSigned'
      | 'Rejected';
    quotationDate?: string | undefined;
    quotationValidUntil?: string | undefined;
    vatType: 'ExclVAT' | 'InclVAT';
    totalAfterDiscountExclVAT?: number | undefined;
    vat?: number | undefined;
    totalAfterDiscountInclVAT?: number | undefined;
  };
  opportunityId: string;
  isDeliveryPage: boolean;
  handleActiveQuotationChange: (panelId: string) => void;
  activeQuotation: string | null;
  dealerESignInfo: ESignMethodResponse;
  disableDuplicate?: boolean;
  miscellaneousSettings?: MiscellaneousSettingsResponse;
}) => {
  const contextForm = useForm<{
    isLoading: boolean;
    isSuccess: boolean;
  }>({
    defaultValues: { isLoading: false, isSuccess: false },
  });
  const { getValues: getContextFormValues } = contextForm;
  const {
    currentUser,
    opportunityId,
    quotationItem,
    isDeliveryPage,
    dealerESignInfo,
    activeQuotation,
    handleActiveQuotationChange,
    disableDuplicate = false,
    miscellaneousSettings,
  } = props;
  const [isPending, startTransition] = useTransition();
  const isIncludingVat = quotationItem.vatType === 'InclVAT';
  const [isQuotationDetailsLoading, setIsQuotationDetailsLoading] =
    useState(false);
  const [activeQuotationDetails, setActiveQuotationDetails] =
    useState<Quotation | null>(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<ModalProps>();
  const [selectedQuoteToPrint, setSelectedQuoteToPrint] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState({
    id: '',
    state: false,
  });

  const t = useTranslations();
  const router = useRouter();

  const fetchQuotationDetails = async (id: string) => {
    setIsQuotationDetailsLoading(() => true);
    const resp = await getQuotationDetailsById({ id });
    setActiveQuotationDetails(resp);
    setIsQuotationDetailsLoading(() => false);
  };

  const hasRequiredLineItem = checkIfLineItemsExist(
    (activeQuotationDetails?.lineGroupItems as LineGroupItemRequest[]) || []
  );

  const disableShare =
    activeQuotationDetails?.status === QUOTATION_STATUSES.CONCEPT
      ? !hasRequiredLineItem
      : false;

  const handlePrintQuotation = async (quotationId: string) => {
    try {
      const quotationPrintResponse = await getPrintableQuotation({
        quotationId,
        opportunityId: `${opportunityId}`,
        markAsShared: false,
        eSignService: dealerESignInfo.eSignService!,
      });

      window.open(quotationPrintResponse.url);
    } catch {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const ellipsisMenuItems = {
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.EDIT_QUOTATION]: {
      hasAccess: [QUOTATION_STATUSES.CONCEPT],
      ctaConfig: {
        id: 'Q1',
        name: t('common.edit'),
        onClick: (id: number | string | boolean | undefined) => {
          router.push(`/quotations/${id}/edit?opportunityId=${opportunityId}`);
        },
        testId: proposalTestIds.ellipsisMenuItemEditQuotation,
        disabled: () => false,
      },
    },
    // TODO: Enable email becomes when customer email becomes available in opportunity details
    // [QUOTATION_ELLIPSIS_MENU_OPTIONS.EMAIL_QUOTATION]: {
    //   hasAccess: [],
    //   [
    //     QUOTATION_STATUSES.CONCEPT,
    //     QUOTATION_STATUSES.REJECTED,
    //     QUOTATION_STATUSES.SHARE_QUOTATION,
    //     QUOTATION_STATUSES.AGREEMENT_SIGNED,
    //     QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
    //   ],
    //   ctaConfig: {
    //     id: 'Q2',
    //     name: t('events.email'),
    //     onClick: (e: number | string | boolean | undefined) => {
    //       setIsEmailDialogOpen({
    //         id: e,
    //         state: true,
    //         quotationStatus: quotationItem.status!,
    //         isShareButtonClick: false,
    //       });
    //     },
    //     disabled: () => false,
    //   },
    // },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.PRINT_QUOTATION]: {
      hasAccess: [
        QUOTATION_STATUSES.CONCEPT,
        QUOTATION_STATUSES.REJECTED,
        QUOTATION_STATUSES.SHARE_QUOTATION,
        QUOTATION_STATUSES.AGREEMENT_SIGNED,
        QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
      ],
      ctaConfig: {
        id: 'Q3',
        name: t('quotations.print'),
        testId: proposalTestIds.ellipsisMenuItemPrintQuotation,
        onClick: (id: string) => {
          const quoteStatus = quotationItem.status;
          if (quoteStatus === QUOTATION_STATUSES.CONCEPT)
            setSelectedQuoteToPrint(id);
          else startTransition(async () => handlePrintQuotation(id));
        },
        disabled: () => false,
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.REJECT_QUOTATION]: {
      hasAccess: [
        QUOTATION_STATUSES.SHARE_QUOTATION,
        QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
      ],
      ctaConfig: {
        id: 'Q4',
        name: t('quotations.reject'),
        onClick: (id: number | string) => {
          setIsRejectDialogOpen({ id: id as string, state: true });
        },
        disabled: () => false,
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.DUPLICATE_QUOTATION]: {
      hasAccess: [
        QUOTATION_STATUSES.CONCEPT,
        QUOTATION_STATUSES.REJECTED,
        QUOTATION_STATUSES.SHARE_QUOTATION,
        QUOTATION_STATUSES.AGREEMENT_SIGNED,
        QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
      ],
      ctaConfig: {
        id: 'Q5',
        name: t('quotations.duplicate'),
        testId: proposalTestIds.ellipsisMenuItemDuplicateQuotation,
        onClick: (id: number | string | boolean | undefined) => {
          router.push(`/opportunities/${opportunityId}/quotation/${id}`);
        },
        disabled: () => disableDuplicate,
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.DELETE_QUOTATION]: {
      hasAccess: [QUOTATION_STATUSES.CONCEPT],
      ctaConfig: {
        id: 'Q6',
        name: t('common.delete'),
        testId: proposalTestIds.ellipsisMenuItemDeleteQuotation,
        onClick: (id: number | string) => {
          setIsConfirmationModalOpen({
            id,
            name: 'delete',
          });
        },
        disabled: () => false,
      },
    },
  };

  const getEllipsisMenuItems = (status: QUOTATION_STATUSES) =>
    Object.values(ellipsisMenuItems)
      ?.map((items) => items.hasAccess.includes(status) && items.ctaConfig)
      ?.filter(Boolean) as Item[];

  useEffect(() => {
    if (
      (getContextFormValues('isSuccess') ||
        activeQuotation === `${quotationItem.id}`) &&
      !getContextFormValues('isLoading')
    ) {
      fetchQuotationDetails(quotationItem.id);
    }
  }, [
    getContextFormValues('isSuccess'),
    getContextFormValues('isLoading'),
    activeQuotation,
  ]);

  const address =
    activeQuotationDetails?.person?.type === 'Private'
      ? activeQuotationDetails?.person?.primaryAddress
      : activeQuotationDetails?.organisation?.primaryAddress;

  return (
    <>
      {isPending && <SpinnerScreen showGradient />}
      <FormProvider {...contextForm}>
        <Accordion
          id={quotationItem.id}
          handleChange={handleActiveQuotationChange}
          isOpen={activeQuotation === `${quotationItem.id}`}
          headerStylingClass='text-[#DA212C]'
          isLoadingDetails={isQuotationDetailsLoading}
          ellipsisMenuItems={getEllipsisMenuItems(
            quotationItem?.status as QUOTATION_STATUSES
          )}
          testId={quotationItem?.proposalIdentifier}
          handleItemClick={() => null}
          itemDetails={{
            ...quotationItem,
            vatType: quotationItem.vatType,
            header: quotationItem?.proposalIdentifier,
            placedDate: quotationItem?.quotationDate
              ? formatDate(quotationItem?.quotationDate)
              : null,
            price: formatCurrencyAfterRounding({
              value: isIncludingVat
                ? quotationItem?.totalAfterDiscountInclVAT
                : quotationItem?.totalAfterDiscountExclVAT,
            }),
            subheader: (
              <>
                <strong>
                  {t(
                    `quotations.quotationStatus.${
                      activeQuotationDetails?.status || quotationItem.status
                    }`
                  )}
                </strong>{' '}
                &nbsp; • &nbsp;{quotationItem?.proposalIdentifier}
                &nbsp;{' '}
                {`${
                  quotationItem?.quotationValidUntil
                    ? `• \u00A0 ${t('common.validUntil')}
                  ${formatDate(quotationItem?.quotationValidUntil)}`
                    : ''
                }`}
              </>
            ),
          }}
        >
          <div
            className='flex flex-col'
            role='presentation'
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <QuotationActionsBlock
                isHeader={false}
                customer={
                  activeQuotationDetails?.person as QuotationCustomerType
                }
                currentUser={currentUser}
                quotationId={quotationItem?.id}
                opportunityId={opportunityId}
                status={
                  activeQuotationDetails?.status as unknown as QUOTATION_STATUSES
                }
                deliveryId={activeQuotationDetails?.delivery?.id}
                isDeliveryPage={isDeliveryPage}
                disableShare={disableShare}
                isReShareButtonHidden={false}
                quotationName={quotationItem.proposalIdentifier}
                activeDealer={dealerESignInfo!}
                disableDuplicate={disableDuplicate}
                isShareViaESign={
                  activeQuotationDetails?.isShareViaESign ?? false
                }
                showHtmlInTenantLevel={
                  miscellaneousSettings?.publishOnlineProposalPriorSigning ??
                  false
                }
                showHtmlInProposalLevel={
                  activeQuotationDetails?.publishOnlineProposalPriorSigning ??
                  false
                }
              />
            </div>
            <div className='mt-6'>
              <div className='mb-10 flex w-full items-start justify-between gap-8 self-stretch text-secondary'>
                <div className='w-[48%] text-base font-normal leading-tight'>
                  {mergeStrings({
                    values: [
                      activeQuotationDetails?.person?.firstName,
                      activeQuotationDetails?.person?.middleName,
                      activeQuotationDetails?.person?.lastName,
                    ],
                  })}

                  {activeQuotationDetails?.person?.type === 'Business' && (
                    <Typography variant='textMedium'>
                      {activeQuotationDetails?.organisation?.name}
                    </Typography>
                  )}

                  <section>
                    <Typography variant='textMedium'>
                      {address?.street}
                      {` `}
                      {address?.houseNumber}
                    </Typography>
                    <Typography variant='textMedium'>
                      {address?.postalCode}
                      {` `}
                      {address?.city}
                    </Typography>
                  </section>
                </div>
                <div>
                  {activeQuotationDetails?.dealer?.dealerName}
                  <section>
                    <Typography variant='textMedium'>
                      {activeQuotationDetails?.dealer?.address?.street}
                      {` `}
                      {activeQuotationDetails?.dealer?.address?.houseNumber}
                    </Typography>
                    <Typography variant='textMedium'>
                      {activeQuotationDetails?.dealer?.address?.postalCode}
                      {` `}
                      {activeQuotationDetails?.dealer?.address?.city}
                    </Typography>
                  </section>
                </div>
              </div>

              <Grid container rowSpacing={5}>
                <Grid item width='100%'>
                  <Grid container>
                    <Grid md={6} lg={4} item width='100%'>
                      <div className='flex w-full flex-col'>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {t('filters.Quotation')}
                        </Typography>
                        <Typography variant='textMedium'>
                          {activeQuotationDetails?.proposalIdentifier}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid md={6} lg={3} item>
                      <div className='flex flex-col'>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {t('events.date')}
                        </Typography>
                        <Typography variant='textMedium'>
                          {activeQuotationDetails?.quotationDate
                            ? formatDate(activeQuotationDetails?.quotationDate)
                            : ''}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid md={6} lg={3} item>
                      <div className='flex flex-col'>
                        <Typography
                          variant='textSmall'
                          className='text-grey-56'
                        >
                          {t('common.validUntil')}
                        </Typography>
                        <Typography variant='textMedium'>
                          {activeQuotationDetails?.quotationValidUntil
                            ? formatDate(
                                activeQuotationDetails?.quotationValidUntil
                              )
                            : ''}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <div className='w-full pt-10'>
                  {activeQuotationDetails?.lineGroupItems && (
                    <PreviewAllTenantGroups
                      lineGroupItems={
                        activeQuotationDetails.lineGroupItems as LineGroupItemsQuotationUpdateRequest
                      }
                      vatType={activeQuotationDetails.vatType}
                      totalAfterDiscountExclVAT={
                        activeQuotationDetails.totalAfterDiscountExclVAT
                      }
                      totalAfterDiscountInclVAT={
                        activeQuotationDetails.totalAfterDiscountInclVAT
                      }
                      totalExclVat={activeQuotationDetails.totalExclVat}
                      vat={activeQuotationDetails.vat || 0}
                    />
                  )}
                </div>
              </Grid>
            </div>
          </div>
        </Accordion>
        {isConfirmationModalOpen && (
          <QuotationActionModal
            isConfirmationModalOpen={isConfirmationModalOpen}
            opportunityId={opportunityId}
            onClose={() => setIsConfirmationModalOpen(undefined)}
            startTransition={startTransition}
          />
        )}

        {selectedQuoteToPrint && (
          <PrintQuotationDialog
            activeDealer={dealerESignInfo!}
            open={!!selectedQuoteToPrint}
            quotationId={selectedQuoteToPrint}
            handleClose={() => setSelectedQuoteToPrint('')}
          />
        )}
        {isRejectDialogOpen.state && (
          <RejectQuotationDialog
            opportunityId={opportunityId}
            open={isRejectDialogOpen.state}
            quotationId={isRejectDialogOpen.id}
            handleClose={() => setIsRejectDialogOpen({ id: '', state: false })}
          />
        )}
      </FormProvider>
    </>
  );
};

export default QuotationAccordion;
