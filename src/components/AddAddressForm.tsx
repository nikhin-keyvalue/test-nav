import {
  Autocomplete,
  autocompleteClasses,
  MenuItem,
  TextField,
} from '@mui/material';
import { addressFormTestIds } from '@test/constants/testIds';
import { countries } from 'country-data';
import { getCodeList } from 'country-list';
import React, { useEffect } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { MdManageSearch } from 'react-icons/md';

import Dialog from '@/components/Dialog';
import TextFieldWithController from '@/components/TextFieldWithController';
import { postCodeAccessibleCountries } from '@/containers/organisations/constants';
import { AddressTypeWithIndex } from '@/containers/organisations/editOrganisation/types';
import { CreatePersonFormProps } from '@/containers/persons/editPersons/types';
import { useTranslations } from '@/hooks/translation';
import { useFetchPostCodeAddress } from '@/hooks/useFetchPostCodeAddress';
import { NewPerson } from '@/types/api';
import { CountryNameList } from '@/types/common';
import { checkPostalCode, isAlphaNumericCharacters } from '@/utils/common';
import { showErrorToast } from '@/utils/toast';

const AddAddressDialog = ({
  onClose,
  formMethods,
  addressToEdit,
  isAddAddressOpen,
}: {
  onClose: () => void;
  isAddAddressOpen: boolean;
  addressToEdit?: AddressTypeWithIndex | null;
  formMethods: UseFormReturn<NewPerson & CreatePersonFormProps>;
}) => {
  const t = useTranslations();
  const {
    loading,
    options,
    onInputChange,
    selectedOption,
    setSelectedOption,
    setSelectedCountry,
    finalSelectedOption,
    setFinalSelectedOption,
  } = useFetchPostCodeAddress();

  const {
    register,
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    resetField,
  } = formMethods;

  const addresses = watch('addresses');
  const newAddressValue = watch('newAddress');

  const { append: appendAddress, update } = useFieldArray({
    control,
    name: 'addresses',
  });

  const countryList = getCodeList();

  useEffect(() => {
    if (addressToEdit) {
      const { city, street, isPrimary, postalCode, houseNumber, countryCode } =
        addressToEdit;
      setValue('newAddress', {
        city,
        street,
        isPrimary,
        postalCode,
        houseNumber,
        countryCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressToEdit]);

  useEffect(() => {
    const addressVal = finalSelectedOption?.address;
    if (addressVal) {
      setValue('newAddress', {
        isPrimary: false,
        city: addressVal?.locality,
        street: addressVal?.street,
        postalCode: addressVal?.postcode,
        houseNumber: addressVal?.building,
        countryCode: newAddressValue?.countryCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  useEffect(
    () => () => {
      setSelectedOption(null);
      setFinalSelectedOption(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (newAddressValue?.countryCode)
      setSelectedCountry(countries[newAddressValue?.countryCode]?.alpha3);
  }, [newAddressValue?.countryCode, setSelectedCountry]);

  const handlePostalCodeKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    const postalCodeVal = newAddressValue?.postalCode || '';
    if (
      !isAlphaNumericCharacters(event) ||
      (postalCodeVal?.length === 0 && (event.key === ' ' || event.key === '-'))
    ) {
      event.preventDefault();
    }
  };

  const handleSubmit = () => {
    clearErrors('newAddress');

    const { street, postalCode, countryCode, houseNumber, city } =
      newAddressValue || {};

    const isMandatoryFieldsAvailable =
      street && postalCode && countryCode && houseNumber;

    if (isMandatoryFieldsAvailable && checkPostalCode(postalCode)) {
      const filteredAddresses = addresses?.filter(
        (_, idx) => idx !== addressToEdit?.index
      );
      const isDuplicate = filteredAddresses?.some(
        (item) =>
          item.city === city &&
          item.countryCode === countryCode &&
          item.houseNumber === houseNumber &&
          item.postalCode === postalCode &&
          item.street === street
      );
      if (isDuplicate) {
        showErrorToast(t('personDetails.duplicateAddress'));
        return;
      }
      if (addressToEdit) {
        const { index, isPrimary } = addressToEdit;
        const formattedAddress = { ...newAddressValue, isPrimary };
        update(index, formattedAddress);
      } else
        appendAddress({
          ...newAddressValue,
          isPrimary: !addresses?.length,
        });
      setValue('newAddress', {
        city: '',
        street: '',
        postalCode: '',
        houseNumber: '',
        countryCode: '',
        isPrimary: false,
      });
      setSelectedOption(null);
      setFinalSelectedOption(undefined);
      onClose();
    } else {
      // Form validation mentioned in zod will only validate while main form
      // submission but have to validate before the modal get closed
      if (!street)
        setError('newAddress.street', {
          message: t('validationMessage.required'),
        });
      if (!postalCode)
        setError('newAddress.postalCode', {
          message: t('validationMessage.required'),
        });
      else if (!checkPostalCode(postalCode))
        setError('newAddress.postalCode', {
          message: t('validationMessage.invalidPostCode'),
        });
      if (!countryCode)
        setError('newAddress.countryCode', {
          message: t('validationMessage.required'),
        });
      if (!houseNumber)
        setError('newAddress.houseNumber', {
          message: t('validationMessage.required'),
        });
    }
  };

  return (
    <Dialog
      onSubmit={handleSubmit}
      headerElement={t(
        addressToEdit ? 'common.editAddress' : 'common.addAddress'
      )}
      submitText={t(addressToEdit ? 'common.save' : 'common.add')}
      isOpen={isAddAddressOpen}
      onClose={() => {
        setSelectedOption(null);
        resetField('newAddress');
        setFinalSelectedOption(undefined);
        onClose();
      }}
    >
      <div className='flex flex-col items-start justify-start'>
        <TextFieldWithController
          testId={addressFormTestIds.country}
          select
          id='country'
          key='country'
          defaultValue=''
          variant='filled'
          control={control}
          label={t('common.country')}
          className='!m-2 !mt-4 w-[98%]'
          data-testid='address-country-code'
          {...register('newAddress.countryCode')}
          required
        >
          {Object.keys(countryList || {}).map((key: string) => (
            <MenuItem key={key} value={key.toUpperCase()}>
              {t(
                `countries.${
                  countryList[key]
                    .replace(/[-,.()/*\\']/g, '')
                    .replace(/\s/g, '') as CountryNameList
                }`
              )}
            </MenuItem>
          ))}
        </TextFieldWithController>
        {newAddressValue?.countryCode &&
          postCodeAccessibleCountries.includes(
            newAddressValue?.countryCode.toUpperCase()
          ) && (
            <div className='!m-2 !mt-4 w-[98%]'>
              <Autocomplete
                options={options}
                loading={loading}
                className='w-full'
                onInputChange={onInputChange}
                loadingText={`${t('common.loading')}...`}
                getOptionLabel={(option) =>
                  option?.value
                    ? `${option?.value} ${
                        !selectedOption ? option?.description : ''
                      }`
                    : ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('common.addressPlaceholder')}
                  />
                )}
                popupIcon={<MdManageSearch size={24} />}
                sx={{
                  [`& .${autocompleteClasses.popupIndicator}`]: {
                    transform: 'none',
                  },
                }}
                onChange={(_, value) => {
                  setSelectedOption(value);
                }}
                value={selectedOption}
                filterOptions={(value) => value}
              />
            </div>
          )}
        <div className='ml-2 mt-4 flex justify-between gap-2'>
          <TextFieldWithController
            testId={addressFormTestIds.postalCode}
            defaultValue=''
            id='postal-code'
            variant='filled'
            key='postal-code'
            control={control}
            className='mr-4 w-[49%]'
            label={t('common.postalCode')}
            inputProps={{ maxLength: 10 }}
            data-testid='address-postal-code'
            onKeyDown={handlePostalCodeKeyDown}
            {...register('newAddress.postalCode')}
            required
          />
          <TextFieldWithController
            testId={addressFormTestIds.houseNumber}
            defaultValue=''
            id='houseNumber'
            variant='filled'
            key='houseNumber'
            control={control}
            className=' w-[49%]'
            label={t('common.houseNumber')}
            data-testid='address-house-number'
            {...register('newAddress.houseNumber')}
            required
          />
        </div>
        <TextFieldWithController
          testId={addressFormTestIds.street}
          id='street'
          key='street'
          defaultValue=''
          variant='filled'
          control={control}
          label={t('common.street')}
          className='m-2 mt-4 w-[98%]'
          data-testid='address-street'
          {...register('newAddress.street')}
          required
        />
        <TextFieldWithController
          testId={addressFormTestIds.city}
          id='city'
          key='city'
          defaultValue=''
          variant='filled'
          control={control}
          className='m-2 w-[98%]'
          label={t('common.city')}
          data-testid='address-city'
          {...register('newAddress.city')}
        />
      </div>
    </Dialog>
  );
};

export default AddAddressDialog;
