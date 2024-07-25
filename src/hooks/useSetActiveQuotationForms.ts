import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { tenantGroupIdMap } from '@/containers/quotations/constants';

import { CreateQuotationFormSchema } from '../containers/quotations/api/type';

export const useSetActiveQuotationForms = ({
  isDirty = false,
  tenantGroupId = 0,
}: {
  isDirty: boolean;
  tenantGroupId: number | string;
}): { handleChildFormSubmit: () => void } => {
  const { setValue: setParentValues } =
    useFormContext<CreateQuotationFormSchema>();
  const tenantGroup = tenantGroupIdMap[Number(tenantGroupId)];

  useEffect(() => {
    setParentValues(`activeForms.${tenantGroup}`, isDirty);
  }, [isDirty]);

  const handleChildFormSubmit = () => {
    setParentValues(`activeForms.${tenantGroup}`, false);
  };

  return { handleChildFormSubmit };
};
