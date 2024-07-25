import { Typography } from '@AM-i-B-V/ui-kit';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { SyntheticEvent } from 'react';
import { FieldError, useFieldArray } from 'react-hook-form';
import { IoAdd } from 'react-icons/io5';
import { RiErrorWarningLine } from 'react-icons/ri';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { twMerge } from 'tailwind-merge';

import {
  AutocompleteWithController,
  DatePickerWithController,
} from '@/components';
import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import PhoneNumberInput from '@/components/phone-number-input/PhoneNumberInput';
import SubmitLine from '@/components/SubmitLine';
import TextFieldWithController from '@/components/TextFieldWithController';
import { isValidEmailAddress } from '@/constants/common';
import { useTranslations } from '@/hooks/translation';
import { PersonTypeStrict } from '@/types/api';
import { GenderTypes, PersonTypeEnum, PoliteFormTypes } from '@/types/common';
import { getAddressToDisplay, getErrorMessage } from '@/utils/common';
import { getDateinDayjs } from '@/utils/date';
import { hasDuplicates } from '@/utils/validations';

import { personFormTestIds } from '../../../../tests/e2e/constants/testIds';
import { apiErrors, genders, personTypes, politeForms } from '../constants';
import { CreateEditPersonFormProps } from '../types';

export type ExternalHandlersType = {
  onSubmit: (e: SyntheticEvent) => void;
  onCancel: (e: SyntheticEvent) => void;
};

const CreateEditPersonForm = (props: CreateEditPersonFormProps) => {
  const t = useTranslations();
  const {
    isPending,
    isEditPage,
    isFromQQ = false,
    formMethods,
    organisations,
    externalHandlers,
    isDuplicatePerson = false,
    getEditAddress,
    onAddAddressClick,
  } = props;

  const {
    watch,
    control,
    register,
    setValue,
    setError,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting },
  } = formMethods;

  const type = watch('type');
  const emails = watch('emails');
  const addresses = watch('addresses');
  const newEmailValue = watch('newEmail');
  const phoneNumbers = watch('phoneNumbers');
  const newPhoneNumberValue = watch('newPhoneNumber');

  const organisationSelectables = organisations?.map((org) => ({
    id: org?.id,
    name: org?.name,
  }));

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

  return (
    <div
      className={twMerge(
        `flex-column !m-4 h-full overflow-hidden`,
        isFromQQ && '!m-0'
      )}
    >
      <Grid
        ml={0}
        {...(isFromQQ ? {} : { px: 4, columnSpacing: 1 })}
        container
        width='100%'
        display='flex'
        justifyContent='space-between'
      >
        <Grid item sm={5.5}>
          <Grid container rowSpacing={4}>
            <Grid item container display='flex' columnSpacing={2}>
              {isDuplicatePerson && (
                <div className='m-1 ml-4 flex items-center'>
                  <div className='h-full items-center pr-1'>
                    <RiErrorWarningLine style={{ color: 'red' }} />
                  </div>
                  <Typography variant='textMedium' className='text-primary'>
                    {t(getErrorMessage(apiErrors.duplicateObject))}
                  </Typography>
                </div>
              )}
              <Grid item sm={6}>
                <TextFieldWithController
                  fullWidth
                  id='initials'
                  testId={personFormTestIds.initials}
                  control={control}
                  {...register('initials')}
                  label={t('common.initials')}
                />
              </Grid>
              <Grid item sm={6}>
                <TextFieldWithController
                  fullWidth
                  id='firstName'
                  testId={personFormTestIds.firstName}
                  control={control}
                  {...register('firstName')}
                  label={t('common.firstName')}
                />
              </Grid>
            </Grid>
            <Grid item container display='flex' columnSpacing={2}>
              <Grid item sm={6}>
                {/* TODO: ADD error and register value  */}
                <TextFieldWithController
                  testId={personFormTestIds.middleName}
                  fullWidth
                  id='middleName'
                  name='middleName'
                  control={control}
                  label={t('common.middleName')}
                />
              </Grid>
              <Grid item sm={6}>
                <TextFieldWithController
                  testId={personFormTestIds.lastName}
                  fullWidth
                  id='lastName'
                  name='lastName'
                  control={control}
                  label={t('common.lastName')}
                  required
                />
              </Grid>
            </Grid>
            <Grid item container display='flex' columnSpacing={2}>
              <Grid item sm={6}>
                <TextFieldWithController
                  testId={personFormTestIds.gender}
                  select
                  id='gender'
                  name='gender'
                  variant='filled'
                  control={control}
                  label={t('common.gender')}
                  defaultValue={getValues('gender')}
                >
                  {Object.keys(genders).map((option) => (
                    <MenuItem
                      key={genders[option as GenderTypes]}
                      value={genders[option as GenderTypes]}
                    >
                      {t(`gender.${option as GenderTypes}`)}
                    </MenuItem>
                  ))}
                </TextFieldWithController>
              </Grid>
              <Grid item sm={6}>
                <DatePickerWithController
                  disableFuture
                  control={control}
                  format='DD/MM/YYYY'
                  name='newDateOfBirth'
                  sx={{ width: '100%' }}
                  label={t('common.dateOfBirth')}
                  defaultValue={getDateinDayjs(getValues('dateOfBirth'))}
                />
              </Grid>
            </Grid>
            <Grid item container display='flex' columnSpacing={2}>
              <Grid item sm={6}>
                <TextFieldWithController
                  testId={personFormTestIds.driversLicenseNumber}
                  fullWidth
                  control={control}
                  id='driversLicenseNumber'
                  {...register('driversLicenseNumber')}
                  label={t('common.driversLicenseNumber')}
                />
              </Grid>
              <Grid item sm={6}>
                <DatePickerWithController
                  control={control}
                  format='DD/MM/YYYY'
                  sx={{ width: '100%' }}
                  name='newDriversLicenseExpiry'
                  label={t('common.driverLicenseExpiry')}
                  defaultValue={getDateinDayjs(
                    getValues('driversLicenseExpiry')
                  )}
                />
              </Grid>
            </Grid>
            <Grid item container display='flex' columnSpacing={2}>
              <Grid item sm={6}>
                <TextFieldWithController
                  testId={personFormTestIds.type}
                  select
                  id='type'
                  variant='filled'
                  control={control}
                  {...register('type')}
                  label={t('filters.type')}
                  defaultValue={getValues('type')}
                  disabled={isEditPage || isFromQQ}
                  required
                >
                  {personTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {t(`filters.${option as PersonTypeStrict}`)}
                    </MenuItem>
                  ))}
                </TextFieldWithController>
              </Grid>
              <Grid item sm={6}>
                {type === PersonTypeEnum.Business && (
                  <AutocompleteWithController
                    testId={personFormTestIds.organisation}
                    control={control}
                    disabled={isFromQQ}
                    name='organisation'
                    options={organisationSelectables || []}
                    label={t('common.businessOrganisation')}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    getOptionLabel={(option) => option?.name || ''}
                    required
                  />
                )}
              </Grid>
            </Grid>
            <Grid item container display='flex' columnSpacing={2}>
              <Grid item sm={6}>
                <TextFieldWithController
                  select
                  id='politeForm'
                  variant='filled'
                  control={control}
                  testId={personFormTestIds.politeForm}
                  {...register('politeForm')}
                  label={t('common.tutoyeren')}
                  defaultValue={getValues('politeForm')}
                >
                  {politeForms.map((option) => (
                    <MenuItem key={option} value={option}>
                      {t(`politeForm.${option as PoliteFormTypes}`)}
                    </MenuItem>
                  ))}
                </TextFieldWithController>
              </Grid>
            </Grid>
            {isEditPage && (
              <FormControlLabel
                control={
                  <Checkbox
                    data-testid='status-checkbox'
                    defaultChecked={getValues('isActive')}
                    className='ml-[9px] !text-secondary'
                  />
                }
                {...register('isActive')}
                label={t('common.personIsActive')}
              />
            )}
          </Grid>
        </Grid>
        <Grid item sm={5.5}>
          <div>
            <div className='mb-4 text-[22px] font-semibold'>
              {t('common.address')}
            </div>
            <Button
              sx={{ mb: 2, textTransform: 'none' }}
              variant='outlined'
              color='secondary'
              onClick={onAddAddressClick}
              disabled={addresses && addresses?.length > 4}
              className={`${
                addresses && addresses?.length > 4
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              } flex gap-1`}
            >
              <IoAdd src='/add.svg' className='text-[23px]' alt='add' />
              <Typography variant='titleSmallBold'>
                {t('common.addAddress')}
              </Typography>
            </Button>
            <div className='address-list'>
              <List>
                {addresses?.map(
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
                              className={` flex justify-between	 ${
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
            <div className='!my-2 text-[22px] font-semibold'>
              {t('common.phone')}
            </div>
            <div className='mb-4'>
              <PhoneNumberInput
                control={control}
                {...register('newPhoneNumber')}
                placeHolder={t('common.addPhoneNumber')}
                isDisabled={phoneNumbers && phoneNumbers?.length > 4}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    if (newPhoneNumberValue) onAddPhoneNumber();
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
                    className='flex flex-col'
                    alignItems='flex-start'
                    sx={{ p: 0 }}
                    key={field.number}
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
                            {field.number}{' '}
                            {field?.isPrimary ? `(${t('common.primary')})` : ''}
                          </div>
                          <div>
                            <EllipsisMenu
                              index={index}
                              menuItems={phoneNumbersMenu}
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
            <div className='!my-2 text-[22px] font-semibold'>
              {t('common.email')}
            </div>
            <TextFieldWithController
              fullWidth
              sx={{ mb: 2 }}
              testId={personFormTestIds.newEmail}
              control={control}
              {...register('newEmail')}
              disabled={emails?.length > 4}
              helperText={errors.emails?.message}
              label={t('common.addE-mailAddress')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newEmailValue) onAddEmail();
                }
              }}
              customError={errors.emails as FieldError}
              onBlur={(e) => {
                if (e.currentTarget.value) onAddEmail();
              }}
              id='newEmail'
              data-testid='new-email-input'
              required={!emails?.length}
            />
            <div className='emailList'>
              <List>
                {emails?.map((field, index) => (
                  <ListItem
                    sx={{ p: 0 }}
                    alignItems='flex-start'
                    className='flex flex-col'
                    key={field.email}
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
                            {field?.isPrimary ? `(${t('common.primary')})` : ''}
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
      <SubmitLine
        testId={personFormTestIds.submitBtnBottom}
        className={`mt-4 ${isFromQQ ? 'pl-0' : ''}`}
        disableButtons={isSubmitting || isPending}
        {...externalHandlers}
      />
    </div>
  );
};

export default CreateEditPersonForm;
