import { OpportunityStatusType } from '@/containers/opportunities/api/type';

export interface IOpportunityLineItemProps {
  item: {
    id?: string | undefined;
    name?: string | undefined;
    status?: OpportunityStatusType;
  };
}
