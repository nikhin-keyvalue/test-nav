import { Typography } from '@AM-i-B-V/ui-kit';
import { components } from '@generated/crm-service-types';
import { Divider } from '@mui/material';

import { NoData } from '@/components';
import DetailBlock from '@/components/blocks/DetailBlock';
import DetailBlockPaginationFooter from '@/components/blocks/DetailBlockPaginationFooter';
import useItemPagination from '@/hooks/itemsPagination';
import { useTranslations } from '@/hooks/translation';

import ImageSelect from './ImageSelect';

const VehiclePhotos = ({
  vehicles,
  isDealerPreview,
  webdealerBaseUrl,
}: {
  isDealerPreview: boolean;
  webdealerBaseUrl: string;
  vehicles: components['schemas']['Vehicle'][];
}) => {
  const t = useTranslations();

  const {
    paginatedItems,
    showAll,
    setShowAll,
    itemsPerPage,
    showFooter,
    page,
    setPage,
  } = useItemPagination({
    items: vehicles!,
    totalCount: vehicles?.length || 0,
    itemsPerPage: 2,
  });

  const handleOnVehicleClick = (item: components['schemas']['Vehicle']) => {
    if (item?.vehicleType === 'PurchaseVehicle' && item?.carstockId) {
      // TODO: need to update base url if and when webdealer makes changes in roles
      if (isDealerPreview) {
        window.open(`${webdealerBaseUrl}/stock/${item?.carstockId}`);
      } else
        window.open(
          `${webdealerBaseUrl}/customer/order-customer/details/${item?.carstockId}`
        );
    }
  };

  return (
    <DetailBlock
      title={t('vehicles.vechicles')}
      needAccordion={vehicles?.length > 0}
      subTitle={
        <Typography variant='textSmall' className='text-secondary'>
          {t('vehicles.involvedInOpportunity')}
        </Typography>
      }
    >
      <div>
        {vehicles?.length > 0 ? (
          <>
            <Divider className='mb-3' />
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                role='presentation'
                onClick={() => handleOnVehicleClick(item)}
                className={`mb-4 flex ${
                  item.vehicleType === 'PurchaseVehicle' && item?.carstockId
                    ? 'cursor-pointer'
                    : 'cursor-default'
                } gap-x-2`}
              >
                <div>
                  <ImageSelect src={item?.imageUrls?.[0] || ''} />
                </div>
                <div className='flex flex-col items-start'>
                  <Typography
                    variant='textSmallBold'
                    className='mb-1 text-secondary'
                  >
                    {t(`vehicles.${item.vehicleType!}`)}
                  </Typography>
                  <Typography
                    variant='textMediumBold'
                    className='mb-1 text-primary'
                  >
                    {item.name}
                  </Typography>
                  <Typography variant='textSmall' className='text-grey-56'>
                    {item?.orderId}
                    {item?.vin
                      ? `${item?.orderId ? ' •' : ''} ${item.vin} `
                      : ''}
                    {item?.licensePlate
                      ? `${item?.vin ? ' •' : ''}  ${item.licensePlate}`
                      : ''}
                    {/* {item.updatedBy
                      ? `${item?.vin ? ' •' : ''} ${t('common.updatedBy', {
                          date: convertDateFormat(
                            item?.updatedAt,
                            undefined,
                            true
                          ),
                          name: item.updatedBy,
                        })}`
                      : ''} */}
                  </Typography>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className='h-full w-full'>
            <NoData
              imageDimension={130}
              primaryText={t('vehicles.noVehiclesDataPrimaryText')}
            />
          </div>
        )}
        {showFooter ? (
          <DetailBlockPaginationFooter
            page={page}
            pageSize={itemsPerPage}
            count={vehicles?.length || 0}
            showAll={showAll}
            onShowAllChange={(newValue) => setShowAll(newValue)}
            onPageChange={(newPage) => setPage(newPage)}
            showPagination
          />
        ) : null}
      </div>
    </DetailBlock>
  );
};

export default VehiclePhotos;
