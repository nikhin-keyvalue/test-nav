import { IconButton, Menu, MenuItem } from '@mui/material';
import { FC, useState } from 'react';
import { MdMoreVert } from 'react-icons/md';

import { showErrorToast } from '@/utils/toast';

import { ellipsisMenuTestIds } from '../../../tests/e2e/constants/testIds';
import { Item } from './types';

export interface EllipisisMenuProps {
  menuItems: Item[];
  index: string | number | boolean;
  testId?: string;
  disabledState?: { message: string; disabled: boolean };
  entityId?: string | number | boolean;
}

const EllipsisMenu: FC<EllipisisMenuProps> = ({
  menuItems,
  index,
  testId = ellipsisMenuTestIds.ellipsisMenuButton,
  disabledState = undefined,
  entityId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (disabledState?.disabled) {
      showErrorToast(disabledState.message);
      return;
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        sx={{ p: 0 }}
        onClick={handleClick}
        data-testid={`${testId}-icon`}
      >
        <MdMoreVert size='1.25rem' fill='inherit' />
      </IconButton>
      <Menu
        id='positioned-menu'
        aria-labelledby='positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        data-testid={ellipsisMenuTestIds.ellipsisMenu}
      >
        {menuItems.map((menuItem: Item) => (
          <MenuItem
            data-testid={menuItem?.testId}
            onClick={(e) => {
              menuItem.onClick(index, entityId as string);
              handleClose(e);
            }}
            key={menuItem.id}
            disabled={
              menuItem?.disabled ? menuItem?.disabled(index as number) : false
            }
          >
            {menuItem.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default EllipsisMenu;
