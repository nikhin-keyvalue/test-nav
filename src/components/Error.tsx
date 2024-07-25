'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface ErrorProps {
  className?: string;
  title: string;
  description: string;
  actions?: JSX.Element;
}

// Note: Can be used to render error-ui for components wrapped in suspense. User can still interact with other parts of the application
const ComponentError = ({
  className,
  title,
  description,
  actions,
}: ErrorProps) => (
  <div
    className={twMerge(
      'flex flex-col gap-8 items-center md:max-w-[400px] h-full',
      className
    )}
  >
    <h1 className='font-kanit text-[22px] font-semibold leading-5 md:text-[32px] md:leading-10'>
      {title}
    </h1>
    <p className='leading-5'>{description}</p>
    {actions}
  </div>
);

const Error = ({ className, title, description, actions }: ErrorProps) => (
  <div
    className={twMerge('flex flex-col gap-10 md:gap-16 md:flex-row', className)}
  >
    <Image
      src='/AM-i-Logo.svg'
      alt='AM-I_logo'
      height={40}
      width={130}
      className='h-8 w-[104px] md:h-10 md:w-[130px]'
    />
    <div className='md:max-w-[400px]'>
      <h1 className='mb-4 mt-0 font-kanit text-[22px] font-semibold leading-[28px] md:text-[32px] md:leading-10'>
        {title}
      </h1>
      <p className='mb-10 leading-5'>{description}</p>
      {actions}
    </div>
  </div>
);

const FullPageError = (props: ErrorProps) => (
  <div className='justify-center px-6 py-10 md:flex md:h-screen md:items-center md:p-0'>
    <Error className='md:max-w-[660px]' {...props} />
  </div>
);

export { Error, FullPageError, ComponentError };
