import { PersonsDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

import PersonDetails from './PersonDetail.client';

const Person = async ({ id }: { id: string }) => {
  let personDetails: PersonsDetails | null;
  try {
    personDetails = await crmServiceFetcher(`persons/${id}`);
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('personDetailsForPersonDetailsPage')
    );
    personDetails = null;
  }

  return (
    <div>
      <PersonDetails personDetails={personDetails} />
    </div>
  );
};

export default Person;
