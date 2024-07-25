import { Typography } from '@AM-i-B-V/ui-kit';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { MdClose } from 'react-icons/md';

const Pill = ({
  variant,
  children,
  onClick,
}: PropsWithChildren<{
  variant: 'small' | 'medium';
  onClick?: () => void;
}>) => {
  if (variant === 'small') {
    return (
      <span className='my-0.5 max-w-[88px] rounded-[0.625rem] bg-secondary px-2 py-[1px] text-center font-roboto text-xs font-medium leading-snug text-white'>
        {children}
      </span>
    );
  }

  return (
    <div
      role='presentation'
      onClick={onClick}
      className='inline-block h-8 cursor-pointer select-none rounded-2xl bg-[#DEE0E2] pl-4 pr-3 leading-snug text-black transition-colors duration-200 hover:bg-secondary hover:text-white'
    >
      <div className='flex h-full w-full items-center justify-center gap-1'>
        <Typography variant='textMedium'>{children}</Typography>
        <MdClose />
      </div>
    </div>
  );
};

export default Pill;
