'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import colorByProgress from '@/lib/colorByProgress';

import ProgressBar from './ProgressBar';

const ProgressBarBlock = ({
  amount,
  icon,
  className,
  variant,
  showAmount = true,
  color: propColor,
}: {
  amount: number;
  icon?: JSX.Element;
  className?: string;
  variant?: 'small' | 'big';
  color?: string;
  showAmount?: boolean;
}) => {
  amount = Math.min(Math.max(amount, 0), 100);
  const color = propColor ?? colorByProgress(amount);

  if (variant === 'big') {
    return (
      <div className={twMerge('flex items-center gap-4', className)}>
        <motion.div
          className='flex aspect-square h-8 w-8 items-center justify-center rounded-full'
          animate={{ backgroundColor: color }}
          initial={{ backgroundColor: color }}
        >
          {icon}
        </motion.div>
        <ProgressBar progress={amount} color={color} />

        {showAmount && (
          <motion.p
            className='m-0 w-14 font-kanit text-[1.375rem] font-semibold'
            animate={{ color }}
            initial={{ color }}
          >
            {amount}%
          </motion.p>
        )}
      </div>
    );
  }
  return (
    <div
      className={twMerge(
        'flex h-5 items-center justify-center gap-1',
        className
      )}
    >
      <div className='h-2 w-20 rounded bg-[#DEE0E2]'>
        <div
          className={`h-2 ${amount >= 95 ? 'rounded' : 'rounded-l'}`}
          style={{ width: `${amount}%`, backgroundColor: color }}
        />
      </div>
      {showAmount && (
        <p className='font-semibold leading-snug' style={{ color }}>
          {amount}%
        </p>
      )}
    </div>
  );
};

export default ProgressBarBlock;
