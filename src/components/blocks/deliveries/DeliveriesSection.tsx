'use client';

import { NoData } from '@/components';
import { OpportunitiesAndDeliveriesList } from '@/containers/opportunities/types';
import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';

import DetailBlock from '../DetailBlock';
import DetailBlockPaginationFooter from '../DetailBlockPaginationFooter';
import DeliveryLineItem from './DeliveryLineItem';

const DeliveriesSection = ({
  opportunitiesAndDeliveriesList,
  testId = '',
}: {
  opportunitiesAndDeliveriesList: OpportunitiesAndDeliveriesList;
  testId?: string;
}) => {
  const t = useTranslations();

  const DetailBlockProps = {
    title: `${t('common.deliveries')}`,
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
    items: opportunitiesAndDeliveriesList?.deliveries || [],
    totalCount: opportunitiesAndDeliveriesList?.deliveries?.length || 0,
    itemsPerPage: 3,
  });

  return (
    <DetailBlock {...DetailBlockProps} needAccordion={false} testId={testId}>
      {paginatedItems?.length ? (
        paginatedItems.map((item) => (
          <div key={item.id}>
            <DeliveryLineItem item={item} />
          </div>
        ))
      ) : (
        <div className='h-full w-full'>
          <NoData
            imageDimension={130}
            primaryText={t('deliveries.noDeliveriesDataPrimaryText')}
          />
        </div>
      )}
      {showFooter ? (
        <DetailBlockPaginationFooter
          page={page}
          pageSize={itemsPerPage}
          count={opportunitiesAndDeliveriesList?.deliveries?.length || 0}
          showAll={showAll}
          onShowAllChange={(newValue) => setShowAll(newValue)}
          onPageChange={(newPage) => setPage(newPage)}
          showPagination={false}
        />
      ) : null}
    </DetailBlock>
  );
};

export default DeliveriesSection;
