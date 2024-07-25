import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, SyntheticEvent, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { RiErrorWarningLine } from 'react-icons/ri';

import AddAddressDialog from '@/components/AddAddressForm';
import { AddressTypeWithIndex } from '@/containers/organisations/editOrganisation/types';
import CreateEditPersonForm from '@/containers/persons/components/PersonForm';
import {
  AddPersonValidationSchema,
  apiErrors,
  GENDERS,
  POLITEFORM,
} from '@/containers/persons/constants';
import { CreatePersonFormProps } from '@/containers/persons/editPersons/types';
import { useTranslations } from '@/hooks/translation';
import { NewPerson } from '@/types/api';
import { createPerson } from '@/utils/actions/formActions';
import { getErrorMessage } from '@/utils/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { QuickQuotationStateNames } from '../../constants';
import { CreatePersonQQProps, QuickQuotationFormSchema } from '../../types';

const CreatePersonQQ: FC<CreatePersonQQProps> = ({ onCancel, onSuccess }) => {
  const rootFormMethods = useFormContext<QuickQuotationFormSchema>();
  const { watch: parentWatch, setValue: parentSetValue } = rootFormMethods;
  const quotationPersonTypeWatch = parentWatch(
    QuickQuotationStateNames.personType
  );
  const organisationDetailsWatch = parentWatch(
    QuickQuotationStateNames.organisationDetails
  );
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');
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
      type: quotationPersonTypeWatch,
      organisation: organisationDetailsWatch,
    },
    resolver: zodResolver(AddPersonValidationSchema(validationTranslation)),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

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
    // TODO: Include middle name if necessary
    delete payload.middleName;
    parentSetValue('isLoading.isLoadingPerson', true);
    const res = await createPerson(payload);

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      onSuccess({ personId: res.id });
    } else if (res?.error?.errorCode === apiErrors.duplicateObject) {
      setIsDuplicatePerson(true);
    } else showErrorToast(t(getErrorMessage('')));
    parentSetValue('isLoading.isLoadingPerson', false);
  };

  const onCancelPersonCreation = () => {
    onCancel();
  };

  return (
    <FormProvider {...formMethods}>
      {isDuplicatePerson && (
        <div className='m-2 ml-0 flex items-center'>
          <div className='h-full items-center pr-1'>
            <RiErrorWarningLine style={{ color: 'red' }} />
          </div>
          <Typography variant='textMedium' className='text-primary'>
            {t(getErrorMessage(apiErrors.duplicateObject))}
          </Typography>
        </div>
      )}
      <form onSubmit={handleSubmit(onCreatePerson)}>
        <CreateEditPersonForm
          isFromQQ
          isEditPage={false}
          isPending={isSubmitting}
          formMethods={formMethods}
          // TODO link correct organisation
          organisations={undefined}
          onAddAddressClick={() => setOpenAddAddress(true)}
          getEditAddress={(address: AddressTypeWithIndex) => {
            setOpenAddAddress(true);
            setAddressToEdit(address);
          }}
          externalHandlers={{
            onSubmit: (e: SyntheticEvent) => {
              e.stopPropagation();
              e.preventDefault();
              handleSubmit(onCreatePerson)();
            },
            onCancel: (e: SyntheticEvent) => {
              e.stopPropagation();
              e.preventDefault();
              onCancelPersonCreation();
            },
          }}
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

export default CreatePersonQQ;
