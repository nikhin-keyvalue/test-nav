import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { MdAdd } from 'react-icons/md';

import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';

import DetailBlock from '../DetailBlock';
import DetailBlockPaginationFooter from '../DetailBlockPaginationFooter';
import ChangeLogItem from './ChangeLogItem';

const ChangeLogSection = () => {
  const t = useTranslations();
  const data = {
    imageCount: 9,
    notes: [
      {
        id: 1,
        title: 'Item 1',
        description: 'This is the first item.',
        updatedBy: 'Sander de Vries',
        updatedAt: '2023-03-08T12:00:00Z',
      },
      {
        id: 2,
        title: 'Item 2',
        description: 'This is the second item.',
        updatedBy: 'John Doe',
        updatedAt: '2023-03-09T12:00:00Z',
      },
      {
        id: 3,
        title: 'Item 3',
        description: 'This is the third item.',
        updatedBy: 'Jane Doe',
        updatedAt: '2023-03-10T12:00:00Z',
      },
      {
        id: 4,
        title: 'Item 4',
        description: 'This is the fourth item.',
        updatedBy: 'Sander de Vries',
        updatedAt: '2023-03-11T12:00:00Z',
      },
      {
        id: 5,
        title: 'Item 5',
        description: 'This is the fifth item.',
        updatedBy: 'John Doe',
        updatedAt: '2023-03-12T12:00:00Z',
      },
      {
        id: 6,
        title: 'Item 6',
        description: 'This is the sixth item.',
        updatedBy: 'Jane Doe',
        updatedAt: '2023-03-13T12:00:00Z',
      },
      {
        id: 7,
        title: 'Item 7',
        description: 'This is the seventh item.',
        updatedBy: 'Sander de Vries',
        updatedAt: '2023-03-14T12:00:00Z',
      },
      {
        id: 8,
        title: 'Item 8',
        description: 'This is the eighth item.',
        updatedBy: 'John Doe',
        updatedAt: '2023-03-15T12:00:00Z',
      },
      {
        id: 9,
        title: 'Item 9',
        description: 'This is the ninth item.',
        updatedBy: 'Jane Doe',
        updatedAt: '2023-03-16T12:00:00Z',
      },
    ],
  };

  const DetailBlockProps = {
    title: 'My Detail Block',
    button: (
      <Button>
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold' className='capitalize'>
          {t('common.add')}
        </Typography>
      </Button>
    ),
  };

  const { imageCount = 0, notes } = data ?? {};

  const {
    paginatedItems,
    showAll,
    setShowAll,
    itemsPerPage,
    showFooter,
    page,
    setPage,
  } = useItemPagination({
    items: notes!,
    totalCount: 9,
    itemsPerPage: 3,
  });

  return (
    <DetailBlock {...DetailBlockProps}>
      {paginatedItems.map((note) => (
        <div key={note.id} className='pb-4'>
          <ChangeLogItem id='kjns' />
        </div>
      ))}
      {showFooter ? (
        <DetailBlockPaginationFooter
          page={page}
          pageSize={itemsPerPage}
          count={imageCount}
          showAll={showAll}
          onShowAllChange={(newValue) => setShowAll(newValue)}
          onPageChange={(newPage) => setPage(newPage)}
          showPagination={false}
        />
      ) : null}
    </DetailBlock>
  );
};

export default ChangeLogSection;
