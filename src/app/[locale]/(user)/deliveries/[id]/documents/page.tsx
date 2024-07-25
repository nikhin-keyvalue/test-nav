import React from 'react';

import DocumentEditForm from '@/components/documents/DocumentEditForm';
import UploadWithList from '@/components/documents/UploadWithList';
import {
  getDeliveryDetailsById,
  getDeliveryDocumentCategory,
  getDocumentData,
} from '@/containers/deliveries/api/actions';
import { Categories } from '@/containers/opportunities/constants';
import { DocumentParentEntities } from '@/types/common';
import { getSortedSubCategories } from '@/utils/documents';

// TODO: Implement translations
const Page = async ({ params }: { params: { id: string } }) => {
  const docData = (await getDocumentData(params.id)) || [];

  const [deliveryDetails, deliveryDocumentCategories] = await Promise.all([
    getDeliveryDetailsById({
      pathParams: { deliveryId: params.id },
      queryParams: { excludeRelated: true },
    }),
    getDeliveryDocumentCategory(),
  ]);

  return (
    <div>
      <DocumentEditForm
        entityName={deliveryDetails?.name || ''}
        internalList={
          <UploadWithList
            parentEntityId={params.id}
            category={Categories.INTERNAL}
            documents={docData.filter(
              (x) => x.category === Categories.INTERNAL
            )}
            subcategories={getSortedSubCategories(
              Categories.INTERNAL,
              deliveryDocumentCategories!
            )}
            parentType={DocumentParentEntities.DELIVERIES}
          />
        }
      />
    </div>
  );
};

export default Page;
