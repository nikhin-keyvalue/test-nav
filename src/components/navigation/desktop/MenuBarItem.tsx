import { Typography } from '@AM-i-B-V/ui-kit';
import Link from 'next/link';

const MenuBarItem = ({
  label,
  url,
  prefetch,
  onClick,
}: {
  label: string;
  url: string;
  prefetch?: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={url}
    className='w-full text-inherit no-underline'
    onClick={() => {
      if (onClick) onClick();
    }}
    prefetch={!!prefetch}
  >
    <div className='flex h-10 w-full cursor-pointer items-center pl-4 pr-2 font-semibold text-white no-underline hover:bg-primary'>
      <Typography variant='textMediumBold'>{label}</Typography>
    </div>
  </Link>
);

export default MenuBarItem;
