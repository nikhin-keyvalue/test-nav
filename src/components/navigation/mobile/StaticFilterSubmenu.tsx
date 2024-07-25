
import { useTranslations } from '@/hooks/translation';

import MenuBarItem from '../desktop/MenuBarItem';

const StaticFilterSubmenu = ({ onClose }: { onClose?: () => void }) => {
  const t = useTranslations();

  const staticFilters = [
    {
      label: t('navBar.allVehicles'),
      filters: [
        {
          key: 'stockStatusList',
          value: ['IN_STOCK', 'EXPECTED'],
        },
        {
          key: 'sellingStatusList',
          value: ['AVAILABLE_FOR_SALE'],
        },
      ],
    },
    {
      label: t('navBar.expected'),
      filters: [
        {
          key: 'stockStatusList',
          value: ['EXPECTED'],
        },
        {
          key: 'sellingStatusList',
          value: ['AVAILABLE_FOR_SALE'],
        },
      ],
    },
    {
      label: t('navBar.available'),
      filters: [
        {
          key: 'stockStatusList',
          value: ['IN_STOCK'],
        },
        {
          key: 'sellingStatusList',
          value: ['AVAILABLE_FOR_SALE'],
        },
      ],
    },
    {
      label: t('navBar.reserved'),
      filters: [
        {
          key: 'stockStatusList',
          value: ['IN_STOCK', 'EXPECTED'],
        },
        {
          key: 'sellingStatusList',
          value: ['RESERVED_FOR', 'LEND_TO', 'BORROW_FROM'],
        },
      ],
    },
    {
      label: t('navBar.soldOrNotForSale'),
      filters: [
        {
          key: 'sellingStatusList',
          value: ['SOLD', 'NOT_FOR_SALE'],
        },
      ],
    },
    {
      label: t('navBar.outOfStock'),
      filters: [
        {
          key: 'stockStatusList',
          value: ['OUT_OF_STOCK'],
        },
      ],
    },
  ];

  const getFilterUrl = (params: { key: string; value: string[] }[]) => {
    const urlParams = new URLSearchParams();
    params.forEach((param) => {
      urlParams.set(param.key, param.value.toString());
    });

    const query = urlParams.toString();
    return `/stock?${query}`;
  };

  return (
    <div className='flex flex-col items-start'>
      {staticFilters.map((filter) => (
        <MenuBarItem
          key={filter.label}
          label={filter.label}
          url={getFilterUrl(filter.filters)}
          onClick={onClose}
          prefetch={false}
        />
      ))}
    </div>
  );
};

export default StaticFilterSubmenu;
