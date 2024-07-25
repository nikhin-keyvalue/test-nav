'use client';

import CarImage from '@/containers/vehicles/components/CarImage';

const ImageSelect = ({ src, title }: { src: string; title?: string }) => (
  <div>
    <div
      className={`relative ${
        src ? '' : 'border-solid border-secondary-300'
      } h-[94px] w-[150px]`}
    >
      <CarImage
        style={{ objectFit: 'contain', height: '100%' }}
        dimensions={{ height: 94, width: 150 }}
        imgSrc={src}
      />
    </div>
    <div className='mt-1 flex gap-2'>
      <p className='text-xs font-bold text-secondary'>{title}</p>
    </div>
  </div>
);

export default ImageSelect;
