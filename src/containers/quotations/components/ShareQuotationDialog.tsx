import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogContent, MenuItem } from '@mui/material';
import DOMPurify from 'dompurify';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdArrowBack } from 'react-icons/md';

import { If, TextFieldWithController } from '@/components';
import CustomDialog from '@/components/Dialog';
import { EMAIL_MESSAGE_INPUT_CHAR_LIMIT } from '@/constants/common';
import { QUOTATION_STATUSES } from '@/containers/opportunities/types';
import { getPersonDetailsById } from '@/containers/persons/api/api';
import { useTranslations } from '@/hooks/translation';
import useFormSubmission from '@/hooks/useFormSubmission';
import { SalesPersonType } from '@/types/common';

import {
  emailQuotation,
  getEmailPreview,
  shareQuotation,
} from '../api/actions';
import {
  ESignMethodResponse,
  QuotationCustomerType,
  QuotationStatus,
} from '../api/type';
import { emailQuotationDialogValidation } from '../constants';

interface ReqData {
  message: string;
  customerEmail: string;
}

const ShareQuotationDialog = ({
  open,
  status,
  customer,
  handleClose,
  quotationId,
  currentUser,
  activeDealer,
  showHtmlInTenantLevel,
  showHtmlInProposalLevel,
}: {
  open: boolean;
  quotationId: string;
  handleClose: () => void;
  currentUser: SalesPersonType;
  customer: QuotationCustomerType;
  status: QuotationStatus;
  activeDealer: ESignMethodResponse;
  showHtmlInTenantLevel: boolean;
  showHtmlInProposalLevel: boolean;
}) => {
  const { id: opportunityId } = useParams();

  const [emailOptions, setEmailOptions] = useState(
    customer?.email ? [customer.email] : []
  );
  const [previewHtmlContent, setPreviewHtmlContent] = useState<string>('');
  const [isPreviewHtmlLoading, setPreviewHtmlLoading] =
    useState<boolean>(false);

  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<ReqData>({
    defaultValues: {
      message: '',
      customerEmail: customer?.email || '',
    },
    resolver: zodResolver(
      emailQuotationDialogValidation(validationTranslation)
    ),
  });

  /* Note: Currently, preview shown here is the preview of the html-quotation.
  If showHtml = true, then the preview of the html-quotation can be shown.
  If showHtml = false, signature-email will be sent directly without an html quotation. So preview won't be shown.
  Once quotation-status gets updated to SharedQuotation, the value of the config showHtml will be saved to the quotation level. Then onwards the source of truth for that config will be showHtml at quotation level 
  */
  const needEmailPreview =
    (status === QUOTATION_STATUSES.CONCEPT && showHtmlInTenantLevel) ||
    (status === QUOTATION_STATUSES.SHARE_QUOTATION && showHtmlInProposalLevel);

  const { control, handleSubmit, watch } = formMethods;

  const { handleApiCall, isLoading } = useFormSubmission({
    handleClose,
  });

  const baseUrl = window.location.origin.includes('localhost')
    ? 'https://crm-web.pr.dev.am-i.nl'
    : window.location.origin;

  const onSubmit = async (payload: ReqData) => {
    //  If isPreviewHtmlContent is already set, it proceeds to construct the payloads for sharing the quotation,
    //  sending the email, or re-sharing the signed agreement based on the status of the quotation.
    if (!previewHtmlContent && needEmailPreview) {
      setPreviewHtmlLoading(true);
      const previewHtml = await getEmailPreview({
        id: quotationId,
        message: payload.message,
      });
      if (typeof previewHtml === 'string') {
        const sanitizedHtmlContent = DOMPurify.sanitize(
          previewHtml.replace(
            'padding: 64px 20% 0px 20%; width: 600px',
            'pointer-events: none;'
          )
        );

        setPreviewHtmlLoading(false);

        return setPreviewHtmlContent(sanitizedHtmlContent);
      }
      setPreviewHtmlLoading(false);
    }

    const shareQuotationPayload = {
      id: quotationId,
      payload: {
        ...payload,
        customerEmail: payload.customerEmail,
        sharedBy: currentUser,
        quotePublicLink: `${baseUrl}/view-quotation`,
        eSignService: activeDealer.eSignService!,
      },
      opportunityId: opportunityId as string,
    };

    const emailQuotationPayload = {
      id: quotationId,
      payload: {
        message: payload.message,
        customerEmails: [payload.customerEmail],
        eSignService: activeDealer.eSignService,
        ...(status === QUOTATION_STATUSES.CONCEPT
          ? {
              markShared: true,
            }
          : {}),
      },
      opportunityId: opportunityId as string,
    };

    if (status === QUOTATION_STATUSES.AGREEMENT_SIGNED)
      return handleApiCall(emailQuotation, emailQuotationPayload);
    return handleApiCall(shareQuotation, shareQuotationPayload);
  };

  const updateEmailOptions = async () => {
    if (!customer?.id) return;

    const personDetails = await getPersonDetailsById({
      pathParams: { personId: customer.id },
      queryParams: { excludeRelated: true },
    });
    if ((personDetails?.emails?.length ?? 0) > 1) {
      const alternateEmailIds = personDetails?.emails
        ?.filter((emailItem) => !emailItem.isPrimary)
        ?.map((emailItem) => emailItem.email)
        .filter(Boolean) as string[];
      setEmailOptions([...emailOptions, ...alternateEmailIds]);
    }
  };

  useEffect(() => {
    updateEmailOptions();
  }, []);

  const getHeaderText = () => {
    if (previewHtmlContent) return 'Message preview';
    switch (status) {
      case 'Concept':
        return t('quotations.shareQuotationText');
      case 'PreliminaryAgreement':
      case 'SharedQuotation':
        return t('quotations.reShareProposal');
      case 'AgreementSigned':
        return t('quotations.reShareSignedProposal');
      default:
        return t('quotations.shareQuotationText');
    }
  };

  return (
    <CustomDialog
      isOpen={open}
      disabled={isLoading || isPreviewHtmlLoading}
      onClose={handleClose}
      isLoading={isLoading || isPreviewHtmlLoading}
      submitText={
        previewHtmlContent || !needEmailPreview
          ? t('common.share')
          : t('common.preview')
      }
      onSubmit={handleSubmit(onSubmit)}
      headerElement={
        previewHtmlContent ? (
          <MdArrowBack
            onClick={() => setPreviewHtmlContent('')}
            className='cursor-pointer'
          />
        ) : (
          ''
        )
      }
    >
      <div className='pb-6'>
        <Typography variant='titleMediumBold' className='w-full text-center'>
          {getHeaderText()}
        </Typography>
      </div>

      <If condition={!previewHtmlContent}>
        <FormProvider {...formMethods}>
          <DialogContent sx={{ maxWidth: '360px' }}>
            <TextFieldWithController
              select
              name='customerEmail'
              defaultValue=''
              variant='filled'
              control={control}
              label={t('common.email')}
              data-testid='customerEmailDropdown'
              required
            >
              {emailOptions.map((emailId: string) => (
                <MenuItem key={emailId} value={emailId}>
                  {emailId}
                </MenuItem>
              ))}
            </TextFieldWithController>
            {status !== QUOTATION_STATUSES.AGREEMENT_SIGNED && (
              <Typography
                className='my-4 px-2 text-secondary-500'
                variant='textSmall'
              >
                {t('quotations.emailShareDisclaimer', {
                  emailId: watch('customerEmail'),
                })}
              </Typography>
            )}
            <TextFieldWithController
              rows={5}
              multiline
              sx={{ mb: 2 }}
              name='message'
              control={control}
              charLimit={EMAIL_MESSAGE_INPUT_CHAR_LIMIT}
              inputProps={{ maxLength: EMAIL_MESSAGE_INPUT_CHAR_LIMIT }}
              label={
                <Typography variant='textMedium'>
                  {t('quotations.optionalEmailMessage')}
                </Typography>
              }
            />
          </DialogContent>
        </FormProvider>
      </If>
      <If condition={!!previewHtmlContent}>
        <div dangerouslySetInnerHTML={{ __html: previewHtmlContent }} />
      </If>
    </CustomDialog>
  );
};

export default ShareQuotationDialog;
