import { useFormContext } from 'react-hook-form';

import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { useTranslations } from './translation';

type FormSubmissionProps = {
  handleClose: () => void;
};

const useFormSubmission = ({ handleClose }: FormSubmissionProps) => {
  const rootFormMethods = useFormContext<{
    isLoading: boolean;
    isSuccess: boolean;
  }>();

  const { setValue: setContextFormValue, watch: watchContextFormValue } =
    rootFormMethods;
  const tCommon = useTranslations('common');

  type ApiFunction<U> = (payload: U) => Promise<{ success: boolean }>;

  const handleApiCall = async <T>(
    apiFunction: ApiFunction<T>,
    payload: T,
    onSuccessCallback?: () => void
  ) => {
    setContextFormValue('isLoading', true);

    const res = await apiFunction(payload);

    handleClose();
    setContextFormValue('isLoading', false);
    if (res?.success) {
      showSuccessToast(tCommon('savedSuccessfully'));
      setContextFormValue('isSuccess', true);
      if (onSuccessCallback) onSuccessCallback();
    } else {
      showErrorToast(tCommon('somethingWentWrong'));
      setContextFormValue('isSuccess', false);
    }
  };

  return {
    handleApiCall,
    isSuccess: watchContextFormValue('isSuccess'),
    isLoading: watchContextFormValue('isLoading'),
  };
};

export default useFormSubmission;
