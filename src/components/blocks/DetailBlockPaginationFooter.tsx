import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, TablePagination } from '@mui/material';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

import { useTranslations } from '@/hooks/translation';

const DetailBlockPaginationFooter = ({
  page,
  pageSize,
  count,
  showAll,
  onShowAllChange,
  onPageChange,
  showPagination = true,
}: {
  page: number;
  pageSize: number;
  count: number;
  showAll: boolean;
  onShowAllChange: (showAll: boolean) => void;
  onPageChange: (page: number) => void;
  showPagination?: boolean;
}) => {
  const t = useTranslations('common');
  return (
    <div className='flex justify-between border-x-0 border-b-0 border-t border-solid border-t-secondary-300'>
      <Button
        color='primary'
        size='medium'
        className='capitalize'
        onClick={() => onShowAllChange(!showAll)}
      >
        {showAll ? (
          <MdExpandLess size='1.5rem' />
        ) : (
          <MdExpandMore size='1.5rem' />
        )}
        <Typography variant='textMediumBold' className='ml-1'>
          {t(showAll ? 'showLess' : 'showAll', { count })}
        </Typography>
      </Button>
      {!showAll && showPagination ? (
        <TablePagination
          component='div'
          count={count}
          page={page}
          rowsPerPage={pageSize}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          // Given an array with single option to disable the dropdown altogether
          rowsPerPageOptions={[1]}
        />
      ) : null}
    </div>
  );
};
export default DetailBlockPaginationFooter;
