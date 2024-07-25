import '../globals.css';

import Image from 'next/image';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-full min-h-screen flex-col items-center justify-center lg:flex-row'>
      <div className='flex-1 bg-white lg:max-w-[22.5rem]'>
        <div className='flex h-[40rem] w-full flex-col gap-y-6 p-6 lg:max-w-[22.5rem]'>
          <Image
            src='/AM-i-Logo.svg'
            width={260}
            height={150}
            alt='AMI-logo'
            quality={100}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
