'use client';

import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

import ListPageHeader from '@/components/ListPageHeader';
import { useTranslations } from '@/hooks/translation';

import Card from '../card/Card';

const Settings = () => {
  const t = useTranslations('settings');
  const router = useRouter();

  const cards = [
    {
      label: t('emailTemplates.title'),
      icon: {
        path: '/stackedEmail.svg',
        altText: 'Stacked emails icon',
      },
      handler: () => router.push('/email-templates'),
    },
    {
      label: t('miscellaneous.title'),
      icon: {
        path: '/miscellaneous.svg',
        altText: 'Miscellaneous icon',
      },
      handler: () => router.push('/miscellaneous'),
    },
  ];

  return (
    <Grid container direction='column'>
      <ListPageHeader
        title={t('title')}
        className='mb-8 flex border border-x-0 border-t-0 border-solid border-b-secondary-300 px-4 pb-6 lg:px-0'
      />
      <Grid container item className='px-6' rowSpacing={4} columnSpacing={4}>
        {cards.map((card) => (
          <Grid item key={card.label}>
            <Card
              label={card.label}
              iconInfo={{
                iconPath: card.icon.path,
                altText: card.icon.altText,
              }}
              onClick={card.handler}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Settings;
