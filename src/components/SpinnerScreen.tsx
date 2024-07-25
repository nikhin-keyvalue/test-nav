import { HTMLAttributes } from 'react';

import Spinner from './Spinner';

interface SpinnerProps extends HTMLAttributes<SVGElement> {
  'data-testid'?: string;
}

const SpinnerScreen = ({
  spinnerProps = {},
  showGradient,
}: {
  spinnerProps?: SpinnerProps;
  showGradient?: boolean;
}) => (
  <div
    className={`fixed left-0 top-0 z-[2] flex h-full w-full items-center justify-center ${showGradient ? 'bg-secondary opacity-20' : ''}`}
  >
    <div className='flex h-20 w-20 items-center justify-center rounded-sm'>
      <Spinner className='h-12 w-12 !text-white' {...spinnerProps} />
    </div>
  </div>
);

export default SpinnerScreen;
