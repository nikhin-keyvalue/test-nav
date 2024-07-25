import { Typography } from '@AM-i-B-V/ui-kit';
import { Button, Menu, MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { Item } from '@/components/menus/types';
import { showErrorToast } from '@/utils/toast';

interface AddMenuProps {
  menuItems: Item[];
  index: string | number | boolean;
  testId?: string;
  disabledState?: { message: string; disabled: boolean };
}

const AddMenu: FC<AddMenuProps> = ({
  menuItems,
  testId,
  index,
  disabledState = undefined,
}) => {
  const t = useTranslations();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabledState?.disabled) {
      showErrorToast(disabledState.message);
      return;
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        sx={{ textTransform: 'none' }}
        onClick={handleClick}
        color='secondary'
        className='border-r-0 hover:border-r-0'
        data-testid={testId}
      >
        <MdAdd size='1.25rem' />
        <Typography variant='titleSmallBold'>{t('common.add')}</Typography>
      </Button>
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
      >
        {menuItems.map((menuItem: Item) => (
          <MenuItem
            data-testid={menuItem.testId}
            onClick={() => {
              menuItem.onClick(index);
              handleClose();
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
    </>
  );
};

export default AddMenu;
