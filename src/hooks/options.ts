import debounce from 'lodash.debounce';
import { SyntheticEvent, useCallback, useMemo, useState } from 'react';

interface OptionProps {
  id?: string;
  name?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
}

export const useOptions = <T extends OptionProps>({
  url,
  currentOptions,
  limit = 50,
  customSearchParamKeys,
}: {
  url: string;
  currentOptions?: Array<T>;
  limit?: number;
  customSearchParamKeys?: string[];
}) => {
  const [options, setOptions] = useState<Array<T> | Array<OptionProps>>([]);

  const [selectedOption, setSelectedOption] = useState<T | null | OptionProps>(
    null
  );
  const [loading, setLoading] = useState(false);

  const optionsUrl = `${url}${url.includes('?') ? '&' : '?'}limit=${limit}`;

  const fetchOptions = async (fetchUrl: string) => {
    setLoading(true);
    try {
      const response = await fetch(fetchUrl);
      if (response?.status !== 200) return;

      const selectables: { data: Array<T> } = await response.json();

      if (selectables) {
        const allOptions = selectables.data;

        const filteredOptions = currentOptions
          ? allOptions?.filter(
              ({ id }) =>
                !currentOptions?.find(({ id: optionId }) => optionId === id)
            )
          : allOptions;
        if (filteredOptions?.length) setOptions(filteredOptions);
        else setOptions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const buildSearchString = (value: string) =>
    customSearchParamKeys?.reduce(
      (combinedSearchString: string, key: string) =>
        `${combinedSearchString}&${key}=${value}`,
      ''
    );

  const getSearchString = (value: string) =>
    customSearchParamKeys ? buildSearchString(value) : `&name=${value}`;

  const searchOptions = useCallback(
    (value: string) => {
      fetchOptions(`${optionsUrl}${value ? getSearchString(value) : ''}`);
    },
    [url, currentOptions]
  );

  const debouncedSearchOptions = useMemo(
    () => debounce(searchOptions, 500),
    [searchOptions]
  );

  const onOpen = () => {
    if (options.length === 0) fetchOptions(optionsUrl);
  };

  const onInputChange = useCallback(
    async (event: SyntheticEvent<Element, Event>, value: string) => {
      const trimmedValue = value.trim();
      debouncedSearchOptions(trimmedValue);
    },
    [debouncedSearchOptions]
  );

  return {
    loading,
    options,
    setOptions,
    onInputChange,
    selectedOption,
    setSelectedOption,
    onOpen,
  };
};
