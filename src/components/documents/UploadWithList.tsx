'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { components } from '@generated/documents-types';
import { useEffect, useState } from 'react';

import { useTranslations } from '@/hooks/translation';
import { DocumentParentEntities } from '@/types/common';

import {
  DocumentSubCategory,
  DocumentSubCategoryWithLabel,
  OpportunityDocumentResponse,
} from '../../containers/opportunities/types';
import DocumentFileUpload from './DocumentFileUpload';
import UploadedFile from './UploadedFile';
import UploadingFile from './UploadingFile';

const UploadWithList = (props: {
  uploadFinishCallback?: (isLoading: boolean) => void;
  parentEntityId: number | string;
  category: components['schemas']['CarStockCategory'];
  subcategories: DocumentSubCategoryWithLabel[];
  documents: OpportunityDocumentResponse[];
  isDetailsPage?: boolean;
  parentType: DocumentParentEntities;
}) => {
  const {
    category,
    parentEntityId,
    documents,
    uploadFinishCallback,
    isDetailsPage,
    parentType,
  } = props;
  const t = useTranslations('documents');
  const [uploadedSubcategories, setUploadedSubcategories] = useState<
    DocumentSubCategory[]
  >([]);

  const addSubcategory = (subcategory: DocumentSubCategory) => {
    setUploadedSubcategories([...uploadedSubcategories, subcategory]);
  };

  // Remove files which reached the server and therefore got stored
  useEffect(() => {
    setUploadedSubcategories((prev) =>
      prev.filter((x) => !documents.find((y) => y.subcategory === x))
    );
  }, [documents]);

  return (
    <>
      <DocumentFileUpload
        {...props}
        category={category}
        addSubcategory={addSubcategory}
        uploadFinishCallback={uploadFinishCallback}
      />
      <div
        className={`grid grid-cols-1 divide-secondary-300 ${
          isDetailsPage ? '' : 'divide-y'
        } `}
      >
        {uploadedSubcategories.map((subcategory) => (
          <UploadingFile key={subcategory} name={subcategory} />
        ))}
        {isDetailsPage && (
          <Typography variant='textSmall' className='pt-4 text-grey-56'>
            {t('forInternalUse')}
          </Typography>
        )}
        {documents?.map((document) => (
          <UploadedFile
            key={document.subcategory}
            file={document}
            parentEntityId={parentEntityId}
            isCreated={false}
            parentType={parentType}
          />
        ))}
      </div>
    </>
  );
};

export default UploadWithList;
