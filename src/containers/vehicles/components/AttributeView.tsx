import { Typography } from '@AM-i-B-V/ui-kit';
import React from 'react';
import { twMerge } from 'tailwind-merge';

const AttributeView = ({
  name,
  className,
  children,
  testId,
}: {
  name: React.JSX.Element | string;
  className?: string;
  children: React.JSX.Element | string;
  testId?: string;
}) => (
  <div className={className} data-testid={testId}>
    <Typography variant='textSmall' className='text-grey-56'>
      {name}
    </Typography>
    {typeof children === 'string' ? (
      <Typography variant='textMedium' data-testid={`${testId}-value`}>
        {children}
      </Typography>
    ) : (
      children
    )}
  </div>
);

export default AttributeView;

export const AttributeViewLoadingFallback = ({
  className,
}: {
  className?: string;
}) => (
  <div className={twMerge('flex flex-col gap-1', className)}>
    <div className='m-0 h-2.5 w-1/3 animate-pulse rounded-full bg-secondary-300' />
    <div className='h-3.5 w-full animate-pulse rounded-full bg-secondary-300' />
  </div>
);
