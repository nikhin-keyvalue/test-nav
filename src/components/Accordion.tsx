import { Typography } from '@AM-i-B-V/ui-kit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Accordion as MUIAccordion,
  AccordionDetails,
  styled,
} from '@mui/material';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { useTranslations } from '@/hooks/translation';

import EllipsisMenu from './menus/EllipsisMenu';
import { Item } from './menus/types';
import Spinner from './Spinner';

export type AccordionDetailType = {
  id: string;
  price: string;
  header: string;
  placedDate: string | null;
  subheader?: string | ReactNode;
  vatType: 'ExclVAT' | 'InclVAT';
};

const Accordion = ({
  id,
  testId,
  isOpen,
  children,
  itemDetails,
  handleChange,
  handleItemClick,
  ellipsisMenuItems,
  headerStylingClass,
  isLoadingDetails = false,
}: {
  id: string;
  testId: string;
  isOpen: boolean;
  children: ReactNode;
  ellipsisMenuItems: Item[];
  isLoadingDetails?: boolean;
  headerStylingClass: string;
  itemDetails: AccordionDetailType;
  handleChange: (id: string) => void;
  handleItemClick: (id: string) => void;
}) => {
  const t = useTranslations('quotations.quotationVATType');
  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={
        <KeyboardArrowDownIcon sx={{ fontSize: '1.5rem' }} color='primary' />
      }
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(180deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  // TODO: make accordian component generic
  return (
    <MUIAccordion
      expanded={isOpen}
      onChange={() => handleChange(id)}
      onClick={() => handleItemClick(itemDetails?.id)}
      sx={{ boxShadow: 'none' }}
      disableGutters
    >
      <AccordionSummary
        aria-controls='panel1d-content'
        id='panel1d-header'
        sx={{
          backgroundColor: 'white',
          p: '0px 4px',
        }}
        data-testid={testId}
      >
        <div className='ml-2 flex w-full justify-between '>
          <div>
            <div className={twMerge(headerStylingClass)}>
              <Typography className='flex' variant='textMediumBold'>
                {itemDetails.header}{' '}
                {itemDetails.placedDate && (
                  <>
                    {` `} {`• ${itemDetails.placedDate}`}
                  </>
                )}{' '}
                {`• ${itemDetails.price} ${t(itemDetails.vatType)}`}
              </Typography>
            </div>
            <div>
              <Typography variant='textSmall' className='text-grey-56'>
                {itemDetails.subheader}
              </Typography>
            </div>
          </div>
          <div>
            <EllipsisMenu
              index={itemDetails?.id}
              menuItems={ellipsisMenuItems}
              testId={`${testId}-ellipsis-menu`}
            />
          </div>
        </div>
      </AccordionSummary>
      {isLoadingDetails ? (
        <div className='flex h-[100px] w-full items-center justify-center'>
          <Spinner className='h-12 w-full' />
        </div>
      ) : (
        <AccordionDetails>{children}</AccordionDetails>
      )}
    </MUIAccordion>
  );
};

export default Accordion;
