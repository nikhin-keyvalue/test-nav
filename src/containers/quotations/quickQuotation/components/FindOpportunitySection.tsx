import { Typography } from '@AM-i-B-V/ui-kit';
import Button from '@mui/material/Button/Button';
import Grid from '@mui/material/Grid/Grid';
import { quickProposalIds } from '@test/constants/testIds';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import AutocompleteWithController from '@/components/autocomplete-with-controller/AutocompleteWithController';
import If from '@/components/If';
import {
  opportunityDetails,
  OpportunityStatusType,
} from '@/containers/opportunities/api/type';
import { useOptions } from '@/hooks/options';
import { useTranslations } from '@/hooks/translation';
import { VoidFnType } from '@/types/common';
import { mergeStrings } from '@/utils/common';

import { QuickQuotationStateNames } from '../../constants';
import { QuickQuotationFormSchema } from '../../types';

type FindOpportunitySectionProps = {
  onCreateNewOpportunity: VoidFnType;
};

type ExcludedOpportuntyStatuses = 'ClosedWon' | 'ClosedLost';

// Note: We cannot create proposals for opportunities in ClosedWon and ClosedLost statuses
export const allowedOpportunityStatuses: Exclude<
  OpportunityStatusType,
  ExcludedOpportuntyStatuses
>[] = ['Interest', 'Quotation', 'CustomerDecision', 'Agreement'];

const opportunityListFilters = `?status=${allowedOpportunityStatuses.join(',')}`;

const RenderOpportunityOption = (
  props: React.HTMLAttributes<HTMLLIElement>,
  option: opportunityDetails
) => {
  const { name, id, customer } = option;
  const { firstName, lastName, middleName, email } = customer ?? {
    firstName: '',
    lastName: '',
    email: '',
  };
  const customerName = mergeStrings({
    values: [firstName, middleName, lastName],
  });

  return (
    <li {...props} key={id}>
      <div>
        <div>{`${name} for ${customerName}`}</div>
        <div className='text-xs text-grey-56'>{email}</div>
      </div>
    </li>
  );
};

const FindOpportunitySection: FC<FindOpportunitySectionProps> = ({
  onCreateNewOpportunity,
}) => {
  const t = useTranslations();

  const { loading, options, onInputChange, onOpen } = useOptions({
    url: `/api/getOpportunities${opportunityListFilters}`,
  });

  const { control, watch } = useFormContext<QuickQuotationFormSchema>();

  const opportunityDetailsWatch = watch(
    QuickQuotationStateNames.opportunityDetails
  );

  return (
    <Grid container>
      <Grid item container display='flex' xs={12} md={6}>
        <If condition={!opportunityDetailsWatch?.name}>
          <Grid item className='mb-2'>
            <Typography variant='titleSmallBold' className='text-secondary'>
              {t('quotations.quickQuotation.isThereOpportunity')}
            </Typography>
          </Grid>

          <Grid
            container
            padding={3}
            className='rounded bg-grey-8'
            item
            xs={12}
          >
            <Grid item xs={12} className='mb-4'>
              <AutocompleteWithController
                testId='find-opportunity-text-field'
                name={QuickQuotationStateNames.opportunityDetails}
                control={control}
                label={t('quotations.quickQuotation.findOpportunity')}
                options={options as opportunityDetails[]}
                loading={loading}
                onInputChange={onInputChange}
                onOpen={onOpen}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                getOptionLabel={(option) => option.name}
                noOptionsText={
                  <Button onClick={onCreateNewOpportunity} variant='text'>
                    <Typography
                      variant='textMediumBold'
                      className='normal-case text-primary'
                    >
                      {t('quotations.quickQuotation.createNewOpportunity')}
                    </Typography>
                  </Button>
                }
                renderOption={RenderOpportunityOption}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={onCreateNewOpportunity} variant='text'>
                <Typography
                  data-testid={
                    quickProposalIds.quickQuotationCreateNewOpportunityButton
                  }
                  variant='textMediumBold'
                  className='normal-case text-primary'
                >
                  {t('quotations.quickQuotation.createNewOpportunity')}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </If>
      </Grid>
    </Grid>
  );
};

export default FindOpportunitySection;
