'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { MdAdd } from 'react-icons/md';

import { NoData } from '@/components';
import { OpportunitiesAndDeliveriesList } from '@/containers/opportunities/types';
import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';
import { ENTITIES } from '@/types/common';

import DetailBlock from '../DetailBlock';
import DetailBlockPaginationFooter from '../DetailBlockPaginationFooter';
import OpportunityItem from './OpportunityItem';

const OpportunitiesSection = ({
  opportunitiesAndDeliveriesList,
  parentEntity,
  disableAdd = false,
  testId = '',
}: {
  opportunitiesAndDeliveriesList: OpportunitiesAndDeliveriesList;
  parentEntity: ENTITIES;
  disableAdd?: boolean;
  testId?: string;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const { id } = useParams();

  const handleAddClick = () => {
    const entityParam =
      parentEntity === ENTITIES.PERSON ? 'personId' : 'organisationId';
    router.push(`/opportunities/new?${entityParam}=${id}`);
  };

  const DetailBlockProps = {
    title: `${t('common.opportunities')}`,
    button: (
      <Button
        onClick={handleAddClick}
        data-testid={`${testId}-add-btn`}
        disabled={disableAdd}
        sx={{ textTransform: 'none' }}
      >
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold'>{t('common.add')}</Typography>
      </Button>
    ),
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
    items: opportunitiesAndDeliveriesList?.opportunities || [],
    totalCount: opportunitiesAndDeliveriesList?.opportunities?.length || 0,
    itemsPerPage: 3,
  });

  return (
    <DetailBlock {...DetailBlockProps} needAccordion={false} testId={testId}>
      {paginatedItems?.length ? (
        paginatedItems.map((item) => (
          <div key={item.id}>
            <OpportunityItem item={item} />
          </div>
        ))
      ) : (
        <div className='h-full w-full'>
          <NoData
            imageDimension={130}
            primaryText={t('opportunities.noOpportunitesDataPrimaryText')}
          />
        </div>
      )}
      {showFooter ? (
        <DetailBlockPaginationFooter
          page={page}
          pageSize={itemsPerPage}
          count={opportunitiesAndDeliveriesList?.opportunities?.length || 0}
          showAll={showAll}
          onShowAllChange={(newValue) => setShowAll(newValue)}
          onPageChange={(newPage) => setPage(newPage)}
          showPagination={false}
        />
      ) : null}
    </DetailBlock>
  );
};

export default OpportunitiesSection;
