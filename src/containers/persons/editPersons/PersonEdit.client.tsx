'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NoData } from '@/components';
import AddAddressDialog from '@/components/AddAddressForm';
import FormPageHeader from '@/components/FormPageHeader';
import { AddressTypeWithIndex } from '@/containers/organisations/editOrganisation/types';
import { NewPerson, Organisations, PersonsDetails } from '@/types/api';
import { PersonTypeEnum } from '@/types/common';
import { editPerson } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import CreateEditPersonForm from '../components/PersonForm';
import { GENDERS, PersonEditValidationSchema, POLITEFORM } from '../constants';
import { CreatePersonFormProps } from './types';

export const getDateinDayjs = (date: string | undefined) => {
  if (date) return dayjs(date);
  return null;
};

const PersonEditClient = ({
  id,
  details,
  organisations,
}: {
  id: string;
  details: PersonsDetails | undefined | null;
  organisations: Organisations;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isAddAddressOpen, setOpenAddAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressTypeWithIndex | null>(null);

  const formMethods = useForm<NewPerson & CreatePersonFormProps>({
    defaultValues: {
      initials: details?.initials,
      firstName: details?.firstName,
      middleName: details?.middleName,
      lastName: details?.lastName,
      gender: details?.gender || GENDERS.MALE,
      dateOfBirth: details?.dateOfBirth,
      driversLicenseNumber: details?.driversLicenseNumber,
      driversLicenseExpiry: details?.driversLicenseExpiry,
      type: details?.type,
      organisation: details?.organisation,
      organisationId: details?.organisation?.id,
      politeForm: details?.politeForm || POLITEFORM.JIJ,
      addresses: details?.addresses,
      phoneNumbers: details?.phoneNumbers,
      emails: details?.emails,
      newDateOfBirth: getDateinDayjs(details?.dateOfBirth),
      newDriversLicenseExpiry: getDateinDayjs(details?.driversLicenseExpiry),
      id: details?.id,
      isActive: details?.isActive,
      newAddress: {
        isPrimary: false,
        countryCode: 'NL',
      },
    },
    resolver: zodResolver(PersonEditValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = formMethods;

  const type = watch('type');

  useEffect(() => {
    if (type !== PersonTypeEnum.Business) setValue('organisation', undefined);
  }, [type]);

  const personEditSubmit = async (data: NewPerson & CreatePersonFormProps) => {
    const newPersonData = {
      ...data,
      dateOfBirth:
        data.newDateOfBirth?.format('YYYY-MM-DD') || data.dateOfBirth,
      driversLicenseExpiry:
        data.newDriversLicenseExpiry?.format('YYYY-MM-DD') ||
        data.driversLicenseExpiry,
      organisationId: data?.organisation?.id || data?.organisationId,
      isActive: data.isActive,
      addresses: data.addresses || [],
      phoneNumbers: data.phoneNumbers,
      emails: data.emails,
    };
    delete newPersonData.newEmail;
    delete newPersonData.newAddress;
    delete newPersonData.organisation;
    delete newPersonData.newPhoneNumber;
    delete newPersonData.newDateOfBirth;
    delete newPersonData.newDriversLicenseExpiry;

    const res = await editPerson(id, newPersonData);

    if (res?.success) {
      showSuccessToast(t('common.savedSuccessfully'));
      startTransition(() => router.replace(`/persons/${res.id}/details`));
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  return (
    <div className='m-3 flex'>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(personEditSubmit)}
          id='personEdit'
          className='w-full'
          noValidate
        >
          <FormPageHeader
            hideButton={!details}
            saveButtonProps={{ disabled: isPending || isSubmitting }}
            testId='edit-person-page'
          >
            <Typography variant='titleLargeBold' className='text-secondary'>
              {t('editPersons.title')}
            </Typography>
          </FormPageHeader>
          {details ? (
            <CreateEditPersonForm
              isEditPage
              isPending={isPending}
              formMethods={formMethods}
              organisations={organisations.data}
              onAddAddressClick={() => setOpenAddAddress(true)}
              getEditAddress={(address: AddressTypeWithIndex) => {
                setOpenAddAddress(true);
                setAddressToEdit(address);
              }}
            />
          ) : (
            <div className='h-[75vh] w-full items-center justify-center'>
              <NoData
                primaryText={t('personDetails.noPersonDataFoundPrimaryText')}
                secondaryText={t(
                  'personDetails.noPersonDataFoundSecondaryText'
                )}
              />
            </div>
          )}
        </form>
      </FormProvider>
      <AddAddressDialog
        formMethods={formMethods}
        addressToEdit={addressToEdit}
        isAddAddressOpen={isAddAddressOpen}
        onClose={() => {
          setOpenAddAddress(false);
          if (addressToEdit) setAddressToEdit(null);
        }}
      />
    </div>
  );
};

export default PersonEditClient;
