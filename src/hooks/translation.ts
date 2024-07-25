import { useTranslations } from 'next-intl';

// Used for getting translations with dynamic keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDynamicTranslations = useTranslations as any;

export { useTranslations, useDynamicTranslations };
