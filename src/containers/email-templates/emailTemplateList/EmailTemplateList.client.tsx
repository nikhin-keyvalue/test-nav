'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { ButtonBase, Grid } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { NoData } from '@/components';
import { useTranslations } from '@/hooks/translation';

import { EmailTemplatesResponse } from '../api/types';

interface EmailTemplateListProps {
  emailTemplatesResponse: EmailTemplatesResponse;
}

const EmailTemplateList: FC<EmailTemplateListProps> = ({
  emailTemplatesResponse,
}) => {
  const { id: emailTemplateId } = useParams();

  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleListItemClick = (id: string) => {
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('id', id);
    const query = urlParams.toString() || '';
    router.push(`?${query}`);
  };

  if (!emailTemplatesResponse.data?.length)
    return (
      <Grid container alignItems='stretch' justifyContent='center'>
        <NoData
          primaryText={t('settings.emailTemplates.noDataPrimaryText')}
          imageDimension={130}
        />
      </Grid>
    );

  return (
    <Grid container direction='column' className='bg-white shadow'>
      {emailTemplatesResponse?.data?.map((item) => (
        <Grid item key={item.id} className='border-b border-grey-8 px-3 py-4'>
          <ButtonBase onClick={() => handleListItemClick(item.id)}>
            <Typography
              variant='textMediumBold'
              color={item.id === emailTemplateId ? 'secondary' : 'primary'}
            >
              {item.name}
            </Typography>
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  );
};

export default EmailTemplateList;
