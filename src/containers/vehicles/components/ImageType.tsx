import { Tooltip } from '@mui/material';
import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';

import { useTranslations } from '@/hooks/translation';

import { ImageSources, ThumbNailSource } from './types';

interface Props {
  imageSources?: ImageSources;
}

const availableImgSources = [
  'IMAGIN_STUDIO',
  'CAR_SPECIFIC',
  'MATCH_WITHIN_TENANT',
  'BRAND_RENDERS',
  'PLACE_HOLDER',
] as const;

const ImageType: FC<Props> = ({ imageSources }) => {
  const t = useTranslations('imageSource');

  const getImgSourceStatus = (source: {
    active: boolean;
    available: boolean;
  }) => {
    if (source.active && source.available)
      return ` border-secondary bg-secondary`;

    if (!source.active && !source.available)
      return ` border-solid border-[#BDC1C5]`;

    return `border-[#BDC1C5] bg-[#BDC1C5]`;
  };

  const getTooltip = (
    name: ThumbNailSource,
    source: { active: boolean; available: boolean }
  ) =>
    `${t(name)}: ${source.active ? t('active') : t('inactive')} & ${
      source.available ? t('available') : t('unavailable')
    }`;

  return (
    <div className='flex justify-center gap-1'>
      {availableImgSources.map(
        (source) =>
          imageSources?.[source] && (
            <Tooltip
              title={getTooltip(source, imageSources?.[source])}
              key={source}
            >
              <div
                className={twMerge(
                  'h-1.5 w-2.5 border-[1px] border-solid',
                  getImgSourceStatus(imageSources?.[source])
                )}
              />
            </Tooltip>
          )
      )}
    </div>
  );
};

export default ImageType;

export const ImageTypeLoadingFallback = () => (
  <div className='flex justify-center gap-1'>
    <div className='h-1.5 w-2.5 animate-pulse border-[1px] border-solid border-[#BDC1C5] bg-secondary-300' />
    <div className='h-1.5 w-2.5 animate-pulse border-[1px] border-solid border-[#BDC1C5] bg-secondary-300' />
    <div className='h-1.5 w-2.5 animate-pulse border-[1px] border-solid border-[#BDC1C5] bg-secondary-300' />
    <div className='h-1.5 w-2.5 animate-pulse border-[1px] border-solid border-[#BDC1C5] bg-secondary-300' />
    <div className='h-1.5 w-2.5 animate-pulse border-[1px] border-solid border-[#BDC1C5] bg-secondary-300' />
  </div>
);
