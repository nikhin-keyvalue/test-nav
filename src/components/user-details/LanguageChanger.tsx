'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import React, { useTransition } from 'react';

import { DropdownMenuCheckboxItem } from '@/components/DropdownMenu';
import { changeLanguageAction } from '@/utils/languageActions';

const LanguageChanger = (props: { lang: 'en' | 'nl' }) => {
  const { lang } = props;
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('userMenu.languages');
  const [, startTransition] = useTransition();

  const changeLanguage = (language: string) => {
    if (language !== locale) {
      startTransition(() => {
        changeLanguageAction(language);
        router.refresh();
      });
    }
  };

  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => {
        event.preventDefault();
        changeLanguage(lang);
      }}
      checked={locale === lang}
    >
      {t(lang)}
    </DropdownMenuCheckboxItem>
  );
};

export default LanguageChanger;
