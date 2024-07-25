import { Button, Typography } from '@AM-i-B-V/ui-kit';
import { Tooltip } from '@mui/material';
import { useState } from 'react';

import If from '@/components/If';
import SpinnerScreen from '@/components/SpinnerScreen';
import { useDynamicTranslations } from '@/hooks/translation';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { colors } from '../../../../tailwind.config';
import { updateDeliveryStatus } from '../api/actions';
import { DeliveryStatus } from '../api/type';
import { DeliveryActionsConfig } from '../constants';

type DeliveryActionsBlockProps = {
  deliveryId: string;
  currentState: DeliveryStatus;
};

const DeliveryActionsBlock = ({
  deliveryId,
  currentState,
}: DeliveryActionsBlockProps) => {
  const isQuotationSignedOrRejected = false;
  const disableShare = false;
  const [isLoading, setIsLoading] = useState(false);
  const t = useDynamicTranslations();
  const onUpdateStatus = async (status: DeliveryStatus | undefined) => {
    if (!status) return;

    setIsLoading(true);
    try {
      const updateDeliveryStatusResponse = await updateDeliveryStatus({
        id: deliveryId,
        status,
      });
      if (updateDeliveryStatusResponse.success)
        showSuccessToast(t('deliveries.statusUpdatedSuccess'))
      else throw(new Error());
    } catch {
      showErrorToast(t('common.somethingWentWrong'));
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`inline-flex
      w-full items-center justify-between gap-6 rounded bg-secondary py-4 pl-6 pr-4`}
    >
      {isLoading && <SpinnerScreen showGradient />}
      <div className='flex items-center text-white'>
        <Typography variant='titleMediumBold'>{t(`deliveries.deliveryStatus.${currentState}`)}</Typography></div>
      <If
        condition={
          DeliveryActionsConfig[currentState].ctaTargetStatus !== undefined
        }
      >
        <Tooltip title={t('deliveries.updateDeliveryStatus')} placement='top'>
          <div>
            <Button
              className={`h-[44px] ${
                isQuotationSignedOrRejected ? 'w-10' : 'min-w-[140px]'
              }  rounded ${
                isQuotationSignedOrRejected ? 'bg-grey-88' : 'bg-primary'
              } px-3 text-white`}
              sx={{
                opacity: disableShare ? 0.5 : 1,
                textTransform: 'none',
                pointerEvents:
                  isQuotationSignedOrRejected || disableShare
                    ? 'none'
                    : 'cursor',
                '&:hover': {
                  backgroundColor: colors.primary.DEFAULT,
                },
              }}
              onClick={() =>
                onUpdateStatus(
                  DeliveryActionsConfig[currentState].ctaTargetStatus
                )
              }
              disableRipple
            >
              <Typography variant='titleSmallBold'>
                {t(`deliveries.deliveryStatusUpdateCta.${DeliveryActionsConfig[currentState].ctaLabel}`)}
              </Typography>
            </Button>
          </div>
        </Tooltip>
      </If>
    </div>
  );
};
export default DeliveryActionsBlock;
