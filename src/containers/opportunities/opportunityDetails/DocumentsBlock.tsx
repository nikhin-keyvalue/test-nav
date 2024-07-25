import { Typography } from '@AM-i-B-V/ui-kit';
import { Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { MdOutlineSettings } from 'react-icons/md';

import DetailBlock from '@/components/blocks/DetailBlock';
import { useTranslations } from '@/hooks/translation';
import { DocumentParentEntities } from '@/types/common';
import { getSortedSubCategories } from '@/utils/documents';

import UploadWithList from '../../../components/documents/UploadWithList';
import { Categories } from '../constants';
import { DocumentCategories, OpportunityDocumentResponse } from '../types';

const DocumentsBlock = ({
  documentList = [],
  documentCategories,
  parentType = DocumentParentEntities.OPPORTUNITIES,
}: {
  documentList: OpportunityDocumentResponse[];
  documentCategories?: DocumentCategories[];
  parentType: DocumentParentEntities;
}) => {
  const { id: parentEntityId } = useParams();

  const t = useTranslations();
  const router = useRouter();

  const handleAddClick = () => {
    router.push(`/${parentType}/${parentEntityId}/documents`);
  };

  const DetailBlockProps = {
    title: t('documents.title'),
    button: (
      <Button onClick={handleAddClick}>
        <MdOutlineSettings size='1.25rem' />
        <Typography variant='titleSmallBold' className='pl-1 capitalize'>
          {t('documents.manage')}
        </Typography>
      </Button>
    ),
  };

  const contextForm = useForm<{
    isLoading: boolean;
    isSuccess: boolean;
  }>({
    defaultValues: { isLoading: false, isSuccess: false },
  });

  return (
    <DetailBlock {...DetailBlockProps}>
      <FormProvider {...contextForm}>
        <UploadWithList
          parentEntityId={parentEntityId as string}
          category={Categories.INTERNAL}
          documents={(documentList || []).filter(
            (document) => document.category === Categories.INTERNAL
          )}
          subcategories={getSortedSubCategories(
            Categories.INTERNAL,
            documentCategories
          )}
          parentType={parentType}
        />
      </FormProvider>
    </DetailBlock>
  );
};

export default DocumentsBlock;
