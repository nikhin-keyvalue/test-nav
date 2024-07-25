import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { NoData } from '@/components';
import DetailBlock from '@/components/blocks/DetailBlock';
import DetailBlockPaginationFooter from '@/components/blocks/DetailBlockPaginationFooter';
import useItemPagination from '@/hooks/itemsPagination';
import { currentUser } from '@/hooks/server/currentUser';
import { useTranslations } from '@/hooks/translation';
import { SalesPersonType } from '@/types/common';

import {
  opportunityTestIds,
  proposalTestIds,
} from '../../../../tests/e2e/constants/testIds';
import { QuotationsAccordionListBlock } from '../types';
import QuotationAccordion from './QuotationAccordion';

const Quotations: FC<QuotationsAccordionListBlock> = (props) => {
  const {
    opportunityId,
    quotationAccordionData = [],
    isDeliveryPage = false,
    disableAdd = false,
    dealerESignInfo,
    disableDuplicate = false,
    miscellaneousSettings,
  } = props;
  const router = useRouter();
  const [activeQuotation, setActiveQuotation] = useState<string | null>(null);
  const [currentUserData, setCurrentUser] = useState<SalesPersonType>({});

  const t = useTranslations();

  const handleActiveQuotationChange = (panelId: string) => {
    setActiveQuotation(activeQuotation !== panelId ? panelId : null);
  };

  const DetailBlockProps = {
    title: t('opportunityStatus.Quotation'),
    needAccordion: false,
    button: !isDeliveryPage ? (
      <Button
        data-testid={opportunityTestIds.addQuotationButton}
        onClick={() => {
          if (opportunityId)
            router.push(`/quotations/new?opportunityId=${opportunityId}`);
        }}
        disabled={disableAdd}
      >
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold' className='capitalize'>
          {t('common.add')}
        </Typography>{' '}
      </Button>
    ) : undefined,
    testId: opportunityTestIds.opportunityQuotesDetailsBlock,
  };

  const {
    paginatedItems,
    showAll,
    setShowAll,
    itemsPerPage,
    showFooter,
    page,
    setPage,
  } = useItemPagination({
    items: quotationAccordionData!,
    totalCount: quotationAccordionData?.length,
    itemsPerPage: 3,
  });

  const getCurrentUser = async () => {
    const currentUserResponse = await currentUser();
    const userDetails = {
      firstName: currentUserResponse.firstName,
      lastName: currentUserResponse.lastName,
      email: currentUserResponse.email,
      salespersonId: `${currentUserResponse.id}`,
      loginId: currentUserResponse.login,
    };
    setCurrentUser(userDetails);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <DetailBlock
        {...DetailBlockProps}
        testId={proposalTestIds.quotationDetailBlock}
      >
        <Divider />
        {paginatedItems?.length ? (
          paginatedItems?.map((item) => (
            <QuotationAccordion
              key={item.id}
              currentUser={currentUserData}
              quotationItem={item}
              opportunityId={opportunityId}
              isDeliveryPage={isDeliveryPage}
              activeQuotation={activeQuotation}
              dealerESignInfo={dealerESignInfo}
              handleActiveQuotationChange={handleActiveQuotationChange}
              disableDuplicate={disableDuplicate}
              miscellaneousSettings={miscellaneousSettings}
            />
          ))
        ) : (
          <div className='size-full'>
            <NoData
              imageDimension={130}
              primaryText={t('quotations.noQuotationsDataPrimaryText')}
              testId={opportunityTestIds.opportunityQuoteEmptyPlaceholder}
            />
          </div>
        )}
        {showFooter ? (
          <DetailBlockPaginationFooter
            page={page}
            pageSize={itemsPerPage}
            count={quotationAccordionData.length}
            showAll={showAll}
            onShowAllChange={(newValue) => setShowAll(newValue)}
            onPageChange={(newPage) => setPage(newPage)}
            showPagination={false}
          />
        ) : null}
      </DetailBlock>

      {/* TODO: need to move the dialogs to parent container later */}
    </>
  );
};

export default Quotations;
