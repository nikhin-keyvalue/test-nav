import { Typography } from '@AM-i-B-V/ui-kit';
import { useTranslations } from 'next-intl';
import React, { Fragment } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';

import PipelineArrow from '@/components/PipelineArrow';

import { getConfig, statusColors } from './constants';
import { STAGE_STATUSES, STATUS_BAR_TYPES, StatusBarPropType } from './types';

const StatusBar: React.FC<StatusBarPropType<STATUS_BAR_TYPES>> = ({
  type,
  status,
}) => {
  const t = useTranslations('progressBar');
  const opportunityConfigFromProps = getConfig(type);
  const currentStateConfig = opportunityConfigFromProps[status];

  return (
    <div className='mb-6 flex h-24 w-full items-center rounded bg-white px-6 shadow'>
      <div className='flex h-14 overflow-hidden rounded'>
        {currentStateConfig?.stages?.map((stage, index, stages) => (
          <Fragment key={`${stage.label}-container`}>
            <div
              style={{
                backgroundColor: statusColors[stage.status],
                color:
                  stage.status === STAGE_STATUSES.INACTIVE
                    ? statusColors[STAGE_STATUSES.ACTIVE]
                    : 'white',
              }}
              className={`relative flex h-full items-center gap-1 ${
                index === stages.length - 1 ? 'pl-2 pr-4' : 'pl-4 pr-2'
              }`}
              key={stage.label}
            >
              <Typography variant='titleSmallBold'>{t(stage.label)}</Typography>
              {stage.status === STAGE_STATUSES.SUCCESS && <MdCheck size={20} />}
              {stage.status === STAGE_STATUSES.FAILURE && <MdClose size={20} />}
            </div>
            {index !== stages.length - 1 && (
              <PipelineArrow
                colorOne={statusColors[stage.status]}
                colorTwo={statusColors[stages[index + 1]?.status]}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
