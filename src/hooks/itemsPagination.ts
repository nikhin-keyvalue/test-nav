import { useState } from 'react';

type useItemPagination<T> = {
  items: Array<T>;
  totalCount: number;
  itemsPerPage: number;
};

const useItemPagination = <T>({
  items,
  totalCount,
  itemsPerPage,
}: useItemPagination<T>) => {
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const start = page * itemsPerPage;

  const paginatedItems = showAll
    ? items
    : items.slice(start, start + itemsPerPage);

  const reorderItems = (updatedItems: Array<T>) => {
    if (!showAll) {
      const startIndex = page * itemsPerPage;

      const newItems = [
        ...items.slice(0, startIndex),
        ...updatedItems,
        ...items.slice(startIndex + itemsPerPage),
      ];

      return newItems;
    }

    return updatedItems;
  };

  return {
    page,
    itemsPerPage,
    showAll,
    showFooter: itemsPerPage < totalCount,
    setPage,
    setShowAll,
    paginatedItems,
    reorderItems,
  };
};

export default useItemPagination;
