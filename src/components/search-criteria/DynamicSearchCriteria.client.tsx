'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

import MenuBarContext from '@/app/[locale]/(user)/context/menubar-context/MenuBarContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import { searchCriteriaQueryKey } from '@/constants/stockFilters';
import { useTranslations } from '@/hooks/translation';
import { buildParams } from '@/utils/urlParams';

import { DeleteSearchPopup } from './DeleteSearchPopup';
import { RenameSearchPopup } from './RenameSearchPopup';
import { SearchCriteria, SearchCriteriaListItem } from './types';

type CriteriaState = {
  id: string;
  name: string;
  action: 'rename' | 'delete' | null;
};

const defaultCriteria = {
  id: '',
  name: '',
  action: null,
};

const DynamicSearchCriteria = ({
  criteria,
}: {
  criteria: Array<SearchCriteriaListItem>;
}) => {
  const [selectedCriteria, setSelectedCriteria] =
    useState<CriteriaState>(defaultCriteria);

  const t = useTranslations('searchCriteria');

  const { isVisible: isMenuBarVisible, toggleMenuBar } =
    useContext(MenuBarContext);

  const { data: items } = useQuery<Array<SearchCriteriaListItem>>({
    queryKey: searchCriteriaQueryKey,
    queryFn: () =>
      fetch('/api/search-criteria').then(async (response) => {
        const json = await response.json();
        return json;
      }),
    initialData: criteria,
    staleTime: 60_000,
  });

  const closePopup = () =>
    setSelectedCriteria(({ id, name }) => ({ id, name, action: null }));

  const getQueryParams = (searchCriteria: SearchCriteria) => {
    const urlParams = new URLSearchParams();
    // excluding these filters for now since these are not available in filter sheet. these will be added later
    const excludeFilters = [
      'estimatedDeliveryDateFrom',
      'estimatedDeliveryDateTo',
      'newCar',
      'retailPriceFrom',
      'retailPriceTo',
    ];

    Object.keys(searchCriteria).forEach((key) => {
      if (!excludeFilters.includes(key)) {
        const value = searchCriteria[key as keyof SearchCriteria];
        if (value) {
          buildParams(urlParams, key, value.toString());
        }
      }
    });
    const query = urlParams.toString() || '';
    return query;
  };

  const closeMenuBarIfOpen = () => {
    if (isMenuBarVisible) {
      toggleMenuBar();
    }
  };

  const openRenameSearch = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setSelectedCriteria({
      id,
      name,
      action: 'rename',
    });
  };

  const openDeleteSearch = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    setSelectedCriteria({
      id,
      name,
      action: 'delete',
    });
  };

  return (
    <div data-testid='searchCriteriaList'>
      <RenameSearchPopup
        id={selectedCriteria?.id}
        open={selectedCriteria.action === 'rename'}
        closePopup={closePopup}
        criteriaName={selectedCriteria?.name}
      />
      <DeleteSearchPopup
        id={selectedCriteria?.id}
        open={selectedCriteria.action === 'delete'}
        closePopup={closePopup}
        criteriaName={selectedCriteria?.name}
      />
      {items &&
        items?.length > 0 &&
        items?.map(({ id, name, searchCriteria }) => (
          <Link
            className='flex h-10 cursor-pointer items-center justify-center px-4 font-sans text-base font-semibold text-white no-underline hover:bg-primary has-[button[data-state=open]]:bg-primary'
            key={id}
            prefetch={false}
            href={`/stock?${getQueryParams(searchCriteria!)}`}
            onClick={closeMenuBarIfOpen}
            data-testid='searchCriteriaItem'
          >
            {name}
            <div className='flex-1' />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <button type='button' className='m-0 block border-none p-0'>
                  <MdMoreVert className='h-5 w-5 !text-white' />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='z-[1401]'>
                <DropdownMenuItem
                  onClick={(e) => openRenameSearch(e, id!, name!)}
                >
                  {t('renameSearch')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => openDeleteSearch(e, id!, name!)}
                >
                  {t('deleteSearch')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        ))}
    </div>
  );
};

export default DynamicSearchCriteria;
