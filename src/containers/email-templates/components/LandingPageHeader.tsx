'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { ButtonBase, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { MdArrowBack } from 'react-icons/md';

import { useTranslations } from '@/hooks/translation';

interface LandingPageHeaderProps {
  testId?: string;
}

const LandingPageHeader: FC<LandingPageHeaderProps> = (props) => {
  const { testId } = props;
  const router = useRouter();
  const t = useTranslations('settings');

  return (
    <Grid
      container
      alignItems='center'
      className='mb-8 flex gap-6 border border-x-0 border-t-0 border-solid border-b-secondary-300 px-4 pb-6 lg:px-0'
    >
      <Grid item>
        <ButtonBase
          disableRipple
          className='flex h-12 items-center border-0 border-r border-solid border-secondary-300 pr-6'
          onClick={router.back}
          data-testid={`${testId}-back-arrow-button`}
        >
          <MdArrowBack size='24' className=' text-secondary ' />
        </ButtonBase>
      </Grid>
      <Grid item>
        <Typography variant='titleLargeBold' className='text-secondary'>
          {t('emailTemplates.title')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LandingPageHeader;
