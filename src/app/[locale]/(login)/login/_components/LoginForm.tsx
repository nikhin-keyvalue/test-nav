'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useDynamicTranslations, useTranslations } from '@/hooks/translation';
import { signInAction } from '@/utils/actions/formActions';
import { showErrorToast } from '@/utils/toast';

import PasswordField from './PasswordField';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loginSchema = (t: (arg: any) => string) =>
  z.object({
    email: z.string().min(1, t('required')),
    password: z.string().min(1, t('required')),
  });

type Login = {
  email: string;
  password: string;
};

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const t = useTranslations('validationMessage');
  const methods = useForm<Login>({
    resolver: zodResolver(loginSchema(t)),
  });
  const tCommon = useTranslations('common');
  const tErrors = useDynamicTranslations('errors');
  const tEvents = useTranslations('events');
  const router = useRouter();

  const onSignIn = async (args: Login) => {
    const res = await signInAction(args);
    if (res) {
      if (res?.id_token)
        // default navigation to => '/organisations'
        router.replace(redirect != null ? redirect : '/organisations');
      else if (res?.status === 401)
        showErrorToast('Please enter valid username and password');
    } else {
      showErrorToast(tCommon('somethingWentWrong'));
    }
  };

  return (
    <form
      onSubmit={methods.handleSubmit(onSignIn)}
      className='flex flex-col gap-y-4'
    >
      <TextField
        {...methods.register('email')}
        inputProps={{
          autoComplete: 'new-password',
          'data-testid': 'email',
        }}
        label={tEvents('email')}
        error={!!methods.formState.errors.email}
        helperText={
          !!methods.formState.errors.email &&
          tErrors(methods.formState.errors.email?.message)
        }
        fullWidth
      />
      <PasswordField
        {...methods.register('password')}
        error={!!methods.formState.errors.password}
        helperText={
          !!methods.formState.errors.password &&
          tErrors(methods.formState.errors.password.message)
        }
      />
      <Button
        disabled={methods.formState.isSubmitting}
        type='submit'
        variant='contained'
        size='large'
        sx={{
          width: '103px',
          height: '48px',
          textTransform: 'none',
          fontWeight: 600,
        }}
        data-testid='signInButton'
        className='mt-4'
      >
        Sign in
      </Button>
    </form>
  );
};

export default LoginForm;
