import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { useTranslations } from '@/hooks/translation';

import { CreateQuotationFormSchema } from '../../api/type';
import { lineGroupItemList, tenantGroupIdMap } from '../../constants';
import { useCreateQuotationContext } from '../../CreateQuotationContextWrapper';
import { LineGroupDefaultNameType } from '../../types';
import TenantGroup from './TenantGroup';

interface TenantGroupsContainerProps {
  formMethods: UseFormReturn<CreateQuotationFormSchema>;
}

const TenantGroupsContainer: FC<TenantGroupsContainerProps> = ({
  formMethods,
}) => {
  const t = useTranslations('quotations');
  const { state } = useCreateQuotationContext();
  const groupNameListFromReducer = state.groupNameList;
  const lineGroupListTranslated = lineGroupItemList.map((lineGroupItemDesc) => {
    const typedGroupFieldName: LineGroupDefaultNameType = `${lineGroupItemDesc.groupFieldName}DefaultName`;
    return {
      ...lineGroupItemDesc,
      groupName: t(typedGroupFieldName),
    };
  });

  return (
    <Grid container flexDirection='column' gap={2}>
      {(groupNameListFromReducer || lineGroupListTranslated).map(
        (item, index) => (
          <TenantGroup
            formMethods={formMethods}
            key={item.id}
            tenantGroupId={item.id}
            groupName={item.groupName}
            groupFormFieldName={item.groupFieldName}
            testGroupName={tenantGroupIdMap[index]}
          />
        )
      )}
    </Grid>
  );
};

export default TenantGroupsContainer;
