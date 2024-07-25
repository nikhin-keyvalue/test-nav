import { TextField, TextFieldProps } from '@mui/material';
import { ReactNode } from 'react';

// import { useTranslations } from '@/hooks/translation';

const WithBulkFallbackTextField = ({
  children,
  isBulk,
  fallbackLabel = '',
  fallbackProps = {},
}: {
  children: ReactNode;
  isBulk: boolean;
  fallbackLabel?: string;
  fallbackProps?: TextFieldProps;
}) => {
  // const t = useTranslations('bulkEdit');
  if (isBulk) {
    return (
      <TextField
        {...fallbackProps}
        label={fallbackLabel || fallbackProps.label}
        value='editPerVehicle'
        fullWidth
        disabled
        inputProps={{ className: 'font-semibold' }}
      />
    );
  }
  return children;
};

export default WithBulkFallbackTextField;
