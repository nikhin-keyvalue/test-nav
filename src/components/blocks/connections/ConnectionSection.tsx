import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { NoData } from '@/components';
import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';
import { IOrganisationDetails, PersonsDetails } from '@/types/api';
import { ENTITIES } from '@/types/common';

import DetailBlock from '../DetailBlock';
import DetailBlockPaginationFooter from '../DetailBlockPaginationFooter';
import AddConnectionDialog from './AddConnectionDialog';
import ConnectionItem from './ConnectionItem';

const ConnectionsSection = ({
  connections,
  parentEntity,
  testId = '',
}: {
  connections:
    | IOrganisationDetails['connections']
    | PersonsDetails['connections'];
  parentEntity: ENTITIES;
  testId?: string;
}) => {
  const t = useTranslations();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [childEntity, setChildEntity] = useState<ENTITIES>();

  const handleClickOpen = () => {
    setIsCreateOpen(true);
  };
  const handleCloseDialog = () => {
    setIsCreateOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const DetailBlockProps = {
    title: t('connections.connections'),
    button: (
      <Button
        id='long-button'
        aria-label='more'
        variant='outlined'
        aria-haspopup='true'
        onClick={handleClick}
        className='flex gap-1'
        data-testid={`${testId}-add-btn`}
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'long-menu' : undefined}
      >
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold' className='capitalize'>
          {t('common.add')}
        </Typography>
      </Button>
    ),
    needAccordion: false,
  };

  const {
    page,
    showAll,
    setPage,
    setShowAll,
    showFooter,
    itemsPerPage,
    paginatedItems,
  } = useItemPagination({
    items: connections! || [],
    totalCount: connections?.length || 0,
    itemsPerPage: 3,
  });

  const menuItems = [
    {
      id: 1,
      entity: ENTITIES.PERSON,
      onClick: handleClickOpen,
      name: t('createPersons.title'),
      testId: `${testId}-add-person`,
    },
    {
      id: 2,
      onClick: handleClickOpen,
      entity: ENTITIES.ORGANISATION,
      name: t('createOrganisation.title'),
      testId: `${testId}-add-organisation`,
    },
  ] as const;

  return (
    <DetailBlock {...DetailBlockProps} testId={testId}>
      {paginatedItems?.length ? (
        paginatedItems.map((connection, index) => (
          <div key={connection.id} className='pb-1'>
            <ConnectionItem
              index={index}
              connection={connection}
              parentEntity={parentEntity}
              existingConnections={connections}
            />
          </div>
        ))
      ) : (
        <div className='h-full w-full'>
          <NoData
            imageDimension={130}
            testId={`${testId}-empty-data-container`}
            primaryText={t('connections.noConnectionsDataPrimaryText')}
          />
        </div>
      )}
      {showFooter && connections?.length ? (
        <DetailBlockPaginationFooter
          page={page}
          showAll={showAll}
          showPagination={false}
          pageSize={itemsPerPage}
          count={connections?.length || 0}
          onPageChange={(newPage) => setPage(newPage)}
          onShowAllChange={(newValue) => setShowAll(newValue)}
        />
      ) : null}
      <Menu
        open={open}
        anchorEl={anchorEl}
        id='positioned-menu'
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        aria-labelledby='positioned-button'
      >
        {menuItems.map((menuItem) => (
          <MenuItem
            key={menuItem.id}
            data-testid={menuItem.testId}
            onClick={() => {
              setChildEntity(menuItem.entity);
              menuItem.onClick();
              handleClose();
            }}
          >
            {menuItem.name}
          </MenuItem>
        ))}
      </Menu>
      {isCreateOpen && (
        <AddConnectionDialog
          open={isCreateOpen}
          childEntity={childEntity!}
          parentEntity={parentEntity}
          handleClose={handleCloseDialog}
          existingConnections={connections}
        />
      )}
    </DetailBlock>
  );
};

export default ConnectionsSection;
