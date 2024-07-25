'use server';

import {
  getImageArray,
  getVehicleHeaderDetails,
} from '@/containers/vehicles/api/actions';
import { VehicleHeaderDetails } from '@/containers/vehicles/api/types';
import { CarouselData } from '@/containers/vehicles/components/types';

export const fetchVehicleInfo = async ({
  vehicleId,
}: {
  vehicleId: string;
}) => {
  const numericVehicleId = Number(vehicleId);
  const vehicleHeaderPromise = getVehicleHeaderDetails({
    carStockId: numericVehicleId,
  });
  const imageResponsePromise = getImageArray({
    carStockId: numericVehicleId,
  });

  const [vehicleHeaderDetails, imageResponse]: [
    VehicleHeaderDetails,
    CarouselData,
  ] = await Promise.all([vehicleHeaderPromise, imageResponsePromise]);

  return { vehicleHeaderDetails, imageResponse };
};
