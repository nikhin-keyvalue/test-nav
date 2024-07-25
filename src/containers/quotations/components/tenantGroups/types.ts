import { Dispatch, SetStateAction } from 'react';

// eslint-disable-next-line import/no-cycle
import { DiscountRequest, LineGroupItemHavingDiscount } from '../../api/type';
import { ILineGroupItemDesc, LineGroupItemEntityEnum } from '../../constants';

export type TenantGroupItemEntity = {
  name: string;
  index: number;
  quantity: number;
  totalExclVat: number;
  discount?: DiscountRequest;
  isGeneralDiscount?: boolean;
  type: LineGroupItemEntityEnum;
  descriptiveFieldArray?: string[];
};

export interface TenantGroupItemProps {
  itemType?: string;
  tenantGroupId: string;
  testGroupName?: string;
  showTotalSection?: boolean;
  isAnotherFormOpen?: boolean;
  vatType?: 'ExclVAT' | 'InclVAT';
  onEditGroupItem: (id: number) => void;
  onDeleteGroupItem?: (id: number) => void;
  showDiscount?: LineGroupItemHavingDiscount;
  onAddEditDiscountItem?: (id: number) => void;
  item: TenantGroupItemEntity & { discount?: DiscountRequest };
  setDiscountParent?: Dispatch<SetStateAction<TenantGroupItemEntity | null>>;
  onMoveItemToTenantGroup?: ({
    lineItem,
    lineGroupItemDesc,
  }: {
    lineItem: TenantGroupItemEntity;
    lineGroupItemDesc: ILineGroupItemDesc;
  }) => void;
  onRemoveDiscountItem?: (
    id: number,
    type: LineGroupItemHavingDiscount
  ) => void;
}
