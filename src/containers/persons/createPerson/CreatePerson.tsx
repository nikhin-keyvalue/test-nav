'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MdErrorOutline } from 'react-icons/md';

import AddAddressDialog from '@/components/AddAddressForm';
import FormPageHeader from '@/components/FormPageHeader';
import { AddressTypeWithIndex } from '@/containers/organisations/editOrganisation/types';
import { useTranslations } from '@/hooks/translation';
import { NewPerson } from '@/types/api';
import {
  ErrorMessageType,
  FieldNames,
  InvalidFieldApiErrorResponseType,
  ObjectKeyValueStringType,
  PersonTypeEnum,
} from '@/types/common';
import { createPerson } from '@/utils/actions/formActions';
import { getErrorMessage } from '@/utils/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import CreateEditPersonForm from '../components/PersonForm';
import {
  AddPersonValidationSchema,
  apiErrors,
  GENDERS,
  POLITEFORM,
} from '../constants';
import { CreatePersonFormProps } from '../editPersons/types';
import { CreatePersonProps } from '../types';

const CreatePerson: FC<CreatePersonProps> = ({ organisations }) => {
  const [formError, setFormError] = useState({});

  const router = useRouter();
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
  const [isPending, startTransition] = useTransition();

  const [isAddAddressOpen, setOpenAddAddress] = useState(false);
  const onAddressDialogClose = () => setOpenAddAddress(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressTypeWithIndex | null>(null);
  const [isDuplicatePerson, setIsDuplicatePerson] = useState(false);

  const formMethods = useForm<NewPerson & CreatePersonFormProps>({
    defaultValues: {
      politeForm: POLITEFORM.JIJ,
      gender: GENDERS.MALE,
      newAddress: {
        isPrimary: false,
        countryCode: 'NL',
      },
    },
    resolver: zodResolver(AddPersonValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = formMethods;

  const type = watch('type');

  const onCreatePerson = async (data: NewPerson & CreatePersonFormProps) => {
    const payload = {
      ...data,
      isActive: true,
      dateOfBirth:
        data?.newDateOfBirth?.format('YYYY-MM-DD') || data.dateOfBirth,
      organisationId: data?.organisation?.id,
      driversLicenseExpiry:
        data?.newDriversLicenseExpiry?.format('YYYY-MM-DD') ||
        data.driversLicenseExpiry,
    };

    delete payload.newPhoneNumber;
    delete payload.organisation;
    delete payload.newEmail;
    delete payload.newAddress;
    delete payload.newDateOfBirth;
    delete payload.newDriversLicenseExpiry;

    const res = await createPerson(payload);

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      startTransition(() => router.replace(`/persons/${res.id}/details`));
    } else if (res?.error?.errorCode === apiErrors.duplicateObject) {
      setIsDuplicatePerson(true);
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
        t(getErrorMessage(res?.error?.errorCode as ErrorMessageType))
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

  useEffect(() => {
    if (type !== PersonTypeEnum.Business) setValue('organisation', undefined);
  }, [type]);

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onCreatePerson)} noValidate>
        <FormPageHeader
          saveButtonProps={{ disabled: isPending || isSubmitting }}
          testId='create-person-form-header'
        >
          <div className='flex items-center'>
            <Typography variant='titleLargeBold' className='text-secondary'>
              {t('createPersons.title')}
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
        <CreateEditPersonForm
          isEditPage={false}
          isPending={isPending}
          formMethods={formMethods}
          organisations={organisations}
          onAddAddressClick={() => setOpenAddAddress(true)}
          getEditAddress={(address: AddressTypeWithIndex) => {
            setOpenAddAddress(true);
            setAddressToEdit(address);
          }}
          isDuplicatePerson={isDuplicatePerson}
        />

        <AddAddressDialog
          formMethods={formMethods}
          addressToEdit={addressToEdit}
          isAddAddressOpen={isAddAddressOpen}
          onClose={() => {
            onAddressDialogClose();
            if (addressToEdit) setAddressToEdit(null);
          }}
        />
      </form>
    </FormProvider>
  );
};

export default CreatePerson;
