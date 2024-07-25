import { Typography } from '@AM-i-B-V/ui-kit';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { Divider, Grid, Paper } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import FileUpload from '@/components/FileUpload';
import FormPageHeader from '@/components/FormPageHeader';
import EllipsisMenu from '@/components/menus/EllipsisMenu';
import { Item } from '@/components/menus/types';
import SubmitLine from '@/components/SubmitLine';
import { useTranslations } from '@/hooks/translation';
import { imageUploadAction } from '@/utils/actions/formActions';
import formatBytes from '@/utils/common';
import { showErrorToast } from '@/utils/toast';

import { getTradeInImages } from '../api/api';
import { ImageFile, TradeInImageResponse } from '../api/type';
import { useCreateQuotationContext } from '../CreateQuotationContextWrapper';
import { CreateQuotationReducerActionType } from '../CreateQuotationReducer';

interface UploadTradeInVehicleProps {
  closeUploadPhoto: () => void;
  addTradeInImages: (i: ImageFile[]) => void;
  images: string[];
  tradeInId: string;
}

const UploadTradeInVehicle: FC<UploadTradeInVehicleProps> = ({
  closeUploadPhoto,
  addTradeInImages,
  images,
  tradeInId,
}) => {
  const t = useTranslations();
  const params = useSearchParams();
  const { quotationId } = useParams();
  const { state, dispatch } = useCreateQuotationContext();

  // const [selectedImages, setSelectedImages] = useState<(string | undefined)[]>(
  //   []
  // );
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(5);
  const [imageList, setImageList] = useState<ImageFile[]>([]);

  const { tradeInImageMap } = state;

  const getTradeInImageMap = async () => {
    const tradeInImageResponse: TradeInImageResponse = await getTradeInImages(
      quotationId as string,
      tradeInId
    );
    dispatch({
      type: CreateQuotationReducerActionType.UPDATE_TRADE_IN_IMAGE_MAP,
      payload: tradeInImageResponse.map((item) => ({
        ...item,
        id: item.imageId,
      })),
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (tradeInId) getTradeInImageMap();
    const interval = setInterval(() => {
      setProgress((currentProgress) =>
        currentProgress === 99 ? currentProgress : currentProgress + 1
      );
    }, 400);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (images) {
      setImageList(
        images.map(
          (item) =>
            tradeInImageMap[item.substring(item.lastIndexOf('/') + 1)] || {
              location: item,
            }
        )
      );
    }
  }, [tradeInImageMap, images]);

  const handleFileSelect = async (selectedFile: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('photo', selectedFile as File);

    const imageUploadResponse = await imageUploadAction(
      formData,
      params.get('opportunityId') as string
    );
    if (imageUploadResponse.success) {
      const { name, size } = selectedFile;
      setImageList([
        ...imageList,
        { fileName: name, fileSize: size, ...imageUploadResponse.body },
      ]);
    } else {
      showErrorToast(
        imageUploadResponse?.message ?? t('common.somethingWentWrong')
      );
    }

    setIsLoading(false);
  };

  // const toggleSelection = (id: string | undefined) => {
  //   if (selectedImages.includes(id)) {
  //     setSelectedImages([...selectedImages.filter((image) => image !== id)]);
  //   } else {
  //     setSelectedImages([...selectedImages, id]);
  //   }
  // };

  // const toggleSelectAll = () => {
  //   if (selectedImages.length > 0) {
  //     setSelectedImages([]);
  //   } else {
  //     setSelectedImages(imageList.map(({ id }) => id));
  //   }
  // };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    addTradeInImages(imageList);
  };

  const handleDelete = (index: number) => {
    const modifiedImages = imageList.filter((_, idx) => index !== idx);
    setImageList(modifiedImages);
  };

  const menuItems: Item[] = [
    {
      id: 1,
      name: t('common.delete'),
      onClick: (index) => handleDelete(index! as number),
    },
  ];

  return (
    <div className='absolute left-0 top-0 z-10 flex max-h-screen min-h-screen w-full flex-col gap-y-8 overflow-y-auto bg-[#F7F7F8] py-5 md:px-6'>
      <FormPageHeader
        goBack={closeUploadPhoto}
        saveButtonProps={{ disabled: isLoading }}
        onSubmit={onSubmit}
      >
        <Typography
          variant='titleLargeBold'
          className='text-center text-secondary sm:text-left'
        >
          {t('quotations.uploadTradeInVehicle')}
        </Typography>
      </FormPageHeader>
      <Grid md={6} sm={12}>
        <Paper className='flex flex-col gap-4 rounded p-6 shadow'>
          <FileUpload
            showProgress={isLoading}
            progress={progress}
            multiple={false}
            disabled={isLoading}
            accept={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/svg+xml': ['.svg'],
              'image/webp': ['.webp'],
            }}
            className='py-8'
            onFileSelect={(selectedFiles: File[]) => {
              handleFileSelect(selectedFiles[0]);
            }}
          />
          {/* <div className='flex items-center gap-3'>
            <Checkbox
              color='secondary'
              size='medium'
              sx={{ p: 0 }}
              onChange={toggleSelectAll}
              checked={
                selectedImages.length > 0 &&
                selectedImages.length === imageList.length
              }
            />
            <span>
              {t('quotations.filesSelected', { count: selectedImages.length })}
            </span>
            <Button
              color='secondary'
              variant='outlined'
              startIcon={<MdMoreVert />}
              sx={{ textTransform: 'none' }}
              disabled
            >
              <Typography variant='titleSmallBold'>
                {t('common.takeAction')}
              </Typography>
            </Button>
          </div> */}
          <div>
            {imageList.map(({ id, fileName, fileSize }, index) => (
              <>
                <Divider className='my-2' />
                <div
                  className='flex w-full items-center gap-2 text-primary'
                  key={id}
                >
                  {/* <Checkbox
                    color='secondary'
                    size='medium'
                    sx={{ p: 0 }}
                    checked={selectedImages.includes(id)}
                    onChange={() => toggleSelection(id)}
                  /> */}
                  <div className='flex flex-1 items-center gap-2'>
                    <InsertDriveFileOutlinedIcon />
                    <Typography variant='textMediumBold'>{fileName}</Typography>
                  </div>
                  <div className='text-xs text-secondary-500'>
                    {formatBytes(fileSize)}
                  </div>
                  <EllipsisMenu menuItems={menuItems} index={index} />
                </div>
              </>
            ))}
          </div>
        </Paper>
      </Grid>
      <SubmitLine
        testId='upload-trade-in-vehicle-submit-line'
        onSubmit={onSubmit}
        onCancel={closeUploadPhoto}
        disableButtons={isLoading}
      />
    </div>
  );
};

export default UploadTradeInVehicle;
