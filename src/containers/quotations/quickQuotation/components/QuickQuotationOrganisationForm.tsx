import { Typography } from '@AM-i-B-V/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { SyntheticEvent, useState } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';

import AddAddressDialog from '@/components/AddAddressForm';
import OrganisationForm from '@/containers/organisations/components/OrganisationForm';
import { NewOrganisationValidationSchema } from '@/containers/organisations/constants';
import { AddressTypeWithIndex } from '@/containers/organisations/editOrganisation/types';
import { FormProps } from '@/containers/organisations/types';
import { CreatePersonFormProps } from '@/containers/persons/editPersons/types';
import { useTranslations } from '@/hooks/translation';
import { NewOrganisation, NewPerson } from '@/types/api';
import { createOrganisation } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { QuickQuotationStateNames } from '../../constants';
import { QuickQuotationFormSchema } from '../../types';

const QuickQuotationOrganisationForm = ({
  closeOrganisationForm,
}: {
  closeOrganisationForm: (value: boolean) => void;
}) => {
  const t = useTranslations();
  const validationTranslation = useTranslations('validationMessage');

  const formMethods = useForm<NewOrganisation & FormProps>({
    resolver: zodResolver(
      NewOrganisationValidationSchema(validationTranslation)
    ),
  });

  const quickQuotationFormMethods = useFormContext<QuickQuotationFormSchema>();
  const [isAddAddressOpen, setOpenAddAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressTypeWithIndex | null>(null);

  const { watch, handleSubmit } = formMethods;

  const { setValue: setQuickQuotationValue } = quickQuotationFormMethods;

  const addOrganisationDetails = async () => {
    const organisationData = watch();

    setQuickQuotationValue('isLoading.isLoadingOrganisation', true);
    const res = await createOrganisation({
      ...organisationData,
      isActive: true,
    });

    if (res?.id) {
      showSuccessToast(t('common.savedSuccessfully'));
      setQuickQuotationValue(QuickQuotationStateNames.organisationId, res?.id);
      closeOrganisationForm(false);
    } else showErrorToast(t('common.somethingWentWrong'));
    setQuickQuotationValue('isLoading.isLoadingOrganisation', false);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className='mt-8'
        onSubmit={() => handleSubmit(addOrganisationDetails)}
      >
        <Typography variant='titleMediumBold' className='mb-4'>
          {t('quotations.quickQuotation.enterOrganisationDetailHeader')}
        </Typography>
        <OrganisationForm
          isFromQQ
          formMethods={formMethods}
          isPending={false}
          isEditPage={false}
          onAddAddressClick={() => setOpenAddAddress(true)}
          getEditAddress={() => {}}
          externalHandlers={{
            onSubmit: (e: SyntheticEvent) => {
              e.stopPropagation();
              e.preventDefault();
              handleSubmit(addOrganisationDetails)();
            },
            onCancel: (e: SyntheticEvent) => {
              e.stopPropagation();
              e.preventDefault();
              closeOrganisationForm(false);
            },
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

export default QuickQuotationOrganisationForm;
