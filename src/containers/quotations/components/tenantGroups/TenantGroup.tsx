import { Typography } from '@AM-i-B-V/ui-kit';
import { ButtonGroup, Grid } from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import ConfirmationModal from '@/components/ConfirmationModal';
import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import { renameDialogFormType } from '@/types/common';
import { isInViewport } from '@/utils/common';
import { formatAmount } from '@/utils/currency';

import { proposalTestIds } from '../../../../../tests/e2e/constants/testIds';
import {
  CalculateAndUpdateQuotationFormFieldArgs,
  DiscountRequest,
  LineGroupItemFinance,
  LineGroupItemHavingDiscount,
  LineGroupItemProduct,
  LineGroupItemPurchase,
  LineGroupItemPurchaseExtra,
  LineGroupItemRequest,
  LineGroupItemTradeIn,
  LineItemAction,
  TenantGroupProps,
} from '../../api/type';
import {
  CreateQuotationFormNames,
  CreateQuotationlineItemFormFieldNames,
  ILineGroupItemDesc,
  IOrderLineConfigState,
  LineGroupItemEntityEnum,
  orderLineConfigStateInit,
  QuotationGroupNameList,
  tenantGroupIdMap,
} from '../../constants';
import { useCreateQuotationContext } from '../../CreateQuotationContextWrapper';
import { CreateQuotationReducerActionType } from '../../CreateQuotationReducer';
import useGetItemCount from '../../hooks/useGetItemCount';
import {
  calculateQuotationAmounts,
  getCalculatedDiscountVal,
  QuotationAmounts,
} from '../../utils';
import AddFinance from '../quotationForms/AddFinance';
import AddProduct from '../quotationForms/AddProduct';
import DiscountForm from '../quotationForms/DiscountForm';
import PurchaseVehicleForm from '../quotationForms/PurchaseVehicleForm';
import TradeInGroup from '../quotationForms/TradeInGroup';
import RenameGroupDialog from '../RenameGroupDialog';
import AddMenu from './AddMenu';
import TenantGroupItem from './TenantGroupItem';
import { TenantGroupItemEntity } from './types';

const TenantGroup: FC<TenantGroupProps> = ({
  groupName,
  formMethods,
  tenantGroupId,
  testGroupName,
  groupFormFieldName,
}) => {
  const [orderLineConfigState, setOrderLineConfigState] =
    useState<IOrderLineConfigState>(orderLineConfigStateInit);

  const [deletingPurchaseIndex, setDeletingPurchaseIndex] = useState<
    null | number
  >(null);

  const t = useTranslations();
  const { state, dispatch } = useCreateQuotationContext();

  const {
    control,
    watch,
    setValue: setFormValue,
    getValues: getFormValues,
  } = formMethods;

  const financesWatch = watch(`${groupFormFieldName}.finances`);
  const productListWatch = watch(`${groupFormFieldName}.products`);
  const purchasesListWatch = watch(`${groupFormFieldName}.purchases`);
  const tradeInsListWatch = watch(`${groupFormFieldName}.tradeIns`);
  const vatType = watch(CreateQuotationFormNames.VAT_TYPE);

  const { financeCount, purchaseVehicleCount, tradeInCount } =
    useGetItemCount(watch);
  const [
    firstLineGroupItem,
    secondLineGroupItem,
    thirdLineGroupItem,
    fourthLineGroupItem,
    fifthLineGroupItem,
    totalDiscountWatch,
    totalAfterDiscountExclVat,
  ] = watch([
    CreateQuotationFormNames.FIRST_LINE_GROUP_ITEM,
    CreateQuotationFormNames.SECOND_LINE_GROUP_ITEM,
    CreateQuotationFormNames.THIRD_LINE_GROUP_ITEM,
    CreateQuotationFormNames.FOURTH_LINE_GROUP_ITEM,
    CreateQuotationFormNames.FIFTH_LINE_GROUP_ITEM,
    CreateQuotationFormNames.TOTAL_DISCOUNT,
    CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_EXCL_VAT,
  ]);

  const totalDiscountWatchValue: number = totalDiscountWatch ?? 0;

  const isAnotherFormOpenAcrossAllTenantGroups = !!(
    orderLineConfigState?.type !== undefined ||
    watch('duplicateCheck.isFinanceFormActive') ||
    watch('duplicateCheck.isProductFromActive') ||
    watch('duplicateCheck.isPurchaseFormActive') ||
    watch('duplicateCheck.isTradeInFormActive')
  );

  const lineGroupItemList: LineGroupItemRequest[] = [
    firstLineGroupItem,
    secondLineGroupItem,
    thirdLineGroupItem,
    fourthLineGroupItem,
    fifthLineGroupItem,
  ];

  const {
    append: appendPurchases,
    remove: removePurchase,
    update: updatePurchase,
  } = useFieldArray({
    control,
    name: `${groupFormFieldName}.purchases`,
  });
  const {
    append: appendFinance,
    remove: removeFinance,
    update: updateFinance,
  } = useFieldArray({
    control,
    name: `${groupFormFieldName}.finances`,
  });
  const {
    append: appendProduct,
    remove: removeProduct,
    update: updateProduct,
  } = useFieldArray({
    control,
    name: `${groupFormFieldName}.products`,
  });
  const {
    append: appendTradeIns,
    update: updateTradeIn,
    remove: removeTradeIn,
  } = useFieldArray({
    control,
    name: `${groupFormFieldName}.tradeIns`,
  });

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedDiscountParent, setDiscountParent] =
    useState<TenantGroupItemEntity | null>(null);

  const menuItems = [
    {
      id: 1,
      name: t('quotations.renameGroup'),
      onClick: () => setIsDialogOpen(true),
    },
  ];

  useEffect(() => {
    setFormValue(`${groupFormFieldName}.groupName`, groupName);
  }, [groupName]);

  useEffect(() => {
    if (isAnotherFormOpenAcrossAllTenantGroups) {
      const element = document.getElementById(
        `${groupFormFieldName}-container`
      );
      if (element) {
        if (isInViewport(element)) {
          return;
        }
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [orderLineConfigState]);

  const AddMenuItems: Item[] = [
    {
      id: 1,
      name: t('quotations.addPurchaseVehicle'),
      testId: proposalTestIds.addPurchaseVehicle,
      onClick: () => {
        setOrderLineConfigState({ type: LineGroupItemEntityEnum.PURCHASE });
      },
      disabled: () =>
        !!watch('duplicateCheck.isPurchaseFormActive') ||
        purchaseVehicleCount > 0,
    },
    {
      id: 2,
      name: t('quotations.addProduct'),
      testId: proposalTestIds.addProduct,
      onClick: () => {
        setOrderLineConfigState({ type: LineGroupItemEntityEnum.PRODUCT });
      },
    },
    {
      id: 3,
      name: t('quotations.addFinance'),
      testId: proposalTestIds.addFinance,
      onClick: () =>
        setOrderLineConfigState({ type: LineGroupItemEntityEnum.FINANCE }),
      disabled: () =>
        !!watch('duplicateCheck.isFinanceFormActive') ||
        financeCount > 0 ||
        !totalAfterDiscountExclVat ||
        totalAfterDiscountExclVat <= 0 ||
        purchaseVehicleCount <= 0,
    },
    {
      id: 4,
      name: t('quotations.addTradeInVehicle'),
      testId: proposalTestIds.addTradeInVehicle,
      onClick: () =>
        setOrderLineConfigState({ type: LineGroupItemEntityEnum.TRADE_IN }),
      disabled: () =>
        !!watch('duplicateCheck.isTradeInFormActive') || tradeInCount > 0,
    },
  ];

  const renameGroup = (data: renameDialogFormType) => {
    const newName = data.name.trim();
    setFormValue(`${groupFormFieldName}.groupName`, newName);
    const groupFieldNameList = state?.groupNameList?.map((groupItem) => {
      if (groupItem.groupFieldName === groupFormFieldName) {
        return {
          ...groupItem,
          groupName: newName,
        };
      }
      return groupItem;
    });
    dispatch({
      type: CreateQuotationReducerActionType.SET_GROUP_ITEM_LIST,
      payload: groupFieldNameList,
    });
    setIsDialogOpen(false);
  };

  const purchaseTenantGroupItems: TenantGroupItemEntity[] =
    purchasesListWatch?.map((purchaseItem, index) => ({
      index,
      quantity: 1,
      descriptiveFieldArray: [
        purchaseItem?.vin ?? '',
        purchaseItem?.driver ?? '',
      ],
      discount: purchaseItem?.discount,
      name: purchaseItem?.description ?? '',
      type: LineGroupItemEntityEnum.PURCHASE,
      totalExclVat: purchaseItem?.totalExclVat,
      isGeneralDiscount: purchaseItem?.isGeneralDiscount,
    })) ?? [];

  const productTenantGroupItems: TenantGroupItemEntity[] =
    productListWatch?.map((product, index) => ({
      index,
      quantity: product?.quantity ?? 1,
      name: product?.name ?? '',
      type: LineGroupItemEntityEnum.PRODUCT,
      totalExclVat: product?.totalExclVat,
      discount: product?.discount,
    })) ?? [];

  const financeTenantGroupItems: TenantGroupItemEntity[] =
    financesWatch?.map((financeItem, index) => ({
      index,
      quantity: 1,
      name: t(`quotations.financeTypes.${financeItem.type}`),
      type: LineGroupItemEntityEnum.FINANCE,
      totalExclVat: financeItem.monthlyExclVAT,
    })) ?? [];

  const tradeInTenantGroupItems: TenantGroupItemEntity[] =
    tradeInsListWatch?.map((tradeInItem, index) => ({
      index,
      quantity: 1,
      name: tradeInItem?.description ?? '',
      type: LineGroupItemEntityEnum.TRADE_IN,
      totalExclVat: tradeInItem.totalExclVat,
      vatType: t(`quotations.quotationVATType.ExclVAT`),
      descriptiveFieldArray: [
        formatAmount(tradeInItem?.mileage) ?? '',
        tradeInItem?.licensePlate ?? '',
      ],
    })) ?? [];

  const updateFormFieldsAfterCalc = ({
    quotationAmounts,
    itemType,
  }: {
    quotationAmounts: QuotationAmounts;
    itemType?: LineGroupItemEntityEnum;
  }) => {
    setFormValue(
      CreateQuotationFormNames.TOTAL_EXCL_VAT,
      quotationAmounts.totalExclVat
    );
    setFormValue(
      CreateQuotationFormNames.TOTAL_INCL_VAT,
      quotationAmounts.totalInclVat
    );
    setFormValue(
      CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_EXCL_VAT,
      quotationAmounts.totalAfterDiscountExclVat
    );
    setFormValue(
      CreateQuotationFormNames.TOTAL_AFTER_DISCOUNT_INCL_VAT,
      quotationAmounts.totalAfterDiscountInclVat
    );
    setFormValue(CreateQuotationFormNames.VAT, quotationAmounts.vatAmount);
  };

  const calculateAndUpdateQuotationFormFields = async ({
    itemType,
    action,
  }: CalculateAndUpdateQuotationFormFieldArgs) => {
    if (
      itemType === LineGroupItemEntityEnum.PURCHASE &&
      action === LineItemAction.DELETE
    ) {
      /** We cannot modify vehicle price on editing a purchase line item, so we don't need to re-cal effective discount */
      setFormValue(CreateQuotationFormNames.TOTAL_DISCOUNT, 0);
    }
    const quotationAmounts = calculateQuotationAmounts({
      lineGroupItemList,
      totalDiscount: totalDiscountWatchValue,
    });
    updateFormFieldsAfterCalc({ quotationAmounts, itemType });
  };

  const onAddProduct = (newProduct: LineGroupItemProduct) => {
    appendProduct(newProduct);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.PRODUCT,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onEditProductLineItem = (
    data: LineGroupItemProduct & { id?: string; index: number }
  ) => {
    const reCalculatedTotal = getCalculatedDiscountVal(
      data.discount?.amount || 0,
      data.totalExclVat,
      data.discount?.percentage || 0
    );

    updateProduct(+data.index, {
      name: data.name,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      totalExclVat: data.totalExclVat,
      totalInclVat: data.totalInclVat,
      discount: data.discount
        ? { ...data.discount, totalDiscount: reCalculatedTotal }
        : undefined,
    });
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.PRODUCT,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onDeleteLineGroupItemProduct = (index: number) => {
    removeProduct(index);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.PRODUCT,
    });
  };

  const openEditLineGroupItemProductForm = (index: number) => {
    const data = productListWatch?.[index];
    setOrderLineConfigState({
      data: { ...data, index },
      isEdit: true,
      type: LineGroupItemEntityEnum.PRODUCT,
    });
  };

  const getMoveToGroupItemList = (
    lineItemFormFieldName: CreateQuotationlineItemFormFieldNames,
    groupformFieldName: QuotationGroupNameList
  ) => getFormValues(`${groupformFieldName}.${lineItemFormFieldName}`);

  const onMoveItemToTenantGroup = ({
    lineItem,
    lineGroupItemDesc,
  }: {
    lineItem: TenantGroupItemEntity;
    lineGroupItemDesc: ILineGroupItemDesc;
  }) => {
    const currentGroupFormFieldName = groupFormFieldName;
    switch (lineItem.type) {
      case LineGroupItemEntityEnum.PRODUCT: {
        const lineItemInCurrentGroup = productListWatch?.[lineItem.index];
        const currentGroupLineItemList = productListWatch?.filter(
          (_, index) => index !== +lineItem.index
        );
        setFormValue(
          `${currentGroupFormFieldName}.${CreateQuotationlineItemFormFieldNames.PRODUCTS}`,
          currentGroupLineItemList
        );

        if (lineItemInCurrentGroup) {
          const moveToGroupNewLineItemList = [
            ...((getMoveToGroupItemList(
              CreateQuotationlineItemFormFieldNames.PRODUCTS,
              lineGroupItemDesc.groupFieldName
            ) as LineGroupItemProduct[]) || []),
            lineItemInCurrentGroup,
          ];
          setFormValue(
            `${lineGroupItemDesc.groupFieldName}.${CreateQuotationlineItemFormFieldNames.PRODUCTS}`,
            moveToGroupNewLineItemList
          );
        }
        break;
      }
      case LineGroupItemEntityEnum.FINANCE: {
        const lineItemInCurrentGroup = financesWatch?.[lineItem.index];
        const currentGroupLineItemList = financesWatch?.filter(
          (_, index) => index !== +lineItem.index
        );
        setFormValue(
          `${currentGroupFormFieldName}.${CreateQuotationlineItemFormFieldNames.FINANCES}`,
          currentGroupLineItemList
        );

        if (lineItemInCurrentGroup) {
          const moveToGroupNewLineItemList = [
            ...((getMoveToGroupItemList(
              CreateQuotationlineItemFormFieldNames.FINANCES,
              lineGroupItemDesc.groupFieldName
            ) as LineGroupItemFinance[]) || []),
            lineItemInCurrentGroup,
          ];
          setFormValue(
            `${lineGroupItemDesc.groupFieldName}.${CreateQuotationlineItemFormFieldNames.FINANCES}`,
            moveToGroupNewLineItemList
          );
        }
        break;
      }
      case LineGroupItemEntityEnum.PURCHASE: {
        const lineItemInCurrentGroup = purchasesListWatch?.[lineItem.index];
        const currentGroupLineItemList = purchasesListWatch?.filter(
          (_, index) => index !== +lineItem.index
        );
        setFormValue(
          `${currentGroupFormFieldName}.${CreateQuotationlineItemFormFieldNames.PURCHASES}`,
          currentGroupLineItemList
        );

        if (lineItemInCurrentGroup) {
          const moveToGroupNewLineItemList = [
            ...((getMoveToGroupItemList(
              CreateQuotationlineItemFormFieldNames.PURCHASES,
              lineGroupItemDesc.groupFieldName
            ) as LineGroupItemPurchase[]) || []),
            lineItemInCurrentGroup,
          ];
          setFormValue(
            `${lineGroupItemDesc.groupFieldName}.${CreateQuotationlineItemFormFieldNames.PURCHASES}`,
            moveToGroupNewLineItemList
          );
        }
        break;
      }
      case LineGroupItemEntityEnum.TRADE_IN: {
        const lineItemInCurrentGroup = tradeInsListWatch?.[lineItem.index];
        const currentGroupLineItemList = tradeInsListWatch?.filter(
          (_, index) => index !== +lineItem.index
        );
        setFormValue(
          `${currentGroupFormFieldName}.${CreateQuotationlineItemFormFieldNames.TRADE_INS}`,
          currentGroupLineItemList
        );

        if (lineItemInCurrentGroup) {
          const moveToGroupNewLineItemList = [
            ...((getMoveToGroupItemList(
              CreateQuotationlineItemFormFieldNames.TRADE_INS,
              lineGroupItemDesc.groupFieldName
            ) as LineGroupItemTradeIn[]) || []),
            lineItemInCurrentGroup,
          ];
          setFormValue(
            `${lineGroupItemDesc.groupFieldName}.${CreateQuotationlineItemFormFieldNames.TRADE_INS}`,
            moveToGroupNewLineItemList
          );
        }
        break;
      }
      default:
        break;
    }
  };

  const onAddFinance = (newFinance: LineGroupItemFinance) => {
    appendFinance(newFinance);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.FINANCE,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onEditFinanceLineItem = (
    data: LineGroupItemFinance & { index: number }
  ) => {
    updateFinance(+data.index, {
      type: data?.type,
      durationInMonths: data?.durationInMonths,
      monthlyExclVAT: data?.monthlyExclVAT,
      finalTerm: data?.finalTerm,
      // tradeInVehicle: data?.tradeInVehicle,
      yearlyMileage: data?.yearlyMileage,
      annualInterestRate: data?.annualInterestRate,
      downPayment: data?.downPayment,
    });
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.FINANCE,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const openEditLineGroupItemFinanceForm = (index: number) => {
    const data = financesWatch?.[index];
    setOrderLineConfigState({
      data: { index, ...data },
      isEdit: true,
      type: LineGroupItemEntityEnum.FINANCE,
    });
  };

  const onDeleteLineGroupItemFinance = (index: number) => {
    removeFinance(index);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.FINANCE,
    });
  };

  const openEditLineGroupItemPurchaseForm = (index: number) => {
    const data = purchasesListWatch?.[index] ?? {};
    setOrderLineConfigState({
      data: { ...data, index },
      isEdit: true,
      type: LineGroupItemEntityEnum.PURCHASE,
    });
  };

  const onAddPurchaseItem = (newPurchase: LineGroupItemPurchase) => {
    appendPurchases(newPurchase);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.FINANCE,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onEditPurchaseItem = (
    data: LineGroupItemPurchase & LineGroupItemPurchaseExtra
  ) => {
    updatePurchase(+data.index, {
      ...(data || {}),
      BPM: data?.BPM,
      description: data?.description,
      driver: data?.driver,
      deliveryDate: data?.deliveryDate,
      licenseDate: data?.licenseDate,
      vehiclePrice: data?.vehiclePrice,
      totalExclVat: data?.totalExclVat,
      discount: data?.discount,
    });
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.PURCHASE,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const resetDiscountFormFields = () => {
    setFormValue(CreateQuotationFormNames.DISCOUNT_AMOUNT, 0);
    setFormValue(CreateQuotationFormNames.DISCOUNT_PERCENTAGE, 0);
    setFormValue(CreateQuotationFormNames.DISCOUNT_DESCRIPTION, '');
    setFormValue(CreateQuotationFormNames.TOTAL_DISCOUNT, 0);
  };

  const onDeleteLineGroupItemPurchase = (index: number) => {
    removePurchase(index);

    const finIndex = lineGroupItemList?.findIndex(
      (lineGroupItem) => lineGroupItem?.finances?.length
    );

    if (finIndex > -1)
      setFormValue(`${tenantGroupIdMap[finIndex]}.finances`, []);

    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.PURCHASE,
      action: LineItemAction.DELETE,
    });
    resetDiscountFormFields();
    setDeletingPurchaseIndex(null);
  };

  const onAddTradeInItem = (newTradeIn: LineGroupItemTradeIn) => {
    appendTradeIns(newTradeIn);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.TRADE_IN,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onEditTradeInItem = (
    data: LineGroupItemTradeIn & { index: number }
  ) => {
    const { index, ...tradeInData } = data;
    updateTradeIn(+index, {
      ...(tradeInData || {}),
    });
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.TRADE_IN,
    });
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onDeleteLineGroupItemTradeIn = (index: number) => {
    removeTradeIn(index);
    calculateAndUpdateQuotationFormFields({
      itemType: LineGroupItemEntityEnum.TRADE_IN,
    });
  };

  const openEditLineGroupItemTradeInForm = (index: number) => {
    const data = tradeInsListWatch?.[index] ?? {};
    setOrderLineConfigState({
      data: { ...data, index },
      isEdit: true,
      type: LineGroupItemEntityEnum.TRADE_IN,
    });
  };

  const openAddEditLineGroupItemDiscountForm = (
    index: number,
    itemType: 'purchases' | 'products'
  ) => {
    const lineItemList = watch(`${groupFormFieldName}.${itemType}`);

    const discount = lineItemList?.[index]?.discount as DiscountRequest;
    setOrderLineConfigState({
      isEdit: true,
      type: LineGroupItemEntityEnum.DISCOUNT,
      data: {
        index,
        amount: discount?.amount ?? 0,
        percentage: discount?.percentage ?? 0,
        description: discount?.description ?? '',
        totalDiscount: discount?.totalDiscount ?? 0,
      },
    });
  };

  const onCancelLineItemDialog = () => {
    setOrderLineConfigState(orderLineConfigStateInit);
  };

  const onCancelDiscountLineItemDialog = () => {
    setOrderLineConfigState(orderLineConfigStateInit);
    setDiscountParent(null);
  };

  const onDiscountSubmit = (data: DiscountRequest & { index: number }) => {
    const { index, ...discount } = data;
    switch (selectedDiscountParent?.type as LineGroupItemHavingDiscount) {
      case LineGroupItemEntityEnum.PURCHASE: {
        updatePurchase(+index, {
          ...(purchasesListWatch?.[index] as LineGroupItemPurchase),
          discount,
          isGeneralDiscount: false,
        });
        calculateAndUpdateQuotationFormFields({
          itemType: LineGroupItemEntityEnum.PURCHASE,
        });
        break;
      }

      case LineGroupItemEntityEnum.PRODUCT: {
        updateProduct(+index, {
          ...(productListWatch?.[index] as LineGroupItemProduct),
          discount,
        });
        calculateAndUpdateQuotationFormFields({
          itemType: LineGroupItemEntityEnum.PRODUCT,
        });
        break;
      }

      default:
        break;
    }

    setOrderLineConfigState(orderLineConfigStateInit);
    setDiscountParent(null);
  };

  const onRemoveDiscountItem = (
    index: number,
    itemType: LineGroupItemHavingDiscount
  ) => {
    switch (itemType) {
      case LineGroupItemEntityEnum.PURCHASE: {
        updatePurchase(+index, {
          ...(purchasesListWatch?.[index] as LineGroupItemPurchase),
          discount: undefined,
        });
        calculateAndUpdateQuotationFormFields({
          itemType: LineGroupItemEntityEnum.PURCHASE,
        });
        break;
      }

      case LineGroupItemEntityEnum.PRODUCT: {
        updateProduct(+index, {
          ...(productListWatch?.[index] as LineGroupItemProduct),
          discount: undefined,
        });
        calculateAndUpdateQuotationFormFields({
          itemType: LineGroupItemEntityEnum.PRODUCT,
        });
        break;
      }

      default:
        break;
    }

    setOrderLineConfigState(orderLineConfigStateInit);
    setDiscountParent(null);
  };

  return (
    <Grid
      container
      id={`${groupFormFieldName}-container`}
      data-testid={`${testGroupName}-container`}
      className='rounded bg-white shadow'
    >
      <Grid item container className='rounded bg-white'>
        <Grid
          item
          container
          justifyContent='space-between'
          className='rounded bg-white p-4'
        >
          <Grid xs={4} sm={4} item>
            <Typography variant='titleMediumBold'>{groupName}</Typography>
          </Grid>
          <Grid xs={8} sm={8} container item className='justify-end'>
            {/* TODO do we need to pass index here */}
            <ButtonGroup color='secondary' variant='outlined' className='h-10'>
              <AddMenu
                index={1}
                menuItems={AddMenuItems}
                testId={`${testGroupName}${proposalTestIds.addLineItem}`}
                disabledState={{
                  disabled: isAnotherFormOpenAcrossAllTenantGroups,
                  message: t('quotations.anotherFormAlreadyOpen'),
                }}
              />
              <div className='grid h-10 place-items-center rounded-r border-2 border-secondary px-2'>
                <EllipsisMenu menuItems={menuItems} index />
              </div>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      {orderLineConfigState.type && (
        <Grid item lg={12} className='bg-grey-4 px-6 py-4'>
          {orderLineConfigState.type === LineGroupItemEntityEnum.PURCHASE && (
            <PurchaseVehicleForm
              mainFormData={watch}
              groupName={groupName}
              testGroupName={testGroupName}
              tenantGroupId={tenantGroupId}
              onCancel={onCancelLineItemDialog}
              onAddPurchaseItem={onAddPurchaseItem}
              onEditPurchaseItem={onEditPurchaseItem}
              purchaseFormConfig={orderLineConfigState}
            />
          )}
          {orderLineConfigState.type === LineGroupItemEntityEnum.FINANCE && (
            <AddFinance
              groupName={groupName}
              parentWatcher={watch}
              testGroupName={testGroupName}
              tenantGroupId={tenantGroupId}
              onAddFinanceItem={onAddFinance}
              onCancel={onCancelLineItemDialog}
              onEditFinance={onEditFinanceLineItem}
              financeFormConfig={orderLineConfigState}
            />
          )}
          {orderLineConfigState.type === LineGroupItemEntityEnum.PRODUCT && (
            <AddProduct
              onAddProduct={onAddProduct}
              testGroupName={testGroupName}
              tenantGroupId={tenantGroupId}
              onCancel={onCancelLineItemDialog}
              onEditProduct={onEditProductLineItem}
              productFormConfig={orderLineConfigState}
            />
          )}
          {orderLineConfigState.type === LineGroupItemEntityEnum.TRADE_IN && (
            <TradeInGroup
              groupName={groupName}
              testGroupName={testGroupName}
              tenantGroupId={tenantGroupId}
              onCancel={onCancelLineItemDialog}
              onAddTradeInItem={onAddTradeInItem}
              onEditTradeInItem={onEditTradeInItem}
              tradeInFormConfig={orderLineConfigState}
            />
          )}
        </Grid>
      )}
      {(selectedDiscountParent?.type as LineGroupItemHavingDiscount) && (
        <DiscountForm
          onDiscountSubmit={onDiscountSubmit}
          discountConfig={
            orderLineConfigState as IOrderLineConfigState & { index: number }
          }
          onCancel={onCancelDiscountLineItemDialog}
          carstockId={purchasesListWatch?.[0]?.carstockId}
          selectedDiscountParent={selectedDiscountParent}
        />
      )}
      <Grid item container flexDirection='column' className='bg-white'>
        {purchaseTenantGroupItems.map((vehicle) => (
          <TenantGroupItem
            key={vehicle.index}
            item={vehicle}
            vatType={vatType}
            showDiscount={
              selectedDiscountParent?.type as LineGroupItemHavingDiscount
            }
            tenantGroupId={tenantGroupId}
            setDiscountParent={setDiscountParent}
            itemType={LineGroupItemEntityEnum?.PURCHASE}
            onDeleteGroupItem={(deleteIndex) => {
              setDeletingPurchaseIndex(deleteIndex + 1);
            }}
            onMoveItemToTenantGroup={onMoveItemToTenantGroup}
            onEditGroupItem={openEditLineGroupItemPurchaseForm}
            isAnotherFormOpen={isAnotherFormOpenAcrossAllTenantGroups}
            onAddEditDiscountItem={(id: number) =>
              openAddEditLineGroupItemDiscountForm(id, 'purchases')
            }
            onRemoveDiscountItem={onRemoveDiscountItem}
            testGroupName={testGroupName}
          />
        ))}
        {productTenantGroupItems.map((product, index) => (
          <TenantGroupItem
            key={product.index}
            item={product}
            vatType={vatType}
            showDiscount={
              selectedDiscountParent?.type as LineGroupItemHavingDiscount
            }
            tenantGroupId={tenantGroupId}
            setDiscountParent={setDiscountParent}
            itemType={LineGroupItemEntityEnum?.PRODUCT}
            onDeleteGroupItem={onDeleteLineGroupItemProduct}
            onMoveItemToTenantGroup={onMoveItemToTenantGroup}
            onEditGroupItem={openEditLineGroupItemProductForm}
            isAnotherFormOpen={isAnotherFormOpenAcrossAllTenantGroups}
            onAddEditDiscountItem={(id: number) =>
              openAddEditLineGroupItemDiscountForm(id, 'products')
            }
            onRemoveDiscountItem={onRemoveDiscountItem}
            testGroupName={testGroupName}
          />
        ))}
        {financeTenantGroupItems.map((finance, index) => (
          <TenantGroupItem
            key={finance.index}
            item={finance}
            vatType={vatType}
            showTotalSection={false}
            tenantGroupId={tenantGroupId}
            itemType={LineGroupItemEntityEnum?.FINANCE}
            onDeleteGroupItem={onDeleteLineGroupItemFinance}
            onMoveItemToTenantGroup={onMoveItemToTenantGroup}
            onEditGroupItem={openEditLineGroupItemFinanceForm}
            isAnotherFormOpen={isAnotherFormOpenAcrossAllTenantGroups}
            testGroupName={testGroupName}
          />
        ))}
        {tradeInTenantGroupItems.map((tradeInItem) => (
          <TenantGroupItem
            key={tradeInItem.index}
            item={tradeInItem}
            vatType={vatType}
            tenantGroupId={tenantGroupId}
            itemType={LineGroupItemEntityEnum?.TRADE_IN}
            testGroupName={testGroupName}
            onDeleteGroupItem={onDeleteLineGroupItemTradeIn}
            onMoveItemToTenantGroup={onMoveItemToTenantGroup}
            onEditGroupItem={openEditLineGroupItemTradeInForm}
            isAnotherFormOpen={isAnotherFormOpenAcrossAllTenantGroups}
          />
        ))}
      </Grid>
      {isDialogOpen && (
        <RenameGroupDialog
          open={isDialogOpen}
          onRename={renameGroup}
          defaultValue={groupName}
          handleClose={() => setIsDialogOpen(false)}
        />
      )}
      <ConfirmationModal
        onClose={() => setDeletingPurchaseIndex(null)}
        headerText={t('quotations.removePurchaseVehicle')}
        message={t('quotations.removePurchaseVehicleConfirmation')}
        onSubmit={() =>
          onDeleteLineGroupItemPurchase(deletingPurchaseIndex! - 1)
        }
        open={deletingPurchaseIndex ? deletingPurchaseIndex > -1 : false}
      />
    </Grid>
  );
};

export default TenantGroup;
