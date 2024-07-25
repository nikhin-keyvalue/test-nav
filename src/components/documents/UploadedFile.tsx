import Link from 'next/link';
import { MdCheckCircle, MdOutlineInsertDriveFile } from 'react-icons/md';

import { useTranslations } from '@/hooks/translation';
import { DocumentParentEntities } from '@/types/common';
import formatBytes from '@/utils/common';

import { OpportunityDocumentResponse } from '../../containers/opportunities/types';

type UploadedFileProps = {
  file: OpportunityDocumentResponse;
  parentEntityId: number | string;
  isCreated: boolean;
  parentType: DocumentParentEntities;
};

const UploadedFile = ({
  file,
  parentEntityId,
  isCreated = false,
  parentType = DocumentParentEntities.OPPORTUNITIES,
}: UploadedFileProps) => {
  const t = useTranslations('documents.subcategories');

  return (
    <div
      data-testid={`uploadedfile.${file.subcategory}`}
      className='flex items-center gap-x-2 border-0 border-solid py-2'
    >
      <div className='flex flex-1 items-center gap-1 font-semibold text-primary'>
        <MdOutlineInsertDriveFile size='1.5rem' />
        <Link
          href={`/api/downloadDocument?filename=${file.subcategory}&category=${
            file.category
          }&${
            parentType === DocumentParentEntities.OPPORTUNITIES
              ? 'opportunityId'
              : 'deliveryId'
          }=${parentEntityId}`}
          className='text-primary !no-underline'
          prefetch={false}
          target='_blank'
          download
        >
          <p className='m-0'>{file.subcategory ? t(file.subcategory) : ''}</p>
        </Link>
      </div>
      {isCreated && <MdCheckCircle color='green' />}
      <p
        data-testid='filesize'
        className='m-0 text-xs font-normal text-secondary-500'
      >
        {formatBytes(file.size!)}
      </p>
    </div>
  );
};

export default UploadedFile;
