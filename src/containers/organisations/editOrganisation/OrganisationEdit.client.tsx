'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';

import { NoData } from '@/components';
import AddAddressDialog from '@/components/AddAddressForm';
import FormPageHeader from '@/components/FormPageHeader';
import { CreatePersonFormProps } from '@/containers/persons/editPersons/types';
import { useTranslations } from '@/hooks/translation';
import {
  AddressType,
  IOrganisationDetails,
  NewOrganisation,
  NewPerson,
} from '@/types/api';
import { editOrganisation } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import OrganisationForm from '../components/OrganisationForm';
import { EditOrganisationValidationSchema } from '../constants';
import {
  AddressTypeWithIndex,
  OrganisationFormProps,
  OrganisationFormType,
} from './types';

interface FormProps {
  newEmail?: string;
  newPhoneNumber?: string;
  newAddress?: AddressType;
}

const OrganisationEdit = ({
  details,
  id,
}: {
  details: IOrganisationDetails | undefined | null;
  id: string;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAddAddressOpen, setOpenAddAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressTypeWithIndex | null>(null);

  const formMethods = useForm<NewOrganisation & OrganisationFormProps>({
    defaultValues: {
      name: details?.name,
      type: details?.type,
      emails: details?.emails,
      website: details?.website,
      KvKNumber: details?.KvKNumber,
      VATNumber: details?.VATNumber,
      addresses: details?.addresses,
      isActive: !!details?.isActive,
      phoneNumbers: details?.phoneNumbers,
      newAddress: {
        countryCode: 'NL',
        isPrimary: false,
      },
    },
    resolver: zodResolver(
      EditOrganisationValidationSchema(validationTranslation)
    ),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const organisationEditSubmit = async (
    data: OrganisationFormType & FormProps
  ) => {
    const newOrganisationData = {
      ...data,
      emails: data.emails,
      isActive: data.isActive,
      addresses: data.addresses || [],
      phoneNumbers: data.phoneNumbers,
    };
    delete newOrganisationData.newEmail;
    delete newOrganisationData.newAddress;
    delete newOrganisationData.newPhoneNumber;

    const res = await editOrganisation(id, newOrganisationData);
    if (res?.success) {
      showSuccessToast(t('common.savedSuccessfully'));
      startTransition(() => router.replace(`/organisations/${res.id}/details`));
    } else {
      showErrorToast(t('common.somethingWentWrong'));
    }
  };

  return (
    <div>
      <FormProvider {...formMethods}>
        <form
          id='organisationEdit'
          onSubmit={handleSubmit(organisationEditSubmit)}
          noValidate
        >
          <FormPageHeader
            hideButton={!details}
            testId='organisation-edit-page'
            saveButtonProps={{ disabled: isPending || isSubmitting }}
          >
            <Typography variant='titleLargeBold' className='text-secondary'>
              {t('editOrganisations.title')}
            </Typography>
          </FormPageHeader>
          {details ? (
            <OrganisationForm
              isEditPage
              isPending={isPending}
              formMethods={formMethods}
              onAddAddressClick={() => setOpenAddAddress(true)}
              getEditAddress={(address: AddressTypeWithIndex) => {
                setOpenAddAddress(true);
                setAddressToEdit(address);
              }}
            />
          ) : (
            <div className='h-[75vh] w-full items-center justify-center'>
              <NoData
                primaryText={t('common.noOrganisationDataFoundPrimaryText')}
                secondaryText={t('common.noOrganisationDataFoundSecondaryText')}
              />
            </div>
          )}
        </form>
      </FormProvider>
      <AddAddressDialog
        addressToEdit={addressToEdit}
        isAddAddressOpen={isAddAddressOpen}
        onClose={() => {
          setOpenAddAddress(false);
          if (addressToEdit) setAddressToEdit(null);
        }}
        formMethods={
          formMethods as unknown as UseFormReturn<
            NewPerson & CreatePersonFormProps
          >
        }
      />
    </div>
  );
};

export default OrganisationEdit;
