import { MdOutlineUploadFile } from 'react-icons/md';

import ProgressBarBlock from '@/components/ProgressBarBlock';
import { useMockProgress } from '@/hooks/progress';
import { useTranslations } from '@/hooks/translation';

import { DocumentSubCategory } from '../../containers/opportunities/types';

type UploadingFileProps = { name: DocumentSubCategory };

const UploadingFile = ({ name }: UploadingFileProps) => {
  const t = useTranslations('documents.subcategories');
  const { progress } = useMockProgress({ startOnMount: true });
  return (
    <div
      data-testid={`uploadingfile.${name}`}
      className='flex items-center gap-x-2 border-0 border-solid py-2'
    >
      <div className='flex flex-1 items-center font-semibold text-secondary'>
        <div className='flex flex-1 items-center gap-1'>
          <MdOutlineUploadFile size='1.5rem' />
          <p className='m-0'>{t(name)}</p>
        </div>
        <ProgressBarBlock amount={progress} showAmount={false} />
      </div>
    </div>
  );
};

export default UploadingFile;
