import { Typography } from '@AM-i-B-V/ui-kit';
import { ButtonBase, Grid } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

interface CardProps {
  label: string;
  iconInfo: {
    iconPath: string;
    altText: string;
  };
  onClick: () => void;
}

const Card: FC<CardProps> = ({
  label,
  iconInfo: { iconPath, altText },
  onClick,
}) => (
  <ButtonBase onClick={onClick}>
    <Grid
      container
      direction='column'
      justifyContent='center'
      alignItems='center'
      className='h-40 w-60 rounded border-b-4 border-primary bg-white shadow'
    >
      <Grid item paddingBottom={2}>
        <Image src={iconPath} width={48} height={48} alt={altText} />
      </Grid>
      <Grid item>
        <Typography variant='titleSmallBold'>{label}</Typography>
      </Grid>
    </Grid>
  </ButtonBase>
);

export default Card;
