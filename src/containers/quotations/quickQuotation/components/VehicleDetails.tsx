import { Typography } from '@AM-i-B-V/ui-kit';
import { Grid } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import { VehicleHeaderDetails } from '@/containers/vehicles/api/types';
import StockSubheading from '@/containers/vehicles/components/StockSubheading';
import { CarouselData } from '@/containers/vehicles/components/types';

const EmptyImage = require('@/assets/emptyImage.svg');

interface VehicleDetailsProps {
  vehicleHeaderDetails?: VehicleHeaderDetails | null;
  vehicleImageDetails?: CarouselData | null;
}

const VehicleDetails: FC<VehicleDetailsProps> = ({
  vehicleHeaderDetails,
  vehicleImageDetails,
}) => {
  const {
    vehicleDescription,
    consignment,
    newCar,
    chassis,
    licensePlate,
    numberOfOpenTask,
    numberOfOpenProcess,
    createdOn,
    updatedOn,
    updater,
  } = vehicleHeaderDetails || {};

  return (
    <Grid container direction='column' gap={2} className='bg-white px-6 py-4'>
      <Grid item>
        <Typography variant='titleSmallBold' color='primary'>
          {vehicleDescription}
        </Typography>
      </Grid>
      <Grid item container flexDirection='row' gap={2} flexWrap='nowrap'>
        <Grid item>
          <Image
            unoptimized
            src={vehicleImageDetails?.images?.[0]?.url || EmptyImage}
            alt='Car image in Quick Proposal'
            width={290}
            height={179}
          />
        </Grid>
        <Grid item>
          <StockSubheading
            carDetails={{
              consignment,
              newCar,
              chassis,
              licensePlate,
              numberOfOpenTask,
              numberOfOpenProcess,
              createdOn,
              updatedOn,
              updater,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VehicleDetails;
