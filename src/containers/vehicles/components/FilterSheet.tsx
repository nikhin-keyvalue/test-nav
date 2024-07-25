'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import {
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { Accordion } from '@radix-ui/react-accordion';
import { useEffect, useRef, useState } from 'react';
import { MdFilterList, MdOutlineClear, MdOutlineDelete } from 'react-icons/md';

import Combobox from '@/components/Combobox';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetMain,
  SheetTitle,
  SheetTrigger,
} from '@/components/Sheet';
import SimpleDropdown from '@/components/SimpleDropdown';
import { useGetGroupedData, useGetOptionLabel } from '@/hooks/filters';
import { useTranslations } from '@/hooks/translation';

import {
  FiltersData,
  FiltersDataKeys,
  MultiSelectFiltersState,
  PARAM_VALUES,
  SearchParams,
} from '../constants';
import { FilterAccordionItem } from './FilterAccordionItem';
import GroupedDropdown from './GroupedDropdown';
import Pill from './Pill';

const defaultState = {
  carStockDiscountOriginList: [],
  carStockOriginList: [],
  financialOwnerIdList: [],
  pipelineStatusList: [],
  preferredDiscountSourceList: [],
  preferredPriceSourceList: [],
  priceStatusList: [],
  publishSourceList: [],
  sellerIdList: [],
  locationIdList: [],
  sellingStatusList: [],
  stockStatusList: [],
  typeList: [],
  vehicleBodyTypeList: [],
  vehicleBrandIdList: [],
  vehicleColorList: [],
  vehicleFuelTypeList: [],
  vehicleModelIdList: [],
  vehicleTransmissionList: [],
};

const FilterSheet = ({
  filterOptions,
  currentMultiSelectFilters,
  currentPublished,
  applyFilters,
  triggerLabel,
  params,
}: {
  filterOptions: FiltersData;
  currentMultiSelectFilters: MultiSelectFiltersState;
  currentPublished: string;
  applyFilters: (
    multiselectFilters: MultiSelectFiltersState,
    published: string
  ) => void;
  triggerLabel: string;
  params: SearchParams;
}) => {
  const t = useTranslations('stock');
  const tCommon = useTranslations();

  const isCancelled = useRef(true);

  const [filters, setFilters] = useState<MultiSelectFiltersState>({
    ...defaultState,
    ...currentMultiSelectFilters,
  });
  const [published, setPublished] = useState(currentPublished ?? '');

  const getOptionLabel = useGetOptionLabel({ filterOptions });

  const {
    filteredOptions: filteredModels,
    getUpdatedChildrenOnParentChange: getModelsOnBrandChange,
    getUpdatedParentOnChildChange: getBrandsOnModelChange,
  } = useGetGroupedData({
    options: filterOptions?.vehicleBrands || [],
    selectedParentOptions: filters.vehicleBrandIdList,
    selectedChildOptions: filters.vehicleModelIdList,
  });

  const {
    filteredOptions: filteredLocations,
    getUpdatedChildrenOnParentChange: getLocationsOnSellerChange,
    getUpdatedParentOnChildChange: getSellersOnLocationChange,
  } = useGetGroupedData({
    options: filterOptions?.sellers || [],
    selectedParentOptions: filters.sellerIdList,
    selectedChildOptions: filters.locationIdList,
  });

  useEffect(() => {
    setPublished(currentPublished);
  }, [currentPublished]);

  useEffect(() => {
    setFilters((prevState) => ({
      ...prevState,
      ...currentMultiSelectFilters,
    }));
  }, [currentMultiSelectFilters]);

  const onSelectFilter = (event: {
    target: { name: string; value: string };
  }) => {
    setFilters((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const setAutoCompleteField = (name: string, value: string[]) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const removeFilter = (key: FiltersDataKeys, value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [key]: filters[key].filter((i) => i !== value),
    }));
  };

  const onGroupParentChange = (name: string, value: Array<string>) => {
    const isBrand = name === 'vehicleBrandIdList';
    const newChildren = isBrand
      ? getModelsOnBrandChange(value)
      : getLocationsOnSellerChange(value);
    const filterUpdate: Partial<MultiSelectFiltersState> = isBrand
      ? { vehicleBrandIdList: value, vehicleModelIdList: newChildren }
      : { sellerIdList: value, locationIdList: newChildren };
    setFilters((prevState) => ({
      ...prevState,
      ...filterUpdate,
    }));
  };

  const onGroupChildChange = (name: string, value: Array<string>) => {
    const isModel = name === 'vehicleModelIdList';
    const newParents = isModel
      ? getBrandsOnModelChange(value)
      : getSellersOnLocationChange(value);
    const filterUpdate: Partial<MultiSelectFiltersState> = isModel
      ? { vehicleBrandIdList: newParents, vehicleModelIdList: value }
      : { sellerIdList: newParents, locationIdList: value };
    setFilters((prevState) => ({
      ...prevState,
      ...filterUpdate,
    }));
  };

  const applyFilterIfNotCancelled = () => {
    if (isCancelled.current) {
      setFilters({ ...defaultState, ...currentMultiSelectFilters });
      setPublished(currentPublished);
      return;
    }
    applyFilters(filters, published);
    isCancelled.current = true;
  };

  return (
    <Sheet onOpenChange={applyFilterIfNotCancelled}>
      <SheetTrigger asChild>
        <Button
          color='secondary'
          variant='outlined'
          className='h-full shrink-0 px-3 normal-case'
        >
          <MdFilterList className='mr-[6px] h-5 w-5' />
          <Typography variant='titleSmallBold'>{triggerLabel}</Typography>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('filters.sheetTitle')}</SheetTitle>
        </SheetHeader>
        <SheetMain className='p-0'>
          <Accordion
            type='multiple'
            defaultValue={['mostUsed']}
            className='flex flex-col divide-y divide-[#DEE0E2]'
            autoFocus={false}
            tabIndex={-1}
          >
            <FilterAccordionItem
              title={t('filters.mostUsedFilters')}
              value='mostUsed'
            >
              <div className='flex flex-col gap-4 p-4'>
                <SimpleDropdown
                  dataTestId='filter-sheet-status-dropdown'
                  options={filterOptions?.stockStatuses?.map((status) => ({
                    id: status,
                    displayValue: tCommon(`stockDetails.status.${status}`),
                  }))}
                  label={t('filters.stock')}
                  value={
                    filters?.stockStatusList[0] !== PARAM_VALUES.ALL
                      ? filters?.stockStatusList
                      : []
                  }
                  onChange={onSelectFilter}
                  name='stockStatusList'
                  tName='stockStatusList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-type-dropdown'
                  options={filterOptions?.types?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  label={t('filters.type')}
                  value={filters?.typeList}
                  onChange={onSelectFilter}
                  name='typeList'
                  tName='typeList'
                />
                <Combobox
                  dataTestId='filter-sheet-dealer-dropdown'
                  label={t('filters.dealer')}
                  options={
                    filterOptions.financialOwners?.map((v) => ({
                      id: v.id!.toString(),
                      displayValue: v.displayValue!,
                    })) || []
                  }
                  values={filters.financialOwnerIdList}
                  onValChange={(v) =>
                    setAutoCompleteField(
                      'financialOwnerIdList',
                      v.map((x) => x.id)
                    )
                  }
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-sale-status-dropdown'
                  options={filterOptions?.sellingStatuses?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  label={t('filters.saleStatus')}
                  value={
                    filters?.sellingStatusList[0] !== PARAM_VALUES.ALL
                      ? filters?.sellingStatusList
                      : []
                  }
                  onChange={onSelectFilter}
                  name='sellingStatusList'
                  tName='sellingStatusList'
                />
              </div>
            </FilterAccordionItem>
            <FilterAccordionItem
              title={t('filters.vehicleFilters')}
              value='vehicleFilters'
            >
              <div className='flex flex-col gap-4 p-4'>
                <Combobox
                  dataTestId='filter-sheet-body-type-dropdown'
                  label={t('filters.bodyType')}
                  options={filterOptions.vehicleBodyTypes || []}
                  values={filters.vehicleBodyTypeList!}
                  onValChange={(val) =>
                    setAutoCompleteField(
                      'vehicleBodyTypeList',
                      val.map((v) => v.id.toString())
                    )
                  }
                />
                <Combobox
                  dataTestId='filter-sheet-brand-dropdown'
                  label={t('filters.brand')}
                  options={
                    filterOptions.vehicleBrands?.map((x) => ({
                      id: x.id!.toString(),
                      displayValue: x.displayValue!,
                    })) || []
                  }
                  values={filters.vehicleBrandIdList}
                  onValChange={(val) =>
                    setAutoCompleteField(
                      'vehicleBrandIdList',
                      val.map((x) => x.id.toString())
                    )
                  }
                />
                <GroupedDropdown
                  options={filteredModels}
                  label={t('filters.model')}
                  value={filters.vehicleModelIdList}
                  onChange={onGroupChildChange}
                  name='vehicleModelIdList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-color-dropdown'
                  options={filterOptions?.vehicleColors?.map((item) => ({
                    id: item,
                    displayValue: t(`filterOptions.vehicleColorList.${item}`),
                  }))}
                  label={t('filters.color')}
                  tName='vehicleColorList'
                  value={filters.vehicleColorList}
                  onChange={onSelectFilter}
                  name='vehicleColorList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-transmission-dropdown'
                  options={filterOptions?.vehicleTransmissions?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  label={t('filters.transmission')}
                  value={filters?.vehicleTransmissionList}
                  onChange={onSelectFilter}
                  tName='vehicleTransmissionList'
                  name='vehicleTransmissionList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-fuel-type-dropdown'
                  options={filterOptions?.fuelTypes?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  value={filters?.vehicleFuelTypeList}
                  label={t('filters.fuelType')}
                  onChange={onSelectFilter}
                  tName='vehicleFuelTypeList'
                  name='vehicleFuelTypeList'
                />
              </div>
            </FilterAccordionItem>
            <FilterAccordionItem
              title={t('filters.stockFilters')}
              value='stockFilters'
            >
              <div className='flex flex-col gap-4 p-4'>
                <SimpleDropdown
                  dataTestId='filter-sheet-status-dropdown'
                  options={filterOptions?.pipelineStatuses?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  label={t('filters.status')}
                  value={filters?.pipelineStatusList}
                  onChange={onSelectFilter}
                  name='pipelineStatusList'
                  tName='pipelineStatusList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-publish-source-dropdown'
                  options={filterOptions?.publishSources?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  label={t('filters.publishSource')}
                  value={filters?.publishSourceList}
                  onChange={onSelectFilter}
                  name='publishSourceList'
                  tName='publishSourceList'
                />
                <Combobox
                  dataTestId='filter-sheet-seller-dropdown'
                  label={t('filters.seller')}
                  options={
                    filterOptions.sellers?.map((v) => ({
                      id: v.id!.toString(),
                      displayValue: v.displayValue!,
                    })) || []
                  }
                  values={filters.sellerIdList}
                  onValChange={(v) =>
                    onGroupParentChange(
                      'sellerIdList',
                      v.map((x) => x.id)
                    )
                  }
                />
                <GroupedDropdown
                  options={filteredLocations}
                  label={t('filters.location')}
                  value={filters?.locationIdList}
                  onChange={onGroupChildChange}
                  name='locationIdList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-type-dropdown'
                  options={filterOptions?.types?.map((item) => ({
                    id: item,
                    displayValue: t(`filters.${item}`),
                  }))}
                  label={t('filters.type')}
                  value={filters?.typeList}
                  onChange={onSelectFilter}
                  name='typeList'
                  tName='typeList'
                />
                <TextField
                  select
                  label={t('filters.published')}
                  onChange={({ target }) => setPublished(target.value)}
                  value={published ?? ''}
                  SelectProps={{ MenuProps: { disablePortal: true } }}
                  InputProps={{
                    endAdornment: published?.length ? (
                      <IconButton
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setPublished('');
                        }}
                        className='absolute right-7 border-none bg-transparent hover:cursor-pointer'
                      >
                        <MdOutlineClear
                          size={20}
                          className='text-[rgba(0,0,0,0.54)]'
                        />
                      </IconButton>
                    ) : null,
                  }}
                >
                  {(['true', 'false'] as const).map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`filterOptions.published.${value}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </FilterAccordionItem>
            <FilterAccordionItem
              title={t('filters.otherFilters')}
              value='otherFilters'
            >
              <div className='flex flex-col gap-4 p-4'>
                <SimpleDropdown
                  dataTestId='filter-sheet-car-stock-discount-origin-dropdown'
                  options={filterOptions?.carStockDiscountOrigins?.map(
                    (item) => ({
                      id: item,
                      displayValue: t(
                        `filterOptions.carStockDiscountOriginList.${item}`
                      ),
                    })
                  )}
                  label={t('filters.discountOrigin')}
                  value={filters?.carStockDiscountOriginList}
                  onChange={onSelectFilter}
                  name='carStockDiscountOriginList'
                  tName='carStockDiscountOriginList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-car-stock-origin-dropdown'
                  options={filterOptions?.carStockOrigins?.map((item) => ({
                    id: item,
                    displayValue: t(`filterOptions.carStockOriginList.${item}`),
                  }))}
                  label={t('filters.creationOrigin')}
                  value={filters?.carStockOriginList}
                  onChange={onSelectFilter}
                  name='carStockOriginList'
                  tName='carStockOriginList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-preferred-discount-source-dropdown'
                  options={filterOptions?.preferredDiscountSources?.map(
                    (item) => ({
                      id: item,
                      displayValue: t(
                        `filterOptions.preferredDiscountSourceList.${item}`
                      ),
                    })
                  )}
                  label={t('filters.discountSource')}
                  value={filters?.preferredDiscountSourceList}
                  onChange={onSelectFilter}
                  name='preferredDiscountSourceList'
                  tName='preferredDiscountSourceList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-preferred-price-source-dropdown'
                  options={filterOptions?.preferredPriceSources?.map(
                    (item) => ({
                      id: item,
                      displayValue: t(
                        `filterOptions.preferredPriceSourceList.${item}`
                      ),
                    })
                  )}
                  label={t('filters.priceSource')}
                  value={filters?.preferredPriceSourceList}
                  onChange={onSelectFilter}
                  name='preferredPriceSourceList'
                  tName='preferredPriceSourceList'
                />
                <SimpleDropdown
                  dataTestId='filter-sheet-price-status-dropdown'
                  options={filterOptions?.priceStatuses?.map((item) => ({
                    id: item,
                    displayValue: t(`filterOptions.priceStatusList.${item}`),
                  }))}
                  label={t('filters.adjustedPrice')}
                  value={filters?.priceStatusList}
                  onChange={onSelectFilter}
                  name='priceStatusList'
                  tName='priceStatusList'
                />
              </div>
            </FilterAccordionItem>
          </Accordion>
          <div className='flex flex-wrap items-center gap-2 p-4'>
            <Tooltip title={t('clearFiltersTooltip')}>
              <ButtonGroup color='secondary'>
                <Button
                  size='small'
                  onClick={() => {
                    setFilters(defaultState);
                    setPublished('');
                  }}
                >
                  <MdOutlineDelete className='h-5 w-5' />
                </Button>
              </ButtonGroup>
            </Tooltip>
            {Object.keys(filters).map((key) => {
              const filterKey = key as FiltersDataKeys;
              return filters[filterKey].map((selectedOption) => (
                <Pill
                  key={`${filterKey}_${selectedOption}`}
                  variant='medium'
                  onClick={() => removeFilter(filterKey, selectedOption)}
                >
                  {getOptionLabel(filterKey, selectedOption)}
                </Pill>
              ));
            })}
            {published?.length ? (
              <Pill variant='medium' onClick={() => setPublished('')}>
                {t(`filterOptions.published.${published as 'true' | 'false'}`)}
              </Pill>
            ) : null}
          </div>
        </SheetMain>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant='text'
              color='primary'
              sx={{ textTransform: 'none' }}
            >
              <Typography variant='titleSmallBold'>
                {tCommon('actions.cancel')}
              </Typography>
            </Button>
          </SheetClose>
          <SheetClose
            onClick={() => {
              isCancelled.current = false;
            }}
            asChild
          >
            <Button
              variant='outlined'
              color='secondary'
              sx={{ textTransform: 'none' }}
            >
              <Typography variant='titleSmallBold'>
                {t('filters.showVehicles')}
              </Typography>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
