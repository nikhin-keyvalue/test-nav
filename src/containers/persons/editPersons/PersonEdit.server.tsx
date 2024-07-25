import { Organisations, PersonsDetails } from '@/types/api';
import { crmServiceFetcher } from '@/utils/api';
import { getTraceId, getURLSearchParamsString } from '@/utils/common';

import { GETPersonByIdQueryParameters } from '../api/type';
import PersonEditClient from './PersonEdit.client';

const PersonEditServer = async ({ id }: { id: string }) => {
  let personDetails: PersonsDetails | null;
  let organisations: Organisations;
  try {
    const getPersonByIdQueryParameters: GETPersonByIdQueryParameters = {
      excludeRelated: true,
    };
    personDetails = await crmServiceFetcher(
      `persons/${id}${getURLSearchParamsString({ queryParams: getPersonByIdQueryParameters })}`
    );
  } catch (errorResponse) {
    // TODO: Remove console and handle error
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editPersonDetailsForEditPersonPage')
    );
    personDetails = null;
  }

  try {
    organisations = await crmServiceFetcher(`organisations`);
  } catch (errorResponse) {
    console.log(
      'ERROR Something went wrong :',
      errorResponse,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('organisationsForEditPersonPage')
    );
    organisations = { data: [] };
  }

  return (
    <PersonEditClient
      id={id}
      details={personDetails}
      organisations={organisations}
    />
  );
};

export default PersonEditServer;
