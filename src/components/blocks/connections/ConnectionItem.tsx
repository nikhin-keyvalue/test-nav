'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import EllipsisMenu from '@/components/menus/EllipsisMenu';
import SpinnerScreen from '@/components/SpinnerScreen';
import { useTranslations } from '@/hooks/translation';
import { IOrganisationDetails, PersonsDetails } from '@/types/api';
import { ENTITIES } from '@/types/common';
import { deleteConnection } from '@/utils/actions/formActions';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import AddConnectionDialog from './AddConnectionDialog';
import { Connection } from './types';

type propsType = {
  connection: Connection;
  index: number;
  parentEntity: ENTITIES;
  existingConnections?:
    | IOrganisationDetails['connections']
    | PersonsDetails['connections'];
};

const ConnectionLineItem: React.FC<propsType> = ({
  connection,
  index,
  parentEntity,
  existingConnections,
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const { id: parentEntityId } = useParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleClickOpen = () => {
    setIsCreateOpen(true);
  };
  const handleCloseDialog = () => {
    setIsCreateOpen(false);
  };

  const onDeleteConnection = async () => {
    startTransition(async () => {
      if (connection?.id) {
        const res = await deleteConnection(
          connection.id,
          parentEntityId as string,
          parentEntity
        );

        if (res?.success) showSuccessToast(t('common.savedSuccessfully'));
        else showErrorToast(t('common.somethingWentWrong'));
      }
    });
  };

  const menuItems = [
    {
      id: 1,
      name: t('connections.editConnection'),
      onClick: handleClickOpen,
    },
    {
      id: 2,
      name: t('connections.disconnect'),
      onClick: onDeleteConnection,
    },
  ];

  const handleItemClick = () => {
    if (connection.entity === 'Person')
      router.push(`/persons/${connection.linkId}/details`);
    if (connection.entity === 'Organisation')
      router.push(`/organisations/${connection.linkId}/details`);
  };

  return (
    <>
      {isPending && <SpinnerScreen />}
      <div className='inline-flex w-full items-center justify-start gap-2 self-stretch border-t border-zinc-200 py-2'>
        <div className='flex shrink grow basis-0 items-start justify-start'>
          <div className='inline-flex shrink grow basis-0 flex-col items-start justify-start pl-2'>
            <div className='flex flex-col items-start justify-start gap-2 self-stretch'>
              <div className='inline-flex items-center justify-start gap-1 self-stretch'>
                <div className='shrink grow basis-0'>
                  <span
                    role='presentation'
                    onClick={handleItemClick}
                    className='cursor-pointer font-roboto text-[15px] font-semibold leading-[21px] text-red-600'
                  >
                    {connection?.linkName}
                  </span>
                  <span className='font-roboto text-xs font-normal leading-none text-grey-56'>
                    {' '}
                    •{' '}
                    {connection?.connectionType
                      ? t(`connections.${connection?.connectionType}`)
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <EllipsisMenu menuItems={menuItems} index={index} />
        {isCreateOpen && (
          <AddConnectionDialog
            open={isCreateOpen}
            handleClose={handleCloseDialog}
            childEntity={
              connection?.entity === 'Person'
                ? ENTITIES.PERSON
                : ENTITIES.ORGANISATION
            }
            parentEntity={parentEntity}
            existingConnections={existingConnections}
            connectionToEdit={connection}
          />
        )}
      </div>
    </>
  );
};

export default ConnectionLineItem;
