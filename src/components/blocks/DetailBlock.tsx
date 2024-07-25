'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React, { useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  openOnRender?: boolean;
  button?: React.JSX.Element;
  subTitle?: React.JSX.Element;
  needAccordion?: boolean;
  testId?: string;
}

const DetailBlock = ({
  openOnRender = true,
  title,
  button,
  className,
  children,
  subTitle,
  needAccordion = true,
  testId = '',
}: Props) => {
  const [isOpen, setIsOpen] = useState(openOnRender);

  return (
    <div
      className={twMerge(
        'px-6 pt-4 pb-6 bg-white shadow shadow-blockbase rounded flex flex-col gap-4 mt-2 md:mt-0',
        className
      )}
      data-testid={testId}
    >
      <div className='flex items-center '>
        <div className='flex flex-1 flex-col'>
          <Typography
            variant='titleMediumBold'
            className='text-secondary'
            data-testid={`${testId}-title`}
          >
            {title}
          </Typography>
          {subTitle}
        </div>
        <ButtonGroup color='secondary' variant='outlined'>
          {button}
          {needAccordion && (
            <Button
              color='secondary'
              size='small'
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <MdExpandLess size='1.25rem' />
              ) : (
                <MdExpandMore size='1.25rem' />
              )}
            </Button>
          )}
        </ButtonGroup>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default DetailBlock;

export const DetailBlockErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: { message: string };
  resetErrorBoundary: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <div className='flex flex-col items-center justify-center p-4' role='alert'>
    <p className='m-0 text-xs'>Something went wrong</p>
    <p className='m-0 text-lg font-bold'>{error.message}</p>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);
