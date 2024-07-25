import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { StockListData } from '@/containers/vehicles/components/types';
import { useTranslations } from '@/hooks/translation';

const TitleCount = async ({ data }: { data?: Promise<StockListData> }) => {
  const listData = await data;
  const count = listData?.totalElements ?? 0;

  return <div>{` (${count})`}</div>;
};

const TitleFallback = () => <div className='skeleton-loader h-5 w-24' />;

const Title = ({ data }: { data?: Promise<StockListData> }) => {
  const t = useTranslations();
  return (
    <div className='flex'>
      <div className='m-0 flex-1 font-kanit text-[2rem] font-semibold leading-tight'>
        <div className='flex flex-row gap-2 text-secondary'>
          <div>{`${t('stock.title')}`}</div>
          <div className='flex md:hidden'>
            <ErrorBoundary fallback={<div />}>
              <Suspense fallback={<TitleFallback />}>
                <TitleCount data={data} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Title;
