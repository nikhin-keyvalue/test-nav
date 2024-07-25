import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

const PasswordField = React.forwardRef<
  React.ElementRef<typeof TextField>,
  React.ComponentPropsWithoutRef<typeof TextField>
>(({ ...props }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const t = useTranslations();

  return (
    <TextField
      ref={ref}
      {...props}
      type={isPasswordVisible ? 'text' : 'password'}
      inputProps={{
        autoComplete: 'current-password',
        'data-testid': 'password',
      }}
      className='pr-2'
      InputProps={{
        endAdornment: (
          <button
            type='button'
            tabIndex={0}
            className='cursor-pointer border-none bg-transparent'
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsPasswordVisible(!isPasswordVisible);
              }
            }}
          >
            {!isPasswordVisible ? (
              <MdOutlineVisibility className='block text-secondary' size={20} />
            ) : (
              <MdOutlineVisibilityOff
                className='block text-secondary'
                size={20}
              />
            )}
          </button>
        ),
      }}
      label={t('userMenu.password')}
      fullWidth
    />
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
