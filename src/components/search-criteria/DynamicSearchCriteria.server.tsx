import { SEARCH_CRITERIA_BASE_URL } from '@/constants/env';
import { fetcher } from '@/utils/api';
import { getTokenDecodedValues } from '@/utils/tokenDecodeAction';

import DynamicSearchCriteriaListUI from './DynamicSearchCriteria.client';
import { SearchCriteriaListItem } from './types';

const DynamicSearchCriteria = async () => {
  const tenantAndUserIdHeader =
    await getTokenDecodedValues('tenantUserIdHeader');
  const data: Array<SearchCriteriaListItem> =
    (await fetcher({
      url: `${SEARCH_CRITERIA_BASE_URL}/search-criteria`,
      fetchOptions: {
        headers: {
          ...(tenantAndUserIdHeader || {}),
        },
      },
    })) || [];

  return <DynamicSearchCriteriaListUI criteria={data} />;
};

export default DynamicSearchCriteria;
