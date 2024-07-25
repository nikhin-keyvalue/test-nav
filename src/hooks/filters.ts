import { definitions } from '@generated/metafactory-service-types';
import { useCallback, useMemo } from 'react';

import {
  FiltersData,
  FiltersDataKeys,
  GroupedData,
  GroupListItem,
  ParamOptionMap,
  tNamespaceMap,
} from '@/containers/vehicles/constants';
import { useDynamicTranslations } from '@/hooks/translation';

const findLabelFromGroupedData = (
  filterOptions: FiltersData,
  filterDataKey: 'sellers' | 'vehicleBrands',
  value: string
) => {
  let label = '';
  filterOptions[filterDataKey]?.some((item) => {
    const data = item.list?.find(({ id }) => String(id) === value);
    if (data) {
      label = String(data.displayValue);
      return true;
    }
    return false;
  });
  return label;
};

const GroupedOptionParentMap = {
  vehicleModelIdList: 'vehicleBrands',
  locationIdList: 'sellers',
} as const;

const useGetOptionLabel = ({
  filterOptions,
}: {
  filterOptions: FiltersData;
}) => {
  const t = useDynamicTranslations();

  const getOptionLabel = useCallback(
    (key: FiltersDataKeys, value: string) => {
      if (key === 'vehicleModelIdList' || key === 'locationIdList') {
        return findLabelFromGroupedData(
          filterOptions,
          GroupedOptionParentMap[key],
          value
        );
      }
      const mappedKey = ParamOptionMap[key];
      const typeCheckItem = filterOptions?.[mappedKey]?.[0];

      const hasNamespace = !!tNamespaceMap[key].length;
      const tNamespace = hasNamespace
        ? tNamespaceMap[key]
        : `stock.filterOptions.${key}`;

      if (typeof typeCheckItem === 'string') return t(`${tNamespace}.${value}`);

      let itemLabel;
      filterOptions[mappedKey]?.some((item) => {
        if (
          typeof item === 'object' &&
          'list' in item &&
          Array.isArray(item.list)
        ) {
          const searchResult = item.list?.find(
            ({ id }) => String(id) === value
          );
          itemLabel = searchResult?.displayValue;
          return !!searchResult;
        }
        return false;
      });
      if (itemLabel) return itemLabel;

      return (
        filterOptions[mappedKey] as Array<definitions['SelectableDto']>
      ).find((item) => String(item?.id) === value)?.displayValue;
    },
    [filterOptions, t]
  );

  return getOptionLabel;
};

const useGetGroupedData = ({
  options,
  selectedParentOptions,
  selectedChildOptions,
}: {
  options: Array<GroupedData>;
  selectedParentOptions: Array<string>;
  selectedChildOptions: Array<string>;
}) => {
  const idDataMap = useMemo(() => {
    const map: Map<string, GroupListItem> = new Map();
    options.forEach(({ id, displayValue, list }) => {
      const stringifiedGroupId = String(id);
      list?.forEach((child) => {
        const stringifiedChildId = String(child.id);
        const data: GroupListItem = {
          id: stringifiedChildId,
          displayValue: child.displayValue,
          parentId: stringifiedGroupId,
          parentDisplayValue: displayValue,
        };
        map.set(stringifiedChildId, data);
      });
    });
    return map;
  }, [options]);

  const formattedOptions = Array.from(idDataMap.values());

  const filteredOptions = useMemo(() => {
    if (selectedParentOptions.length) {
      const newOptions: Array<GroupListItem> = [];
      selectedParentOptions.forEach((option) => {
        const subOptions = formattedOptions.filter(
          ({ parentId }) => parentId === option
        );
        newOptions.push(...subOptions);
      });
      return newOptions;
    }
    return formattedOptions || [];
  }, [formattedOptions, selectedParentOptions]);

  const getUpdatedChildrenOnParentChange = (value: Array<string>) => {
    const updatedChildren = selectedChildOptions?.length
      ? selectedChildOptions?.filter((selectedOption) => {
          const childGroupId = idDataMap.get(selectedOption)?.parentId;
          return childGroupId && value.includes(childGroupId);
        })
      : [];
    return updatedChildren;
  };

  const getUpdatedParentOnChildChange = (value: Array<string>) => {
    const newParent = idDataMap.get(value[0])?.parentId;
    const updatedParents =
      !selectedParentOptions.length && newParent
        ? [newParent]
        : selectedParentOptions;
    return updatedParents;
  };

  return {
    filteredOptions,
    getUpdatedChildrenOnParentChange,
    getUpdatedParentOnChildChange,
  };
};

export { useGetOptionLabel, useGetGroupedData };
