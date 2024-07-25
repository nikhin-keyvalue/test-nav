import { definitions } from '@generated/metafactory-service-types';

type VehicleSpecifications = definitions['ISpecificationsCarStockDto'] | null;

export interface ImageSources {
  IMAGIN_STUDIO: {
    active: boolean;
    available: boolean;
  };
  CAR_SPECIFIC: {
    active: boolean;
    available: boolean;
  };
  MATCH_WITHIN_TENANT: {
    active: boolean;
    available: boolean;
  };
  BRAND_RENDERS: {
    active: boolean;
    available: boolean;
  };
  PLACE_HOLDER: {
    active: boolean;
    available: boolean;
  };
}

export type ThumbNailSource =
  | 'IMAGIN_STUDIO'
  | 'CAR_SPECIFIC'
  | 'MATCH_WITHIN_TENANT'
  | 'BRAND_RENDERS'
  | 'PLACE_HOLDER';

export interface CarStockListData {
  carStockId?: number;
  thumbNail: string;
  thumbNailSource: ThumbNailSource;
  imageSources: ImageSources;
  availableImagesCount: number;
  activeImagesCount: number;
}

export type ProgressTitle =
  | 'PERFECT'
  | 'NICE'
  | 'AVERAGE'
  | 'ADDITIONAL'
  | 'HIGH_PRIORITY';

export interface CarStockListProgressData {
  percentage: number;
  title: ProgressTitle;
}

export type ProgressResponse = Record<number, CarStockListProgressData>;

export type StockListItem = definitions['ICarStockListItemDto'] & {
  specifications: VehicleSpecifications;
};

export type StockListData = {
  items?: StockListItem[];
  pageCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
};

export interface Image {
  id: string;
  url: string;
  imageType: ThumbNailSource;
}

export interface CarouselData {
  carstockId: number;
  manualAdjustment: boolean;
  updater: string;
  imageSources: ImageSources;
  images: Image[];
  active: number;
  available: number;
}

export type VehiclePriceData = {
  effectiveSellingPrice: number;
  effectiveDiscountAmount: number;
  retailPrice: number;
};
