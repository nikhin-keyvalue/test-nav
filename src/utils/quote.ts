import {
  LINE_GROUP_ITEMS_KEYS,
  LineGroupItemsType,
} from '@/containers/opportunities/types';

const checkIfLineGroupItemsEmpty = (lineGroupItem: LineGroupItemsType) => {
  const lineGroupItemKeys = ['finances', 'products', 'purchases', 'tradeIns'];
  return lineGroupItemKeys.some(
    (key: string) =>
      (lineGroupItem[key as LINE_GROUP_ITEMS_KEYS] ?? [])?.length > 0
  );
};

export { checkIfLineGroupItemsEmpty };
