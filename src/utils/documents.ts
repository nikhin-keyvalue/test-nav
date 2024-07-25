import { Categories } from '@/containers/opportunities/constants';
import { DocumentCategories } from '@/containers/opportunities/types';

import { sortString } from './common';

const getSubCategories = (
  category: string,
  opportunityDocumentCategories: DocumentCategories[]
) =>
  opportunityDocumentCategories.find(
    (categoryDetails) => categoryDetails.category === category
  )?.subcategories ?? [];

export const getSortedSubCategories = (
  category: Categories,
  opportunityDocumentCategories: DocumentCategories[] = []
) => {
  const subCategories = getSubCategories(
    category,
    opportunityDocumentCategories
  );
  const subCategoriesWithLabel = subCategories.map((value) => ({
    // label: t(`documents.subcategories.${value}`),
    label: value,
    value,
  }));
  const sortedSubCategories = subCategoriesWithLabel.sort((a, b) =>
    sortString(a.label, b.label)
  );
  return sortedSubCategories;
};
