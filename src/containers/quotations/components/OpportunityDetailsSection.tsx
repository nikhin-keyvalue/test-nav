import { FC } from 'react';

import DetailBlock from '@/components/blocks/DetailBlock';
import OpportunityDetailsBlock from '@/containers/opportunities/opportunityDetails/OpportunityDetailsBlock';

import { OpportunityDetailsSectionProps } from '../api/type';

const OpportunityDetailsSection: FC<OpportunityDetailsSectionProps> = ({
  opportunityDetails,
}) => (
  <div>
    <DetailBlock title='Opportunity details' needAccordion={false}>
      {opportunityDetails ? (
        <OpportunityDetailsBlock opportunityDetails={opportunityDetails} />
      ) : (
        <div>Opportunity not found</div>
      )}
    </DetailBlock>
  </div>
);

export default OpportunityDetailsSection;
