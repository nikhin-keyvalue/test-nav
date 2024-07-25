import { useTranslations } from '@/hooks/translation';

const DynamicSearchCriteriaFallback = () => {
  const t = useTranslations('searchCriteria');
  return <p className='mx-4 text-white'>{t('listErrorMessage')}</p>;
};

export default DynamicSearchCriteriaFallback;
