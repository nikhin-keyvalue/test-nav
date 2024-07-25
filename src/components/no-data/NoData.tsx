import Image from 'next/image';
import { FC } from 'react';

import { useTranslations } from '@/hooks/translation';

type PropType = {
  primaryText?: string;
  secondaryText?: string;
  imageDimension?: number;
  testId?: string;
};
const NoData: FC<PropType> = (props) => {
  const t = useTranslations();
  const {
    secondaryText = '',
    imageDimension = 300,
    primaryText = t('common.noDataDefaultPrimaryText'),
    testId,
  } = props;

  return (
    <div
      className='mb-2 flex h-full w-full flex-col items-center justify-center bg-white py-4'
      data-testid={testId}
    >
      <Image
        src='/noDataImage.svg'
        width={imageDimension}
        height={imageDimension}
        alt='No Data to Display'
      />
      <div className='mt-2 flex flex-col items-center'>
        <p
          className='text-sm font-semibold'
          data-testid={`${testId}-primary-text`}
        >
          {primaryText}
        </p>
        <p className='text-sm text-grey-88'>{secondaryText}</p>
      </div>
    </div>
  );
};

export default NoData;
