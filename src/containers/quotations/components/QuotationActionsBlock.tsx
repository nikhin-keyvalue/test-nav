'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  MdCheck,
  MdClose,
  MdDelete,
  MdDoDisturbOn,
  MdEdit,
  MdFileCopy,
  MdOutlinePrint,
} from 'react-icons/md';

import ReShareIcon from '@/components/ReshareIcon';
import SpinnerScreen from '@/components/SpinnerScreen';
import CreateDeliveryModal from '@/containers/deliveries/components/CreateDeliveryModal';
import QuotationActionModal from '@/containers/opportunities/components/QuotationActionModal';
import {
  QUOTATION_ELLIPSIS_MENU_OPTIONS,
  QUOTATION_STATUSES,
} from '@/containers/opportunities/types';
import { useTranslations } from '@/hooks/translation';
import { SalesPersonType } from '@/types/common';
import { showErrorToast } from '@/utils/toast';

import { colors } from '../../../../tailwind.config';
import { opportunityTestIds } from '../../../../tests/e2e/constants/testIds';
import { getPrintableQuotation } from '../api/api';
import { ESignMethodResponse, QuotationCustomerType } from '../api/type';
import { ModalProps } from '../types';
import PrintQuotationDialog from './PrintQuotationDialog';
import RejectQuotationDialog from './RejectQuotationDialog';
import ShareQuotationDialog from './ShareQuotationDialog';

interface Props {
  isHeader: boolean;
  quotationId: string;
  currentUser: SalesPersonType;
  opportunityId: string;
  status: QUOTATION_STATUSES;
  customer: QuotationCustomerType;
  deliveryId?: string;
  isDeliveryPage?: boolean;
  disableShare: boolean;
  quotationName?: string;
  isReShareButtonHidden: boolean;
  activeDealer: ESignMethodResponse;
  disableDuplicate?: boolean;
  isShareViaESign: boolean;
  showHtmlInTenantLevel: boolean;
  showHtmlInProposalLevel: boolean;
}

const eSignEligibleStatuses = [
  QUOTATION_STATUSES.SHARE_QUOTATION,
  QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
];

const QuotationActionsBlock = ({
  quotationId,
  opportunityId,
  customer,
  currentUser,
  isHeader = true,
  status = QUOTATION_STATUSES.CONCEPT,
  deliveryId,
  isDeliveryPage = false,
  disableShare,
  quotationName = '',
  isReShareButtonHidden,
  activeDealer,
  disableDuplicate = false,
  isShareViaESign,
  showHtmlInTenantLevel,
  showHtmlInProposalLevel,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState({
    state: false,
    isShareButtonClick: false,
  });
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<ModalProps>();

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] =
    useState<boolean>(false);

  const router = useRouter();

  const t = useTranslations();

  type CtaConfigType = {
    name: string;
    icon: JSX.Element;
    onClick: () => void;
    isIconHidden?: boolean;
    testId: string;
  };

  const handlePrintQuotation = async () => {
    try {
      const quotationPrintResponse = await getPrintableQuotation({
        quotationId,
        opportunityId: `${opportunityId}`,
        markAsShared: false,
        eSignService: activeDealer.eSignService,
      });

      window.open(quotationPrintResponse.url);
    } catch {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  const actionItems = {
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.EDIT_QUOTATION]: {
      hasAccess: [QUOTATION_STATUSES.CONCEPT],
      ctaConfig: {
        testId: opportunityTestIds.accordionEditButton,
        name: 'edit',
        icon: (
          <Tooltip title={t('quotations.editProposalTooltip')}>
            <div>
              <MdEdit size='1.25rem' fill='inherit' />
            </div>
          </Tooltip>
        ),
        onClick: () =>
          router.push(
            `/quotations/${quotationId}/edit?opportunityId=${opportunityId}`
          ),
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.EMAIL_QUOTATION]: {
      hasAccess: !disableShare
        ? [
            QUOTATION_STATUSES.REJECTED,
            QUOTATION_STATUSES.SHARE_QUOTATION,
            QUOTATION_STATUSES.AGREEMENT_SIGNED,
            QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
          ]
        : [],
      ctaConfig: {
        testId: opportunityTestIds.accordionEmailButton,
        name: 'email',
        icon: (
          <Tooltip title={t('quotations.reShareProposalTooltip')}>
            <div>
              <ReShareIcon />
            </div>
          </Tooltip>
        ),
        onClick: () =>
          setIsEmailDialogOpen({
            state: true,
            isShareButtonClick: false,
          }),
        isIconHidden: isReShareButtonHidden,
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.PRINT_QUOTATION]: {
      hasAccess: !disableShare
        ? [
            QUOTATION_STATUSES.CONCEPT,
            QUOTATION_STATUSES.REJECTED,
            QUOTATION_STATUSES.SHARE_QUOTATION,
            QUOTATION_STATUSES.AGREEMENT_SIGNED,
            QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
          ]
        : [],
      ctaConfig: {
        testId: opportunityTestIds.accordionPrintButton,
        name: 'print',
        icon: (
          <Tooltip title={t('quotations.printProposalTooltip')}>
            <div>
              <MdOutlinePrint size='1.25rem' fill='inherit' />
            </div>
          </Tooltip>
        ),
        onClick: () => {
          if (status === QUOTATION_STATUSES.CONCEPT) setIsPrintDialogOpen(true);
          else startTransition(async () => handlePrintQuotation());
        },
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.REJECT_QUOTATION]: {
      hasAccess: [
        QUOTATION_STATUSES.SHARE_QUOTATION,
        QUOTATION_STATUSES.PRELIMINARY_AGREEMENT,
      ],
      ctaConfig: {
        testId: opportunityTestIds.accordionRejectButton,
        name: 'reject',
        icon: (
          <Tooltip title={t('quotations.rejectProposalTooltip')}>
            <div>
              <MdDoDisturbOn size='1.25rem' fill='inherit' />
            </div>
          </Tooltip>
        ),
        onClick: () => setIsRejectDialogOpen(true),
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
        testId: opportunityTestIds.accordionDuplicateButton,
        name: 'duplicate',
        icon: (
          <Tooltip title={t('quotations.duplicateProposalTooltip')}>
            <div>
              <MdFileCopy size='1.25rem' fill='inherit' />
            </div>
          </Tooltip>
        ),
        onClick: () =>
          router.push(
            `/opportunities/${opportunityId}/quotation/${quotationId}`
          ),
        isIconHidden: disableDuplicate,
      },
    },
    [QUOTATION_ELLIPSIS_MENU_OPTIONS.DELETE_QUOTATION]: {
      hasAccess: [QUOTATION_STATUSES.CONCEPT],
      ctaConfig: {
        testId: opportunityTestIds.accordionDeleteButton,
        name: 'delete',
        icon: (
          <Tooltip title={t('quotations.deleteProposalTooltip')}>
            <div>
              <MdDelete size='1.25rem' fill='inherit' />
            </div>
          </Tooltip>
        ),
        onClick: () => {
          setIsConfirmationModalOpen({
            id: quotationId,
            name: 'delete',
          });
        },
      },
    },
  };

  const isQuotationSignedOrRejected =
    status === QUOTATION_STATUSES.AGREEMENT_SIGNED ||
    status === QUOTATION_STATUSES.REJECTED;

  const getActionItemCTAs = () =>
    Object.values(actionItems)
      ?.map((items) => items.hasAccess.includes(status) && items.ctaConfig)
      ?.filter(Boolean) as CtaConfigType[];

  // TODO assign proper translations
  const getStatusBasedCta = () => {
    switch (status) {
      case QUOTATION_STATUSES.CONCEPT:
        return {
          title: t('quotations.quotationStatus.Concept'),
          subTitle: t('quotations.waitingForShare'),
          buttonCTA: t('quotations.shareQuotation'),
        };
      case QUOTATION_STATUSES.SHARE_QUOTATION:
        return {
          title: t('quotations.quotationStatus.SharedQuotation'),
          subTitle: 'Waiting for agreement',
          buttonCTA: t('quotations.clientAgreed'),
        };
      case QUOTATION_STATUSES.PRELIMINARY_AGREEMENT:
        return {
          title: t('quotations.quotationStatus.PreliminaryAgreement'),
          subTitle: 'Waiting for signature',
          buttonCTA: t('quotations.clientSigned'),
        };
      case QUOTATION_STATUSES.AGREEMENT_SIGNED:
        return {
          title: t('quotations.quotationStatus.AgreementSigned'),
          subTitle: 'Closed won',
          element: (
            <div className='flex justify-center rounded bg-grey-88 px-5 py-[10px]'>
              <MdCheck color='white' size={24} />
            </div>
          ),
        };
      case QUOTATION_STATUSES.REJECTED:
      default:
        return {
          title: t('quotations.quotationStatus.Rejected'),
          subTitle: 'Closed lost',
          element: (
            <div className='flex justify-center rounded bg-grey-88 px-5 py-[10px]'>
              <MdClose color='white' size={24} />
            </div>
          ),
        };
    }
  };

  const onUpdateStatus = () => {
    if (status === QUOTATION_STATUSES.CONCEPT) {
      setIsEmailDialogOpen({
        state: true,
        isShareButtonClick: true,
      });
      return;
    }

    const changeToStatus =
      status === QUOTATION_STATUSES.SHARE_QUOTATION
        ? 'clientAgreed'
        : 'clientSigned';

    setIsConfirmationModalOpen({ id: quotationId, name: changeToStatus });
  };

  const onCreateDelivery = () => {
    if (deliveryId)
      startTransition(() => router.push(`/deliveries/${deliveryId}/details`));
    else setIsDeliveryModalOpen(true);
  };

  /* condition-matrix 1 : Explanation for status-change-button disable logic:
 |---------------------------|-------------------|-------------------------------------------------------------------------|-------------------------------------------------------|
 | quotation_status          | button text       | Condition to disable button                                             | Button Status                                         |
 |---------------------------|-------------------|-------------------------------------------------------------------------|-------------------------------------------------------|
 | Concept                   | Share             | isButtonDisabled => disableShare                                        | Disabled only if there are no items (product/vehicle) |
 |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 | Shared                    | Client agreed     | isSharedVIAEsign = true                                                 | DISABLED                                              |
 |                           |                   | isSharedVIAEsign = false & showHtmlInProposalLevel = true               | DISABLED                                              |
 |---------------------------|-------------------|-------------------------------------------------------------------------|-------------------------------------------------------|
 | Pre-agreement             | Client signed     | isButtonDisabled => isSharedVIAEsign                                    | DISABLED based on the value of isSharedVIAEsign       |                         
 |---------------------------|-------------------|-------------------------------------------------------------------------|-------------------------------------------------------|
 | Client signed / rejected  | Not a button      |    Not applicable                                                       | Not applicable                                        |                               
 |---------------------------|-------------------|-------------------------------------------------------------------------|-------------------------------------------------------|
*/
  const isStatusUpdateBtnDisabled =
    disableShare ||
    isShareViaESign ||
    (status === QUOTATION_STATUSES.SHARE_QUOTATION &&
      !isShareViaESign &&
      showHtmlInProposalLevel);

  const getToolTipTextForStatusBasedCTA = () => {
    if (disableShare) return t('quotations.addLineItemsToShare');

    /* Note:
    To make sure the tooltip doesn't appear after the shared and preliminary-agreement statuses, the status level check on the left is necessary.
    If the button is disabled, this specific tooltip needs to show up, in order to avoid manual-status-changes during online-flow.
    To comprehend the button disabled state, see condition-matrix 1.
    */
    if (
      eSignEligibleStatuses.includes(status) &&
      (isShareViaESign ||
        (!isShareViaESign &&
          status === QUOTATION_STATUSES.SHARE_QUOTATION &&
          showHtmlInProposalLevel))
    )
      return t('quotations.manualStatusChangeInfo');

    return '';
  };

  return (
    <>
      {isPending && <SpinnerScreen showGradient />}
      <div
        className={`inline-flex ${
          isHeader ? 'h-40' : ''
        } w-full flex-col items-start justify-start gap-6 rounded bg-secondary pb-6 pt-4`}
      >
        {isHeader ? (
          <div className='inline-flex w-96 items-start justify-start gap-2 pl-6 pr-4'>
            <div className='pt-1'>
              <Typography variant='textMediumBold' className='pt-1 text-white'>
                {getStatusBasedCta().title}
              </Typography>
              <Typography variant='textMedium' className='text-white'>
                {getStatusBasedCta().subTitle}
              </Typography>
            </div>
          </div>
        ) : (
          <> </>
        )}

        <div className='flex h-10 flex-col items-start justify-start gap-2 self-stretch px-6'>
          <div className='inline-flex items-start justify-between self-stretch'>
            <div className='flex items-start justify-start gap-2'>
              <Tooltip
                title={getToolTipTextForStatusBasedCTA()}
                placement='top'
              >
                <div>
                  {isQuotationSignedOrRejected ? (
                    getStatusBasedCta().element
                  ) : (
                    <Button
                      className='h-[44px] min-w-[140px]  rounded bg-primary px-3 text-white'
                      sx={{
                        opacity: isStatusUpdateBtnDisabled ? 0.5 : 1,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: colors.primary.DEFAULT,
                        },
                      }}
                      disabled={isStatusUpdateBtnDisabled}
                      onClick={onUpdateStatus}
                      disableRipple
                      data-testid='update-status-button'
                    >
                      <Typography variant='titleSmallBold'>
                        {getStatusBasedCta().buttonCTA}
                      </Typography>
                    </Button>
                  )}
                </div>
              </Tooltip>

              {status === QUOTATION_STATUSES.AGREEMENT_SIGNED &&
                !isDeliveryPage && (
                  <Button
                    className='h-[44px] rounded bg-primary px-3 normal-case text-white hover:bg-primary'
                    onClick={onCreateDelivery}
                  >
                    <Typography variant='titleSmallBold'>
                      {deliveryId
                        ? t('deliveries.viewDelivery')
                        : t('deliveries.createDelivery')}
                    </Typography>
                  </Button>
                )}
            </div>

            <div className='inline-flex items-start justify-start rounded border-2'>
              {getActionItemCTAs()?.map(
                ({ icon, name, onClick, isIconHidden, testId }) =>
                  !isIconHidden && (
                    <div
                      key={name}
                      className='flex w-11 items-center justify-start overflow-hidden border-r-2 px-1 last:border-r-0'
                    >
                      <IconButton
                        className='flex h-10 items-center fill-white'
                        id={testId}
                        onClick={onClick}
                      >
                        {icon}
                      </IconButton>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        {isEmailDialogOpen.state && (
          <ShareQuotationDialog
            quotationId={quotationId}
            currentUser={currentUser}
            customer={customer}
            open={isEmailDialogOpen.state}
            handleClose={() =>
              setIsEmailDialogOpen({ state: false, isShareButtonClick: false })
            }
            status={status}
            activeDealer={activeDealer}
            showHtmlInTenantLevel={showHtmlInTenantLevel}
            showHtmlInProposalLevel={showHtmlInProposalLevel}
          />
        )}
        {isPrintDialogOpen && (
          <PrintQuotationDialog
            activeDealer={activeDealer}
            quotationId={quotationId}
            open={isPrintDialogOpen}
            handleClose={() => setIsPrintDialogOpen(false)}
          />
        )}
        {isRejectDialogOpen && (
          <RejectQuotationDialog
            open={isRejectDialogOpen}
            handleClose={() => setIsRejectDialogOpen(false)}
            quotationId={quotationId}
            opportunityId={opportunityId}
          />
        )}
        {isConfirmationModalOpen && (
          <QuotationActionModal
            isConfirmationModalOpen={isConfirmationModalOpen}
            opportunityId={opportunityId}
            onClose={() => setIsConfirmationModalOpen(undefined)}
            startTransition={startTransition}
          />
        )}
        {isDeliveryModalOpen && (
          <CreateDeliveryModal
            quotationId={quotationId}
            open={isDeliveryModalOpen}
            defaultName={quotationName}
            handleClose={() => setIsDeliveryModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default QuotationActionsBlock;
