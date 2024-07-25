'use client';

import { definitions } from '@generated/workflow-task-management-types';
import { useTranslations } from 'next-intl';
import React, { HTMLAttributes } from 'react';
import { AiOutlineHourglass } from 'react-icons/ai';
import { MdCheck, MdExpandLess, MdExpandMore } from 'react-icons/md';

import { minutesToTime } from '@/utils/date';

type Props = Pick<
  definitions['IWorkflowDto'],
  'title' | 'leadTimeInMinutes' | 'status'
> &
  HTMLAttributes<HTMLDivElement>;
const WorkflowLine = ({
  title,
  status,
  leadTimeInMinutes,
  ...props
}: Props) => {
  const finished = status === 'DONE';
  const { days, hours, minutes } = minutesToTime(leadTimeInMinutes);
  const t = useTranslations('workflows');

  return (
    <div
      {...props}
      className={`group flex cursor-pointer select-none gap-2 border-0 border-t border-solid border-secondary-300 py-3 ${
        finished ? 'text-[#6E9C6D]' : 'text-primary'
      }`}
    >
      <MdExpandMore
        className='p-0.5 transition-transform group-data-[state=open]:rotate-180'
        size='1.35rem'
      />
      <div className='flex-1'>
        <p className='m-0 font-semibold leading-snug'>
          {title === undefined ? t('tasks') : title}
        </p>
        <p className='m-0 text-xs leading-snug text-[#8C9299]'>
          {finished ? t('completed') : t('inProgress')} -{' '}
          {finished
            ? t('leadTime', { days, hours, minutes })
            : t('passedTime', { days, hours, minutes })}
        </p>
      </div>
      {finished ? (
        <div className='flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-[#6E9C6D]'>
          <MdCheck className='text-white' />
        </div>
      ) : (
        <div className='flex aspect-square h-6 w-6 items-center justify-center rounded-full bg-[#8C9299]'>
          <AiOutlineHourglass className='text-white' />
        </div>
      )}
    </div>
  );
};

export default WorkflowLine;

export const WorkflowLineLoadingFallback = ({ open }: { open: boolean }) => (
  <div className='group flex select-none items-center gap-2 border-0 border-t border-solid border-secondary-300 py-3'>
    {open ? (
      <MdExpandMore className='fill-secondary-300 p-0.5' size='1.35rem' />
    ) : (
      <MdExpandLess className='fill-secondary-300 p-0.5' size='1.35rem' />
    )}
    <div className='flex flex-1 flex-col gap-y-1'>
      <div className='m-0 h-3.5 w-1/2 animate-pulse rounded-full bg-secondary-300' />
      <div className='h-2.5 w-1/4 animate-pulse rounded-full bg-secondary-300' />
    </div>
    <div className='flex aspect-square h-6 w-6 animate-pulse items-center justify-center rounded-full bg-secondary-300' />
  </div>
);
