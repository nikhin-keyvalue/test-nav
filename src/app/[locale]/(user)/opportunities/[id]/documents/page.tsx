import React from 'react';

import DocumentEditForm from '@/components/documents/DocumentEditForm';
import UploadWithList from '@/components/documents/UploadWithList';
import {
  getDocumentData,
  getOpportunityDetailsById,
  getOpportunityDocumentCategory,
} from '@/containers/opportunities/api/actions';
import { Categories } from '@/containers/opportunities/constants';
import { DocumentParentEntities } from '@/types/common';
import { getSortedSubCategories } from '@/utils/documents';

// TODO: Implement translations
const Page = async ({ params }: { params: { id: string } }) => {
  const docData = (await getDocumentData(params.id)) || [];

  const [opportunityDetails, opportunityDocumentCategories] = await Promise.all(
    [
      getOpportunityDetailsById({
        pathParams: { opportunityId: params.id },
        queryParams: { excludeRelated: true },
      }),
      getOpportunityDocumentCategory(),
    ]
  );

  return (
    <div>
      <DocumentEditForm
        entityName={opportunityDetails?.name || ''}
        internalList={
          <UploadWithList
            parentEntityId={params.id}
            category={Categories.INTERNAL}
            documents={docData.filter(
              (x) => x.category === Categories.INTERNAL
            )}
            subcategories={getSortedSubCategories(
              Categories.INTERNAL,
              opportunityDocumentCategories!
            )}
            parentType={DocumentParentEntities.OPPORTUNITIES}
          />
        }
      />
    </div>
  );
};

export default Page;
