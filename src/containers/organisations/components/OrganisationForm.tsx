/* eslint-disable no-underscore-dangle */

'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Divider, Grid, MenuItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FieldError, useFieldArray } from 'react-hook-form';
import { IoAdd } from 'react-icons/io5';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';

import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import PhoneNumberInput from '@/components/phone-number-input/PhoneNumberInput';
import SubmitLine from '@/components/SubmitLine';
import TextFieldWithController from '@/components/TextFieldWithController';
import { isValidEmailAddress } from '@/constants/common';
import { ORGANISATION_TYPES, organisationTypesList } from '@/constants/filter';
import { useTranslations } from '@/hooks/translation';
import { getAddressToDisplay, getTraceId } from '@/utils/common';
import { hasDuplicates } from '@/utils/validations';

import { organisationFormTestIds } from '../../../../tests/e2e/constants/testIds';
import { getOrganisationDetailsByKVKNum } from '../api/api';
import { KvkDetailsType } from '../api/type';
import { CreateEditOrganisationFormProps } from '../editOrganisation/types';

const OrganisationForm = (props: CreateEditOrganisationFormProps) => {
  const {
    isPending,
    isEditPage,
    formMethods,
    externalHandlers,
    getEditAddress,
    onAddAddressClick,
    isFromQQ = false,
  } = props;

  const {
    watch,
    control,
    register,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = formMethods;
  const t = useTranslations();

  const {
    fields: phoneNumberFields,
    append: appendPhoneNumber,
    remove: removePhoneNumber,
  } = useFieldArray({
    control,
    name: 'phoneNumbers',
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'emails',
  });

  const { remove: removeAddress } = useFieldArray({
    control,
    name: 'addresses',
  });

  const emails = watch('emails');
  const addresses = watch('addresses');
  const newEmailValue = watch('newEmail');
  const kvkWatchValue = watch('KvKNumber');
  const phoneNumbers = watch('phoneNumbers');
  const newPhoneNumberValue = watch('newPhoneNumber');

  const makePrimary = (
    index: number,
    field: 'phoneNumbers' | 'emails' | 'addresses'
  ) => {
    let fields: { isPrimary: boolean }[] = phoneNumberFields;
    if (field === 'emails') {
      fields = emailFields;
    } else if (field === 'addresses') {
      fields = addresses!;
    }
    setValue(`${field}.${index}.isPrimary`, true);

    fields.forEach((_, i) => {
      if (i !== index) {
        setValue(`${field}.${i}.isPrimary`, false);
      }
    });
  };

  const phoneNumbersMenu: Item[] = [
    {
      id: 'primary',
      name: t('common.setPrimary'),
      onClick: (index) => makePrimary(index! as number, 'phoneNumbers'),
      disabled: (index) => !!phoneNumbers?.[index].isPrimary,
    },
    {
      id: 'delete',
      name: t('common.deletePhoneNumber'),
      onClick: (index) => removePhoneNumber(index! as number),
      disabled: (index) =>
        !!phoneNumbers?.[index].isPrimary && phoneNumbers?.length > 1,
    },
  ];
  const emailsMenu: Item[] = [
    {
      id: 'primary',
      name: t('common.setPrimary'),
      onClick: (index) => makePrimary(index! as number, 'emails'),
      disabled: (index) => emails[index].isPrimary,
    },
    {
      id: 'delete',
      name: t('common.deleteEmail'),
      onClick: (index) => removeEmail(index! as number),
      disabled: (index) => emails[index].isPrimary && emails?.length > 1,
    },
  ];
  const addressMenu: Item[] = [
    {
      id: 'primary',
      name: t('common.setPrimary'),
      onClick: (index) => makePrimary(index! as number, 'addresses'),
      disabled: (index) => !!addresses?.[index].isPrimary,
    },
    {
      id: 'edit',
      name: t('common.editAddress'),
      onClick: (index) => {
        if (addresses) {
          const addressParam = {
            ...addresses[index! as number],
            index: index! as number,
          };
          onAddAddressClick();
          getEditAddress(addressParam);
        }
      },
    },
    {
      id: 'delete',
      name: t('common.deleteAddress'),
      onClick: (index) => removeAddress(index! as number),
      disabled: (index) =>
        !!addresses?.[index].isPrimary && addresses?.length > 1,
    },
  ];

  const validateEmail = (): boolean => {
    const newEmail = getValues('newEmail') || '';
    if (!isValidEmailAddress(newEmail)) {
      setError('newEmail', { message: t('common.invalidEmailMessage') });
      return false;
    }

    const addedEmails =
      getValues('emails')?.map((emailEntry) => emailEntry.email) || [];
    if (hasDuplicates([...addedEmails, newEmail])) {
      setError('newEmail', { message: t('common.duplicateValueIsNotAllowed') });
      return false;
    }
    return true;
  };

  const onAddEmail = () => {
    if (validateEmail()) {
      clearErrors('newEmail');
      appendEmail({
        email: newEmailValue,
        isPrimary: !emails?.length,
      });
      setValue('newEmail', '');
    }
  };

  const getPhoneCountryCode = (phoneNum: string) =>
    parsePhoneNumber(phoneNum)?.country;

  const onAddPhoneNumber = () => {
    // isValidPhoneNumber and getPhoneCountryCode are package exposed functions - part of react-phone-number-input
    const isValidPhone = isValidPhoneNumber(newPhoneNumberValue as string);

    if (!isValidPhone)
      setError('newPhoneNumber', {
        message: 'Invalid Phone number',
      });
    else if (
      phoneNumbers?.some((phNumber) => phNumber.number === newPhoneNumberValue)
    ) {
      setError('newPhoneNumber', {
        message: t('personDetails.duplicateNumber'),
      });
    } else {
      appendPhoneNumber({
        number: newPhoneNumberValue,
        isPrimary: !phoneNumbers?.length,
        countryCode: getPhoneCountryCode(newPhoneNumberValue as string),
      });
      clearErrors('newPhoneNumber');
      setValue('newPhoneNumber', '');
    }
  };

  const handleKVKDetailsFieldsAutoComplete = (kvkDetails: KvkDetailsType) => {
    clearErrors('KvKNumber');
    setValue('name', kvkDetails?.naam);
    setValue('website', kvkDetails?._embedded?.hoofdvestiging?.websites?.[0]);
    const existingAddressesArray = addresses || [];
    const kVKAddressArray = kvkDetails?._embedded?.hoofdvestiging?.adressen;
    const formattedAddressArray = kVKAddressArray
      ?.filter(
        (item) =>
          item.plaats !== undefined &&
          item.postcode !== undefined &&
          item.straatnaam !== undefined &&
          item.huisnummer !== undefined
      )
      ?.map((item, index) => ({
        countryCode: 'NL',
        city: item?.plaats,
        street: item?.straatnaam,
        postalCode: item?.postcode,
        houseNumber: item?.huisnummer?.toString(),
        isPrimary:
          index === 0 &&
          existingAddressesArray?.every((data) => !data.isPrimary),
      }));

    const newArray = formattedAddressArray.filter((obj) =>
      Object.values(obj).every((val) => val !== undefined)
    );

    const elementsNeedeedFromKVKDetails =
      5 - (existingAddressesArray?.length || 0);
    setValue('addresses', [
      ...existingAddressesArray,
      ...newArray.slice(0, elementsNeedeedFromKVKDetails),
    ]);
  };

  return (
    <div
      className={`flex-column h-full overflow-hidden ${
        isFromQQ ? '!m-0' : '!m-4'
      }`}
    >
      <div className='flex h-[88%] w-full justify-between border-b'>
        <Grid
          {...(isFromQQ ? {} : { px: 4, columnSpacing: 1 })}
          ml={0}
          container
          width='100%'
          display='flex'
          justifyContent='space-between'
        >
          <Grid item sm={5.5}>
            <Grid container rowSpacing={4}>
              <Grid item container display='flex' columnSpacing={2}>
                <Grid item sm={6}>
                  <TextFieldWithController
                    fullWidth
                    control={control}
                    label={t('common.kvkNumber')}
                    testId='organisation-form-kvk-number'
                    {...register('KvKNumber')}
                    onBlur={async () => {
                      if (kvkWatchValue && kvkWatchValue?.length >= 8) {
                        try {
                          const kvkDetails =
                            await getOrganisationDetailsByKVKNum(kvkWatchValue);
                          handleKVKDetailsFieldsAutoComplete(kvkDetails);
                        } catch (error) {
                          // eslint-disable-next-line no-console
                          console.log(
                            'Oops !!! Something went wrong !!! Unfortunately the KVK API call failed !!!',
                            'AWS-XRAY-TRACE-ID=',
                            getTraceId('kvkApiCall')
                          );
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextFieldWithController
                    required
                    fullWidth
                    control={control}
                    {...register('name')}
                    label={t('common.name')}
                    testId='organisation-form-name'
                  />
                </Grid>
              </Grid>
              <Grid item container display='flex' columnSpacing={2}>
                <Grid item sm={6}>
                  <TextFieldWithController
                    fullWidth
                    control={control}
                    {...register('VATNumber')}
                    label={t('common.vatNumber')}
                    testId='organisation-form-vat-number'
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextFieldWithController
                    fullWidth
                    id='website'
                    control={control}
                    {...register('website')}
                    label={t('common.website')}
                    testId='organisation-form-website'
                  />
                </Grid>
              </Grid>
              <Grid item container display='flex' columnSpacing={2}>
                <Grid item sm={6}>
                  <TextFieldWithController
                    select
                    id='type'
                    key='type'
                    variant='filled'
                    control={control}
                    {...register('type')}
                    testId='organisation-form-type'
                    label={t('common.organisationType')}
                    required
                  >
                    {organisationTypesList.map((option) => (
                      <MenuItem key={option} value={option}>
                        {t(`filters.${option as ORGANISATION_TYPES}`)}
                      </MenuItem>
                    ))}
                  </TextFieldWithController>
                </Grid>
              </Grid>
              <Grid item container display='flex' columnSpacing={2}>
                <Grid item sm={6}>
                  {isEditPage && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          defaultChecked={watch('isActive')}
                          className='ml-[9px] !text-secondary'
                        />
                      }
                      {...register('isActive')}
                      label={t('common.organisationIsActive')}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={5.5}>
            <div>
              <div className='mb-4 text-[22px] font-semibold'>
                {t('common.address')}
              </div>
              <Button
                color='secondary'
                variant='outlined'
                id='organisation-form-add-address-button'
                onClick={onAddAddressClick}
                className={`${
                  addresses && addresses?.length > 4
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                } flex gap-1`}
                sx={{ mb: 2, textTransform: 'none' }}
                disabled={addresses && addresses?.length > 4}
              >
                <IoAdd src='/add.svg' className='text-[23px]' alt='add' />
                <Typography variant='titleSmallBold'>
                  {t('common.addAddress')}
                </Typography>
              </Button>
              <div className='address-list'>
                <List>
                  {addresses &&
                    addresses?.map(
                      (addressItem, index) =>
                        addressItem && (
                          <ListItem
                            sx={{ p: 0 }}
                            alignItems='flex-start'
                            className='flex flex-col font-bold'
                            key={`${addressItem.houseNumber}`}
                          >
                            <Divider sx={{ width: '100%', mb: 1 }} />
                            <ListItemText
                              sx={{ pl: 1 }}
                              className='w-full'
                              primary={
                                <div
                                  className={` flex justify-between ${
                                    addressItem.isPrimary ? 'font-bold' : ''
                                  }`}
                                >
                                  <div>
                                    {`${getAddressToDisplay(addressItem)} ${
                                      addressItem.isPrimary
                                        ? `(${t('common.primary')})`
                                        : ''
                                    }`}
                                  </div>
                                  <div>
                                    <EllipsisMenu
                                      index={index}
                                      menuItems={addressMenu}
                                    />
                                  </div>
                                </div>
                              }
                            />
                          </ListItem>
                        )
                    )}
                </List>
              </div>
            </div>
            <Divider sx={{ width: '100%' }} />
            <div className='mt-6'>
              <div className='!m-2 text-[22px] font-semibold'>
                {t('common.phone')}
              </div>
              <div className='mb-4'>
                <PhoneNumberInput
                  control={control}
                  testId='phone-number-input'
                  {...register('newPhoneNumber')}
                  placeHolder={t('common.addPhoneNumber')}
                  isDisabled={phoneNumbers && phoneNumbers?.length > 4}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      const isValidPhone = isValidPhoneNumber(
                        newPhoneNumberValue as string
                      );
                      if (newPhoneNumberValue && isValidPhone)
                        onAddPhoneNumber();
                      if (!isValidPhone)
                        setError('newPhoneNumber', {
                          message: 'Invalid Phone number',
                        });
                      else clearErrors('newPhoneNumber');
                    }
                  }}
                  handleBlur={(event) => {
                    const phoneNumWrapperElement =
                      event.currentTarget?.children[0];
                    // the phone input package component has 2 child elements: a country selector
                    // and an input for phone number, hence phoneNumWrapperElement?.children[1]
                    // to access phone number input value
                    const inputField = phoneNumWrapperElement
                      ?.children[1] as HTMLInputElement;
                    // event.relatedTarget gets the element that the user has currently clicked.
                    // So if the user clicks within the wrapper div, we know that it is still
                    // inside the component even though the click happened outside the input field.
                    if (
                      !phoneNumWrapperElement.contains(event.relatedTarget) &&
                      inputField?.value
                    )
                      onAddPhoneNumber();
                  }}
                />
              </div>

              <div className='phone-list'>
                <List>
                  {phoneNumbers?.map((field, index) => (
                    <ListItem
                      sx={{ p: 0 }}
                      alignItems='flex-start'
                      className='flex flex-col'
                      key={field.number}
                    >
                      <Divider sx={{ width: '100%', mb: 1 }} />
                      <ListItemText
                        className='w-full'
                        sx={{ pl: 1 }}
                        primary={
                          <div
                            className={` flex justify-between	 ${
                              field?.isPrimary ? 'font-bold' : ''
                            }`}
                          >
                            <div>
                              {field.number}{' '}
                              {field?.isPrimary
                                ? `(${t('common.primary')})`
                                : ''}
                            </div>
                            <div>
                              <EllipsisMenu
                                menuItems={phoneNumbersMenu}
                                index={index}
                              />
                            </div>
                          </div>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
            <Divider sx={{ width: '100%' }} />
            <div className='mt-6'>
              <div className='!m-2 text-[22px] font-semibold'>
                {t('common.email')}
              </div>
              <TextFieldWithController
                fullWidth
                sx={{ mb: 2 }}
                control={control}
                {...register('newEmail')}
                disabled={emails?.length > 4}
                testId='organisation-form-email'
                id='organisation-form-email'
                label={t('common.addE-mailAddress')}
                customError={errors.emails as FieldError}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newEmailValue) onAddEmail();
                  }
                }}
                onBlur={(e) => {
                  if (e.currentTarget.value) onAddEmail();
                }}
                required={!emails?.length}
              />
              <div className='emailList'>
                <List>
                  {emails?.map((field, index) => (
                    <ListItem
                      sx={{ p: 0 }}
                      key={field.email}
                      alignItems='flex-start'
                      className='flex flex-col'
                    >
                      <Divider sx={{ width: '100%', mb: 1 }} />
                      <ListItemText
                        sx={{ pl: 1 }}
                        className='w-full'
                        primary={
                          <div
                            className={` flex justify-between	 ${
                              field?.isPrimary ? 'font-bold' : ''
                            }`}
                          >
                            <div>
                              {field.email}{' '}
                              {field?.isPrimary
                                ? `(${t('common.primary')})`
                                : ''}
                            </div>
                            <div>
                              <EllipsisMenu
                                index={index}
                                menuItems={emailsMenu}
                              />
                            </div>
                          </div>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <SubmitLine
        className={isFromQQ ? 'pl-0' : ''}
        disableButtons={isPending || isSubmitting}
        testId={organisationFormTestIds.submitBtnBottom}
        {...externalHandlers}
      />
    </div>
  );
};

export default OrganisationForm;
