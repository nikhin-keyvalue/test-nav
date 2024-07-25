import debounce from 'lodash.debounce';
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getPostcodeContextBasedOnCountry,
  getPreciseAddressFromPostcode,
} from '@/containers/organisations/api/api';
import { generateSession, getTraceId } from '@/utils/common';

type AddressObjectDataType = {
  street: string;
  country: string;
  locality: string;
  postcode: string;
  building: string;
  buildingNumber: string;
  buildingNumberAddition: string;
};

type PostCodeDataWithContextType = {
  value: string;
  context: string;
  precision: string;
  description: string;
};

type PostCodePreciseDataType = {
  address: AddressObjectDataType;
};

interface FetchPostCodeAddressReturnType {
  loading: boolean;
  onInputChange: (
    event: SyntheticEvent<Element, Event>,
    value: string,
    reason: string
  ) => Promise<void>;
  options: PostCodeDataWithContextType[];
  selectedOption: PostCodeDataWithContextType | null;
  setSelectedCountry: Dispatch<SetStateAction<string>>;
  finalSelectedOption: PostCodePreciseDataType | undefined;
  setSelectedOption: Dispatch<
    SetStateAction<PostCodeDataWithContextType | null>
  >;
  setFinalSelectedOption: Dispatch<
    SetStateAction<PostCodePreciseDataType | undefined>
  >;
}

export const useFetchPostCodeAddress = (): FetchPostCodeAddressReturnType => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('nld');
  const [options, setOptions] = useState<PostCodeDataWithContextType[]>([]);
  const [selectedOption, setSelectedOption] =
    useState<PostCodeDataWithContextType | null>(null);
  const [finalSelectedOption, setFinalSelectedOption] =
    useState<PostCodePreciseDataType>();

  const sessionId = generateSession();

  const getSearchOptions = useCallback(
    async (searchString: string) => {
      setLoading(true);
      try {
        const response = await getPostcodeContextBasedOnCountry(
          searchString,
          sessionId,
          selectedOption?.context,
          selectedCountry
        );

        if (response?.matches) setOptions(response?.matches);
        else setOptions([]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(
          'Oops !!!Something went wrong !!! Unfortunately there seems to be some issue with the Postcode integrations!!!',
          error,
          'AWS-XRAY-TRACE-ID=',
          getTraceId('getPostcdesBasedOnCountryApiCall')
        );
      }
      setLoading(false);
    },
    [selectedCountry, selectedOption]
  );

  const finalSearchOptions = useCallback(async () => {
    setLoading(true);
    try {
      if (selectedOption) {
        const response = await getPreciseAddressFromPostcode(
          selectedOption.context,
          sessionId
        );
        if (response) {
          setFinalSelectedOption(response);
          setSelectedOption(null);
        } else setSelectedOption(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Oops !!!Something went wrong !!! Unfortunately there seems to be some issue with the Postcode integrations !!!',
        'AWS-XRAY-TRACE-ID=',
        getTraceId('getPreciseAddressFromPostcodeApiCall')
      );
    }
    setLoading(false);
  }, [selectedOption]);

  const debouncedSearchOptions = useMemo(
    () => debounce(getSearchOptions, 500),
    [getSearchOptions]
  );

  useEffect(() => {
    if (selectedOption) {
      if (selectedCountry)
        if (selectedOption?.precision === 'Address') {
          finalSearchOptions();
        } else {
          debouncedSearchOptions(selectedOption?.value);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const onInputChange = useCallback(
    async (
      event: SyntheticEvent<Element, Event>,
      value: string,
      reason: string
    ) => {
      const trimmedValue = value.trim();
      if (!trimmedValue.length) {
        setOptions([]);
      }
      if (!!trimmedValue.length && reason === 'input') {
        debouncedSearchOptions(encodeURIComponent(trimmedValue));
      }
    },
    [debouncedSearchOptions]
  );

  return {
    options,
    loading,
    onInputChange,
    selectedOption,
    setSelectedOption,
    setSelectedCountry,
    finalSelectedOption,
    setFinalSelectedOption,
  };
};
