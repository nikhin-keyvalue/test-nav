import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';
import { MdArrowBack } from 'react-icons/md';

const MobileSubmenu = ({
  children,
  handleBackClick,
}: {
  children: ReactNode;
  handleBackClick: () => void;
}) => {
  const t = useTranslations('common');
  return (
    <div>
      <div className='z-20 flex cursor-pointer items-center border-0 border-b border-solid border-b-secondary-300 bg-secondary p-4 text-white'>
        <Button
          onClick={handleBackClick}
          className='justify-start gap-4 p-0 text-white'
        >
          <MdArrowBack size='1.5rem' />
          <div className='font-kanit font-semibold'>{t('back')}</div>
        </Button>
      </div>
      {children}
    </div>
  );
};

export default MobileSubmenu;
