'use client';

import React from 'react';
import { AiOutlineHourglass } from 'react-icons/ai';
import { MdCheck, MdFormatListBulleted } from 'react-icons/md';

import { minutesToTime } from '@/utils/date';

type DoneProps = {
  status: 'done';
  timeInMinutes: number;
};

type TodoProps = {
  status: 'todo';
  timeInMinutes: number;
};

type PendingProps = {
  status: 'pending';
  task: string;
};

type Props = {
  title: string;
} & (DoneProps | TodoProps | PendingProps);

const resolveProps = (props: Props) => {
  if (props.status === 'done') {
    const { days, hours, minutes } = minutesToTime(props.timeInMinutes);
    return {
      text: 'Afgerond na',
      subText: `${days}D ${hours}H ${minutes}M`,
      color: '#6E9C6D',
      icon: <MdCheck size='1.25rem' />,
    };
  }
  if (props.status === 'todo') {
    const { days, hours, minutes } = minutesToTime(props.timeInMinutes);
    return {
      text: 'Verwacht over',
      subText: `${days}D ${hours}H ${minutes}M`,
      color: '#323C49',
      icon: <MdFormatListBulleted size='1.25rem' />,
    };
  }
  if (props.status === 'pending') {
    return {
      text: 'Wacht op',
      subText: props.task,
      color: '#8C9299',
      icon: <AiOutlineHourglass size='1.25rem' />,
    };
  }
  return undefined;
};

const WorkflowTask = (props: Props) => {
  const data = resolveProps(props);
  const { title } = props;

  return (
    <div className='flex w-32 flex-col gap-y-1'>
      <p className='m-0'>{title}</p>
      <div className='flex gap-x-2'>
        <div
          style={{ backgroundColor: data?.color }}
          className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white'
        >
          {data?.icon}
        </div>
        <p style={{ color: data?.color }} className='m-0 text-xs'>
          {data?.text}
          <br />
          {data?.subText}
        </p>
      </div>
    </div>
  );
};

export default WorkflowTask;

export const WorkflowTaskLoadingFallback = () => (
  <div className='flex w-32 flex-col gap-y-1'>
    <div className='m-0 h-3.5 w-1/3 animate-pulse rounded-full bg-secondary-300' />
    <div className='flex items-center gap-x-2'>
      <div className='flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-full bg-secondary-300' />
      <div className='flex w-full flex-col gap-1'>
        <div className='h-2.5 w-full animate-pulse rounded-full bg-secondary-300' />
        <div className='h-2.5 w-full animate-pulse rounded-full bg-secondary-300' />
      </div>
    </div>
  </div>
);
