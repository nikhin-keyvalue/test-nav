import Image, { ImageLoaderProps } from 'next/image';
import { CSSProperties, useEffect, useState } from 'react';

const EmptyImage = require('@/assets/emptyImage.svg');

interface Dimensions {
  height?: number;
  width?: number;
}

const CarImage = ({
  imgSrc,
  onClick,
  className,
  style,
  dimensions,
  isCloudFlare = false,
}: {
  imgSrc?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties | undefined;
  dimensions?: Dimensions;
  isCloudFlare?: boolean;
}) => {
  const imageLoader = ({ src, width, quality }: ImageLoaderProps) =>
    `${src}?width=${width}&quality=${quality || 75}`;
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => setImgUrl(imgSrc!), [imgSrc]);

  const setThumbnailImage = () => setImgUrl(EmptyImage);

  return (
    <Image
      unoptimized
      {...(isCloudFlare && { loader: imageLoader })}
      onClick={onClick}
      onError={setThumbnailImage}
      className={className}
      src={imgUrl || EmptyImage}
      alt='car image'
      style={style}
      fill={!(dimensions?.height || dimensions?.width)}
      priority
      {...(dimensions?.width && { width: dimensions.width })}
      {...(dimensions?.height && { height: dimensions.height })}
    />
  );
};

export default CarImage;
