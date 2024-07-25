'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';

import AddAddressDialog from '@/components/AddAddressForm';
import FormPageHeader from '@/components/FormPageHeader';
import { apiErrors } from '@/containers/persons/constants';
import { CreatePersonFormProps } from '@/containers/persons/editPersons/types';
import { useTranslations } from '@/hooks/translation';
import { NewOrganisation, NewPerson } from '@/types/api';
import {
  ErrorMessageType,
  FieldNames,
  InvalidFieldApiErrorResponseType,
  ObjectKeyValueStringType,
} from '@/types/common';
import { createOrganisation } from '@/utils/actions/formActions';
import { getErrorMessage } from '@/utils/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import OrganisationForm from '../components/OrganisationForm';
import { NewOrganisationValidationSchema } from '../constants';
import { AddressTypeWithIndex } from '../editOrganisation/types';
import { FormProps } from '../types';

const CreateOrganisation = () => {
  const [formError, setFormError] = useState({});

  const router = useRouter();
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const [isPending, startTransition] = useTransition();

  const [isAddAddressOpen, setOpenAddAddress] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressTypeWithIndex | null>(null);

  const formMethods = useForm<NewOrganisation & FormProps>({
    defaultValues: {
      newAddress: {
        countryCode: 'NL',
        isPrimary: false,
      },
    },
    resolver: zodResolver(
      NewOrganisationValidationSchema(validationTranslation)
    ),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onCreateOrganisation = async (data: NewOrganisation & FormProps) => {
    delete data.newPhoneNumber;
    delete data.newEmail;
    delete data.newAddress;

    const res = await createOrganisation({ ...data, isActive: true });

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      startTransition(() => router.replace(`/organisations/${res.id}/details`));
    } else if (res?.error?.errorCode === apiErrors.inputValidationFailed) {
      showErrorToast(t(getErrorMessage(res.error?.errorCode)));
      const errorsList: ObjectKeyValueStringType = {};
      res?.error?.invalidFields?.forEach(
        (fieldItem: InvalidFieldApiErrorResponseType) => {
          const fieldName = fieldItem.name;
          errorsList[fieldName] = fieldItem.reason;
        }
      );
      setFormError(errorsList);
    } else {
      showErrorToast(
        t(getErrorMessage(res.error?.errorCode as ErrorMessageType))
      );
    }
  };

  const getFormErrorsJSX = () => (
    <div>
      {Object.keys(formError).map((error) => (
        <div key={error} className='text-sm'>
          {t(`apiErrorName.${error as FieldNames}`)}:{' '}
          {formError[error as keyof typeof formError]}
        </div>
      ))}
    </div>
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onCreateOrganisation)} noValidate>
        <FormPageHeader
          saveButtonProps={{ disabled: isPending || isSubmitting }}
        >
          <div className='flex items-center'>
            <Typography variant='titleLargeBold' className='text-secondary'>
              {t('createOrganisation.title')}
            </Typography>
            {formError && Object.keys(formError).length > 0 && (
              <Tooltip title={getFormErrorsJSX()} placement='right' arrow>
                <Box
                  sx={{
                    color: 'primary.contrastText',
                    p: 0,
                  }}
                >
                  <MdErrorOutline className='ml-2 mt-1 size-6 text-primary' />
                </Box>
              </Tooltip>
            )}
          </div>
        </FormPageHeader>
        <OrganisationForm
          isEditPage={false}
          isPending={isPending}
          formMethods={formMethods}
          onAddAddressClick={() => setOpenAddAddress(true)}
          getEditAddress={(address: AddressTypeWithIndex) => {
            setOpenAddAddress(true);
            setAddressToEdit(address);
          }}
        />
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
      </form>
    </FormProvider>
  );
};
export default CreateOrganisation;
