import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { HTMLAttributes } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

interface MobileMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  icon: JSX.Element;
  isSubMenu?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const MobileMenuItem = ({
  label,
  icon,
  isSubMenu = false,
  className,
  isActive = false,
  onClick,
  ...props
}: MobileMenuItemProps) => (
  <div
    className={twMerge(
      'flex cursor-pointer flex-row justify-between px-4 py-1 font-kanit text-base font-semibold text-white border-l-2 border-r-0 border-y-0 border-solid rounded-none',
      `${isActive ? ' border-primary' : ' border-transparent'}`,
      className
    )}
    {...props}
  >
    {isSubMenu ? (
      <Button
        onClick={onClick}
        className='flex w-full items-start justify-between p-0 text-white'
      >
        <div className='flex flex-row items-center gap-2'>
          {icon}
          <Typography variant='titleSmallBold' className='normal-case'>
            {label}
          </Typography>
        </div>
        <MdChevronRight size='1.5rem' />
      </Button>
    ) : (
      <Typography
        variant='titleSmallBold'
        className='flex flex-row items-center gap-2'
      >
        {icon}
        <span>{label}</span>
      </Typography>
    )}
  </div>
);

export default MobileMenuItem;
