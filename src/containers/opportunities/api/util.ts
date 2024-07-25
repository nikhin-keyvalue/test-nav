import {
  ILineGroupItem,
  LineGroupItemRequest,
  LineGroupItemsObj,
} from '@/containers/quotations/api/type';

export const prepareTenantGroupFormObjects = ({
  lineGroupItemList = [],
}: {
  lineGroupItemList?: ILineGroupItem[];
}): LineGroupItemsObj | undefined => {
  if (lineGroupItemList.length <= 0) {
    return undefined;
  }
  const lineGroupItemReqList: LineGroupItemRequest[] = lineGroupItemList?.map(
    (item) => ({
      groupName: item.groupName ?? '',
      finances: item.finances,
      products: item.products,
      purchases: item.purchases,
      tradeIns: item.tradeIns,
    })
  );

  return {
    firstLineGroupItem: lineGroupItemReqList?.[0],
    secondLineGroupItem: lineGroupItemReqList?.[1],
    thirdLineGroupItem: lineGroupItemReqList?.[2],
    fourthLineGroupItem: lineGroupItemReqList?.[3],
    fifthLineGroupItem: lineGroupItemReqList?.[4],
  };
};
