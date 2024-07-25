'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid } from '@mui/material';
import { proposalTestIds } from '@test/constants/testIds';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  FC,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import DetailBlock from '@/components/blocks/DetailBlock';
import FormPageHeader from '@/components/FormPageHeader';
import SubmitLine from '@/components/SubmitLine';
import { OpportunityDetails } from '@/containers/opportunities/api/type';
import { prepareTenantGroupFormObjects } from '@/containers/opportunities/api/util';
import PreviewAllTenantGroups from '@/containers/opportunities/components/PreviewAllTenantGroups';
import { TransformedVehicleData } from '@/containers/vehicles/api/types';
import {
  clearLocalQuotationDetails,
  getLocalQuotationDetails,
} from '@/containers/vehicles/constants';
import { getDateinDayjs } from '@/types/dayjs';
import { isInViewport, mergeStrings } from '@/utils/common';
import { formatDate } from '@/utils/date';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { createQuotation, updateQuotationAction } from '../api/actions';
import {
  CalculateAndUpdateQuotationFormFieldArgs,
  CreateQuotationFormSchema,
  DiscountRequest,
  LineGroupItemNames,
  LineGroupItemPurchase,
  LineGroupItemRequest,
  LineGroupItemsQuotationUpdateRequest,
  LineItemAction,
  lineItemGroupObject,
  QuotationResponse,
  QuotationStatusEnum,
  QuotationUpdateRequest,
} from '../api/type';
import FinancialSummarySection from '../components/FinancialSummarySection';
import OpportunityDetailsSection from '../components/OpportunityDetailsSection';
import QuotationDetailsSection from '../components/QuotationDetailsSection';
import DiscountForm from '../components/quotationForms/DiscountForm';
import TenantGroupsContainer from '../components/tenantGroups/TenantGroupsContainer';
import ViewDiscountSection from '../components/tenantGroups/ViewDiscountSection';
import ViewGeneralDiscount from '../components/ViewGeneralDiscount';
import {
  CreateQuotationFormNames,
  CreateQuotationFormValidationSchema,
  fifthLineGroupItemNameDefault,
  firstLineGroupItemNameDefault,
  fourthLineGroupItemNameDefault,
  ILineGroupItemDesc,
  IOrderLineConfigState,
  LineGroupItemEntityEnum,
  purchaseLineItemUInit,
  QuotationGroupNameList,
  secondLineGroupItemNameDefault,
  tenantGroupIdMap,
  thirdLineGroupItemNameDefault,
} from '../constants';
import { useCreateQuotationContext } from '../CreateQuotationContextWrapper';
import { CreateQuotationReducerActionType } from '../CreateQuotationReducer';
import useTriggerFinanceCalculation from '../hooks/useTriggerFinanceCalculation';
import { LineGroupItemType, PurchaseLineItemType } from '../types';
import {
  appendPurchaseVehicleDataToForm,
  calculateQuotationAmounts,
  clearVehicleIdFromUrl,
  findPurchaseLineItem,
  getFinanceValue,
  getLineGroupItems,
  QuotationAmounts,
} from '../utils';

interface EditQuotationProps {
  showPreview?: boolean;
  isDuplicateQuotation?: boolean;
  quotationResponse: QuotationResponse;
  opportunityDetails: OpportunityDetails | null;
  transformedVehicleData?: TransformedVehicleData;
}

const EditQuotation: FC<EditQuotationProps> = ({
  quotationResponse,
  opportunityDetails,
  showPreview = false,
  transformedVehicleData,
  isDuplicateQuotation = false,
}) => {
  const router = useRouter();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isTransitionPending, startTransition] = useTransition();
  const validationTranslation = useTranslations('validationMessage');
  const { state: reducerState, dispatch } = useCreateQuotationContext();
  const [purchaseLineItem, setPurchaseLineItem] =
    useState<PurchaseLineItemType>(purchaseLineItemUInit);
  const [showDiscountForm, setShowDiscountForm] = useState<boolean>(false);

  const formMethods = useForm<CreateQuotationFormSchema>({
    defaultValues: {
      ...(!isDuplicateQuotation
        ? { proposalIdentifier: quotationResponse.proposalIdentifier }
        : {}),
      vatType: quotationResponse.vatType,
      status: !isDuplicateQuotation
        ? quotationResponse.status
        : QuotationStatusEnum.CONCEPT,
      newQuotationDate: getDateinDayjs(quotationResponse?.quotationDate),
      newQuotationValidUntil: getDateinDayjs(
        quotationResponse?.quotationValidUntil
      ),
      totalExclVat: quotationResponse?.totalExclVat,
      totalInclVat: quotationResponse?.totalInclVat,
      ...prepareTenantGroupFormObjects({
        lineGroupItemList: quotationResponse.lineGroupItems,
      }),
      totalAfterDiscountExclVAT: quotationResponse?.totalAfterDiscountExclVAT,
      totalAfterDiscountInclVAT: quotationResponse?.totalAfterDiscountInclVAT,
      vat: quotationResponse?.vat,
      opportunityCustomerName: mergeStrings({
        values: [
          opportunityDetails?.customer?.firstName,
          opportunityDetails?.customer?.middleName,
          opportunityDetails?.customer?.lastName,
        ],
      }),
    },
    resolver: zodResolver(
      CreateQuotationFormValidationSchema(validationTranslation)
    ),
  });

  const {
    VAT,
    TOTAL_DISCOUNT,
    TOTAL_EXCL_VAT,
    TOTAL_INCL_VAT,
    THIRD_LINE_GROUP_ITEM,
    FIRST_LINE_GROUP_ITEM,
    FIFTH_LINE_GROUP_ITEM,
    SECOND_LINE_GROUP_ITEM,
    FOURTH_LINE_GROUP_ITEM,
    TOTAL_AFTER_DISCOUNT_EXCL_VAT,
    TOTAL_AFTER_DISCOUNT_INCL_VAT,
  } = CreateQuotationFormNames;

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
  } = formMethods;

  useTriggerFinanceCalculation(watch, setValue);

  const { getValues: getFormValues, setValue: setFormValue } = formMethods;

  const { formData: defaultValues, vehicleSelected } =
    getLocalQuotationDetails();

  const [totalAfterDiscountExclVAT, totalExclVat] = watch([
    TOTAL_AFTER_DISCOUNT_EXCL_VAT,
    TOTAL_EXCL_VAT,
  ]);

  const [
    firstLineGroupItemForDiscount,
    secondLineGroupItemForDiscount,
    thirdLineGroupItemForDiscount,
    fourthLineGroupItemForDiscount,
    fifthLineGroupItemForDiscount,
    totalDiscountWatchForDiscount,
  ] = watch([
    FIRST_LINE_GROUP_ITEM,
    SECOND_LINE_GROUP_ITEM,
    THIRD_LINE_GROUP_ITEM,
    FOURTH_LINE_GROUP_ITEM,
    FIFTH_LINE_GROUP_ITEM,
    TOTAL_DISCOUNT,
    TOTAL_AFTER_DISCOUNT_EXCL_VAT,
  ]);

  const totalDiscountWatchValue: number = totalDiscountWatchForDiscount ?? 0;

  const afterDiscountExclVATWatch = watch('totalAfterDiscountExclVAT');

  const lineGroupItemListForDiscount = useMemo(
    () => [
      firstLineGroupItemForDiscount,
      secondLineGroupItemForDiscount,
      thirdLineGroupItemForDiscount,
      fourthLineGroupItemForDiscount,
      fifthLineGroupItemForDiscount,
      totalDiscountWatchForDiscount,
    ],
    [
      firstLineGroupItemForDiscount,
      secondLineGroupItemForDiscount,
      thirdLineGroupItemForDiscount,
      fourthLineGroupItemForDiscount,
      fifthLineGroupItemForDiscount,
      totalDiscountWatchForDiscount,
    ]
  );

  const updateFormFieldsAfterCalc = ({
    quotationAmounts,
    itemType,
  }: {
    quotationAmounts: QuotationAmounts;
    itemType?: LineGroupItemEntityEnum;
  }) => {
    setFormValue(TOTAL_EXCL_VAT, quotationAmounts.totalExclVat);
    setFormValue(TOTAL_INCL_VAT, quotationAmounts.totalInclVat);
    setFormValue(
      TOTAL_AFTER_DISCOUNT_EXCL_VAT,
      quotationAmounts.totalAfterDiscountExclVat
    );
    setFormValue(
      TOTAL_AFTER_DISCOUNT_INCL_VAT,
      quotationAmounts.totalAfterDiscountInclVat
    );
    setFormValue(VAT, quotationAmounts.vatAmount);
  };

  const calculateAndUpdateFormFields = () => {
    const lineGroupItemList: LineGroupItemRequest[] = [
      getFormValues(QuotationGroupNameList.FIRST_LINE_GROUP) ?? [],
      getFormValues(QuotationGroupNameList.SECOND_LINE_GROUP) ?? [],
      getFormValues(QuotationGroupNameList.THIRD_LINE_GROUP) ?? [],
      getFormValues(QuotationGroupNameList.FOURTH_LINE_GROUP) ?? [],
      getFormValues(QuotationGroupNameList.FIFTH_LINE_GROUP) ?? [],
    ];

    // TODO: calc: correct value totalDiscount stands for effective discount - metafactory api
    const quotationAmounts = calculateQuotationAmounts({
      lineGroupItemList,
      totalDiscount: getFormValues(TOTAL_DISCOUNT) ?? 0,
    });
    updateFormFieldsAfterCalc({ quotationAmounts });
  };

  const getPurchaseLineItem = () => {
    const val = findPurchaseLineItem({
      lineGroupItemList: lineGroupItemListForDiscount,
    });

    if (val && val.index !== -1) {
      const updatedVal = {
        ...val,
        quantity: 1,
        type: LineGroupItemEntityEnum.PURCHASE,
        descriptiveFieldArray: [val?.vin ?? '', val?.driver ?? ''],
      };
      setPurchaseLineItem(updatedVal);
    } else {
      setPurchaseLineItem(purchaseLineItemUInit);
    }
  };

  useEffect(() => {
    dispatch({
      type: CreateQuotationReducerActionType.SET_OPPORTUNITY_TYPE,
      payload: opportunityDetails?.type,
    });
  }, []);

  useEffect(() => {
    getPurchaseLineItem();
  }, [lineGroupItemListForDiscount, afterDiscountExclVATWatch]);

  useEffect(() => {
    if (showDiscountForm) {
      const element = document.getElementById('general-discount-container');
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
  }, [showDiscountForm]);

  useEffect(() => {
    if (defaultValues && vehicleSelected && transformedVehicleData) {
      const formData = appendPurchaseVehicleDataToForm(
        defaultValues,
        transformedVehicleData
      );

      reset(formData);
      dispatch({
        type: CreateQuotationReducerActionType.SET_GROUP_ITEM_LIST,
        payload: tenantGroupIdMap.map((groupFieldName, index) => ({
          id: index,
          groupFieldName,
          groupname: formData[groupFieldName].groupName,
        })),
      });
      // TODO will form we get the resetted values at this point
      calculateAndUpdateFormFields();
      clearLocalQuotationDetails();
      clearVehicleIdFromUrl({ searchParams, currentPath: pathname });
    }
  }, [defaultValues, transformedVehicleData]);

  useEffect(() => {
    const lineGroupItems: lineItemGroupObject = {};
    const lineGroupName: ILineGroupItemDesc[] = [];

    quotationResponse.lineGroupItems?.forEach((groupItem, index) => {
      lineGroupItems[groupItem.groupId] = { ...groupItem };

      lineGroupName.push({
        id: `${index}`,
        groupFieldName: tenantGroupIdMap[index] as LineGroupItemNames,
        groupName: groupItem.groupName || (tenantGroupIdMap[index] as string),
      });
    });

    dispatch({
      type: CreateQuotationReducerActionType.SET_GROUP_ITEM_LIST,
      payload: lineGroupName,
    });
    dispatch({
      type: CreateQuotationReducerActionType.SET_OPPORTUNITY_TYPE,
      payload: opportunityDetails?.type,
    });

    dispatch({
      type: CreateQuotationReducerActionType.INITIAL_API_CALL_ACTION,
      payload: quotationResponse,
    });
  }, []);

  const toggleShowDiscount = () => {
    setShowDiscountForm((val) => !val);
  };

  const onCancelDiscountLineItemDialog = () => {
    setShowDiscountForm(false);
  };

  const quotationDetailActions = [
    {
      id: 1,
      name: t('common.addGeneralDiscount'),
      onClick: toggleShowDiscount,
    },
  ];

  const prepareLineGroupItemPayload = ({
    lineGroupItem,
    lineGroupItemDesc,
  }: {
    lineGroupItem?: LineGroupItemRequest;
    lineGroupItemDesc: ILineGroupItemDesc;
  }) => {
    if (lineGroupItem) {
      if (
        lineGroupItem?.finances?.length &&
        lineGroupItem?.finances?.length > 0
      ) {
        const updatedLineGroupItem = lineGroupItem?.finances.map(
          (financeItem) => {
            const financeWithoutMileage = { ...financeItem };
            delete financeWithoutMileage.yearlyMileage;
            return financeWithoutMileage;
          }
        );
        const updatedPurchaseLineGroupItem = lineGroupItem?.purchases?.map(
          (purchaseItem) => ({
            ...purchaseItem,
            isGeneralDiscount: purchaseItem.isGeneralDiscount || false,
          })
        );
        return {
          ...lineGroupItem,
          finances: updatedLineGroupItem,
          purchases: updatedPurchaseLineGroupItem,
        } as LineGroupItemRequest;
      }
      return lineGroupItem as LineGroupItemRequest;
    }
    return { groupName: lineGroupItemDesc.groupName };
  };

  const goToOpportunityDetailsPage = () => {
    router.replace(
      `/opportunities/${quotationResponse.opportunity.id}/details`
    );
  };

  const onSubmitEditQuotation = async (
    quotationData: CreateQuotationFormSchema
  ) => {
    const {
      firstLineGroupItem,
      secondLineGroupItem,
      thirdLineGroupItem,
      fourthLineGroupItem,
      fifthLineGroupItem,
    } = quotationData;

    const financeValue = getFinanceValue({ watch });
    if (
      (financeValue &&
        financeValue?.financeItem &&
        financeValue?.financeItem?.monthlyExclVAT > 0) ||
      !financeValue ||
      !financeValue.financeItem
    ) {
      const lineGroupItems: LineGroupItemsQuotationUpdateRequest = [
        prepareLineGroupItemPayload({
          lineGroupItemDesc: firstLineGroupItemNameDefault,
          lineGroupItem: firstLineGroupItem,
        }),
        prepareLineGroupItemPayload({
          lineGroupItemDesc: secondLineGroupItemNameDefault,
          lineGroupItem: secondLineGroupItem,
        }),
        prepareLineGroupItemPayload({
          lineGroupItemDesc: thirdLineGroupItemNameDefault,
          lineGroupItem: thirdLineGroupItem,
        }),
        prepareLineGroupItemPayload({
          lineGroupItemDesc: fourthLineGroupItemNameDefault,
          lineGroupItem: fourthLineGroupItem,
        }),
        prepareLineGroupItemPayload({
          lineGroupItemDesc: fifthLineGroupItemNameDefault,
          lineGroupItem: fifthLineGroupItem,
        }),
      ];

      const quotationUpdateRequestPayload: QuotationUpdateRequest = {
        ...(!isDuplicateQuotation
          ? { proposalIdentifier: quotationData.proposalIdentifier }
          : {}),
        status: quotationData.status,
        vatType: quotationData.vatType,
        ...(quotationData.newQuotationDate
          ? {
              quotationDate:
                typeof quotationData.newQuotationDate === 'string'
                  ? formatDate(
                      quotationData.newQuotationDate as string,
                      'YYYY-MM-DD'
                    )
                  : quotationData.newQuotationDate?.format('YYYY-MM-DD'),
            }
          : {}),
        ...(quotationData.newQuotationValidUntil
          ? {
              quotationValidUntil:
                typeof quotationData.newQuotationValidUntil === 'string'
                  ? formatDate(
                      quotationData.newQuotationValidUntil as string,
                      'YYYY-MM-DD'
                    )
                  : quotationData.newQuotationValidUntil?.format('YYYY-MM-DD'),
            }
          : {}),

        lineGroupItems,
        ...((quotationData.discountAmount ||
          quotationData.discountPercentage) && {
          discount: {
            amount: +(quotationData.discountAmount ?? 0),
            percentage: +(quotationData.discountPercentage ?? 0),
            ...(quotationData.discountDescription
              ? { description: quotationData.discountDescription }
              : {}),
            totalDiscount: quotationData.totalDiscount ?? 0,
            totalExclVat: quotationData.totalExclVat ?? 0,
            totalInclVat: quotationData.totalInclVat ?? 0,
          },
        }),
        totalAfterDiscountExclVAT: quotationData.totalAfterDiscountExclVAT,
        totalAfterDiscountInclVAT: quotationData.totalAfterDiscountInclVAT,
        vat: quotationData.vat,
        totalExclVat: quotationData.totalExclVat,
        totalInclVat: quotationData.totalInclVat,
      };

      const isPurchaseVehicle = findPurchaseLineItem({
        lineGroupItemList: lineGroupItems,
      });

      const tradeInVehicle = lineGroupItems.find(
        (lineGroupItem) => lineGroupItem.tradeIns?.length
      )?.tradeIns?.[0];

      if (tradeInVehicle) {
        const products = lineGroupItems.find(
          (lineGroupItem) => lineGroupItem.products?.length
        )?.products?.[0];
        if (!products && !isPurchaseVehicle)
          return showErrorToast(t('quotations.tradeInOnlyQuoteError'));
      }

      const duplicateQuotationReqPayload = {
        ...quotationUpdateRequestPayload,
        status: undefined,
        opportunityId: quotationResponse.opportunity.id,
      };

      const res = !isDuplicateQuotation
        ? await updateQuotationAction({
            body: quotationUpdateRequestPayload,
            pathParams: { id: quotationResponse.id },
          })
        : await createQuotation(duplicateQuotationReqPayload);

      if (res.success) {
        const message = (
          <>
            <div>{t('common.savedSuccessfully')}</div>
            <div
              className='font-bold'
              data-testid={proposalTestIds.proposalSuccessToast}
              id={res.proposalIdentifier}
            >
              Proposal Id: {res.proposalIdentifier}
            </div>
          </>
        );

        showSuccessToast(message, { autoClose: 10000 });
        startTransition(() => goToOpportunityDetailsPage());
      } else {
        showErrorToast(t('common.somethingWentWrong'));
      }
    } else {
      showErrorToast(t('common.createQuotationWithNegativeFinanceValue'));
    }
    return null;
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (reducerState.isSubformEditInProgress) {
      showErrorToast(t('quotations.unsavedChangesDiscounts'));
      return;
    }

    if (
      watch('duplicateCheck.isFinanceFormActive') ||
      watch('duplicateCheck.isProductFromActive') ||
      watch('duplicateCheck.isPurchaseFormActive') ||
      watch('duplicateCheck.isTradeInFormActive')
    ) {
      showErrorToast(t('quotations.unsavedChanges'));
      return;
    }

    handleSubmit(onSubmitEditQuotation)();
  };

  const onCancel = () => {
    startTransition(() => goToOpportunityDetailsPage());
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
      setFormValue(TOTAL_DISCOUNT, 0);
    }
    const quotationAmounts = calculateQuotationAmounts({
      totalDiscount: totalDiscountWatchValue,
      lineGroupItemList: lineGroupItemListForDiscount,
    });
    updateFormFieldsAfterCalc({ quotationAmounts, itemType });
  };

  const lineGroupItemMapper = [
    FIRST_LINE_GROUP_ITEM,
    SECOND_LINE_GROUP_ITEM,
    THIRD_LINE_GROUP_ITEM,
    FOURTH_LINE_GROUP_ITEM,
    FIFTH_LINE_GROUP_ITEM,
  ];

  const onDiscountSubmit = (data: DiscountRequest & { index: number }) => {
    const purchaseIndex = purchaseLineItem.index as number;
    const payload = lineGroupItemListForDiscount[
      purchaseIndex
    ]! as LineGroupItemRequest;
    if (payload?.purchases) {
      payload.purchases[0].discount = data;
      payload.purchases[0].isGeneralDiscount = true;

      setFormValue(
        lineGroupItemMapper[purchaseIndex] as LineGroupItemType,
        payload
      );
      calculateAndUpdateQuotationFormFields({
        itemType: LineGroupItemEntityEnum.PURCHASE,
      });
      setPurchaseLineItem(payload as unknown as PurchaseLineItemType);
      setShowDiscountForm(false);
    }
  };

  const onEditGeneralDiscountItem = () => {
    getPurchaseLineItem();
    setShowDiscountForm(true);
  };

  const onRemoveGeneralDiscountItem = () => {
    const purchaseIndex = purchaseLineItem.index as number;
    const payload = lineGroupItemListForDiscount[
      purchaseIndex
    ]! as LineGroupItemRequest;
    if (payload?.purchases) {
      payload.purchases[0].discount = undefined;
      payload.purchases[0].isGeneralDiscount = false;
      setFormValue(
        lineGroupItemMapper[purchaseIndex] as LineGroupItemType,
        payload
      );
      calculateAndUpdateQuotationFormFields({
        itemType: LineGroupItemEntityEnum.PURCHASE,
      });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <FormPageHeader
          saveButtonProps={{
            disabled:
              isTransitionPending ||
              isSubmitting ||
              reducerState.isProcessInProgress,
          }}
        >
          <Typography variant='titleLargeBold' className='text-secondary'>
            {t(
              !isDuplicateQuotation
                ? 'quotations.editQuotation'
                : 'quotations.duplicateQuotation'
            )}
          </Typography>
        </FormPageHeader>

        <Grid
          gap={2}
          xs={12}
          container
          display='flex'
          className='pt-8'
          justifyContent='space-between'
        >
          <Grid
            item
            gap={2}
            xs={12}
            md={5.8}
            display='flex'
            flexDirection='column'
          >
            <QuotationDetailsSection
              actions={quotationDetailActions}
              showDiscountEllipsis={
                purchaseLineItem &&
                !purchaseLineItem.discount &&
                purchaseLineItem.index !== -1 &&
                !showDiscountForm
              }
              isEditProposal={!isDuplicateQuotation}
            />

            <Grid item>
              <TenantGroupsContainer formMethods={formMethods} />
            </Grid>
            {showDiscountForm && purchaseLineItem && (
              <Grid
                item
                container
                id='general-discount-container'
                className='rounded bg-white px-4 pt-4 shadow'
              >
                <Grid xs={12} item container justifyContent='space-between'>
                  <Grid item>
                    <Typography className='mb-5' variant='titleMediumBold'>
                      {t('quotations.generalDiscount')}
                    </Typography>
                  </Grid>
                </Grid>
                <DiscountForm
                  onDiscountSubmit={onDiscountSubmit}
                  onCancel={onCancelDiscountLineItemDialog}
                  selectedDiscountParent={purchaseLineItem}
                  carstockId={
                    (purchaseLineItem as LineGroupItemPurchase)?.carstockId
                  }
                  discountConfig={
                    {
                      type: LineGroupItemEntityEnum.PURCHASE,
                      isEdit: false,
                      data: {
                        amount: purchaseLineItem.discount?.amount,
                        percentage: purchaseLineItem.discount?.percentage,
                        description: purchaseLineItem.discount?.description,
                        totalDiscount: purchaseLineItem.discount?.totalDiscount,
                        index: purchaseLineItem.index,
                      },
                    } as IOrderLineConfigState & { index: number }
                  }
                />
              </Grid>
            )}
            {!showDiscountForm &&
              purchaseLineItem &&
              purchaseLineItem.discount &&
              purchaseLineItem.isGeneralDiscount && (
                <ViewGeneralDiscount
                  item={purchaseLineItem}
                  onEditGeneralDiscountItem={onEditGeneralDiscountItem}
                  onRemoveGeneralDiscountItem={onRemoveGeneralDiscountItem}
                />
              )}
            {totalAfterDiscountExclVAT < totalExclVat && (
              <Grid item>
                <ViewDiscountSection />
              </Grid>
            )}
            <Grid item>
              <FinancialSummarySection />
            </Grid>
          </Grid>

          <Grid
            item
            gap={2}
            md={5.8}
            xs={12}
            display='flex'
            flexDirection='column'
          >
            <Grid item>
              <OpportunityDetailsSection
                opportunityDetails={opportunityDetails}
              />
            </Grid>
            {showPreview ? (
              <Grid item>
                <DetailBlock
                  needAccordion
                  openOnRender={false}
                  title={t('common.preview')}
                >
                  <div className='mt-2 w-full border-t' />
                  <PreviewAllTenantGroups
                    lineGroupItems={getLineGroupItems(watch())}
                    vatType={watch('vatType')}
                    totalAfterDiscountExclVAT={watch(
                      'totalAfterDiscountExclVAT'
                    )}
                    totalAfterDiscountInclVAT={watch(
                      'totalAfterDiscountInclVAT'
                    )}
                    totalExclVat={watch('totalExclVat')}
                    vat={watch('vat')}
                  />
                </DetailBlock>
              </Grid>
            ) : (
              <> </>
            )}
          </Grid>
        </Grid>
        <SubmitLine
          onSubmit={onSubmit}
          onCancel={onCancel}
          disableButtons={
            isSubmitting ||
            isTransitionPending ||
            reducerState.isProcessInProgress
          }
          testId={proposalTestIds.editQuotationBtn}
        />
      </form>
    </FormProvider>
  );
};

export default EditQuotation;
