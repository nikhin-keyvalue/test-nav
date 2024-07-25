'use server';

import { paths } from '@generated/crm-service-types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  isDevelopmentMode,
  META_FACTORY_BASE_URL,
  WEBDEALER_BASE_URL,
} from '@/constants/env';
import { OrganisationFormType } from '@/containers/organisations/editOrganisation/types';
import { ImageUploadResponse } from '@/containers/quotations/api/type';
import {
  NewConnection,
  NewNote,
  NewNoteResponse,
  NewOpportunities,
  NewOrganisation,
  NewPerson,
  OpportunityDetails,
} from '@/types/api';
import {
  DefaultErrorType,
  DocumentParentEntities,
  ENTITIES,
} from '@/types/common';
import { deleteAuthCookie, setAuthCookie } from '@/utils/cookieActions';

import {
  crmServiceFetcher,
  documentServiceFetcher,
  imageServiceFetcher,
  metaFactoryFetcher,
} from '../api';
import { getTraceId, replaceUndefinedAndEmptyStringsWithNull } from '../common';
import { getTokenDecodedValues } from '../tokenDecodeAction';

type NewOrganisationResponse =
  paths['/organisations']['post']['responses']['200']['content']['application/json'];

type NewPersonResponse =
  paths['/persons']['post']['responses']['200']['content']['application/json'];

export const signInAction = async (args: {
  email: string;
  password: string;
}) => {
  try {
    const req = await fetch(`${META_FACTORY_BASE_URL}/api/authenticate`, {
      cache: 'no-store',
      method: 'POST',
      body: JSON.stringify({
        username: args.email,
        password: args.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await req.json();

    if (req.ok) await setAuthCookie(res?.id_token);

    return res;
  } catch (error) {
    return null;
  }
};

export const signOutAction = async () => {
  try {
    const res = await metaFactoryFetcher(
      `api/logout`,
      {
        method: 'POST',
      },
      { format: false, throwError: true }
    );
    if (res.ok) {
      deleteAuthCookie();
    }
  } catch (error) {
    return null;
  }

  if (isDevelopmentMode) return redirect('/login');
  return redirect(`${WEBDEALER_BASE_URL}/login`);
};

export const editOrganisation = async (
  id: string,
  organisationData: OrganisationFormType
) => {
  try {
    const data = await crmServiceFetcher(
      `organisations/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(organisationData)
        ),
      },
      { format: false, throwError: true }
    );
    if (data.ok) {
      revalidatePath(`/organisations/${id}/details`);
      revalidatePath(`/organisations`);
      revalidatePath(`/organisations/${id}/edit`);
      return { success: true, id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editOrganisationServerActionFunction')
    );
    return { success: false };
  }

  return null;
};

export const editPerson = async (id: string, PersonData: NewPerson) => {
  try {
    const data = await crmServiceFetcher(
      `persons/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(PersonData)
        ),
      },
      { format: false, throwError: true }
    );
    if (data.ok) {
      revalidatePath(`/persons/${id}/details`);
      revalidatePath(`/persons`);
      revalidatePath(`/persons/${id}/edit`);
      return { success: true, id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editPersonServerActionFunction')
    );
    return { success: false };
  }

  return null;
};

export const createOrganisation = async (
  organisationData: NewOrganisation
): Promise<{ id?: string | null; error: DefaultErrorType | null }> => {
  try {
    const data: NewOrganisationResponse = await crmServiceFetcher(
      `organisations`,
      {
        method: 'POST',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(organisationData)
        ),
      },
      { format: true, throwError: true }
    );
    if (data) {
      revalidatePath(`/organisations`);
      return { id: data?.id, error: null };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createOrganisationServerActionFunction')
    );
    return { id: null, error: error as DefaultErrorType };
  }
  return {
    error: {
      isOk: false,
    },
  };
};

export const deleteOrganisationsAction = async (organisationId: string) => {
  const response: Response & { errorCode: string } = await crmServiceFetcher(
    `organisations/${organisationId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    },
    { format: false, throwError: false }
  );
  if (response) {
    if (response.ok) {
      revalidatePath(`/organisations`);
    } else {
      const formattedResponse = await response.json();
      return {
        errorCode: formattedResponse?.errorCode,
        statusCode: response.status,
        ok: response.ok,
      };
    }
    return null;
  }
  return null;
};

export const createPerson = async (
  personsData: NewPerson
): Promise<{ id?: string | null; error: DefaultErrorType | null }> => {
  try {
    const data: NewPersonResponse = await crmServiceFetcher(
      `persons`,
      {
        method: 'POST',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(personsData)
        ),
      },
      { format: true, throwError: true }
    );
    if (data) {
      revalidatePath(`/persons`);
      return { id: data?.id, error: null };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createPersonServerActionFunction')
    );
    return { id: null, error: error as DefaultErrorType };
  }

  return {
    error: {
      isOk: false,
    },
  };
};

export const deletePersonAction = async (personId: string) => {
  const response: Response & { errorCode: string } = await crmServiceFetcher(
    `persons/${personId}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    },
    { format: false, throwError: false }
  );
  if (response) {
    if (response.ok) {
      revalidatePath(`/opportunities`);
    } else {
      const formattedResponse = await response.json();
      return {
        errorCode: formattedResponse?.errorCode,
        statusCode: response.status,
        ok: response.ok,
      };
    }
    return null;
  }
  return null;
};

export const editOpportunity = async (
  id: string,
  opportunity: NewOpportunities
) => {
  try {
    const data = await crmServiceFetcher(
      `opportunities/${id}`,
      {
        method: 'PUT',
        cache: 'no-store',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(opportunity)
        ),
      },
      { format: true, throwError: true }
    );
    if (data) {
      revalidatePath(`/opportunities/${id}/details`);
      revalidatePath(`/opportunities`);
      revalidatePath(`/opportunities/${id}/edit`);
      return { success: true, ...data };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editOpportunityServerActionFunction')
    );
    return { success: false };
  }

  return null;
};

export const createOpportunity = async (
  newOpportunity: NewOpportunities
): Promise<{ id?: string | null; error: DefaultErrorType | null }> => {
  try {
    const data: OpportunityDetails = await crmServiceFetcher(
      `opportunities`,
      {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(newOpportunity)
        ),
      },
      { format: true, throwError: true }
    );
    if (data) {
      return { id: data?.id, error: null };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createOpportunityServerActionFunction')
    );
    return { id: null, error: error as DefaultErrorType };
  }

  return {
    error: {
      isOk: false,
    },
  };
};

export const createNote = async (noteData: NewNote) => {
  try {
    const data: NewNoteResponse = await crmServiceFetcher(
      `notes`,
      {
        method: 'POST',
        body: JSON.stringify(replaceUndefinedAndEmptyStringsWithNull(noteData)),
      },
      { format: true, throwError: true }
    );
    if (data) {
      revalidatePath(`/organisations/${noteData.parentEntityId}/details`);
      revalidatePath(`/persons/${noteData.parentEntityId}/details`);
      return { id: data?.id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('createNoteServerActionFunction')
    );
    return null;
  }

  return null;
};

export const editNote = async (noteData: NewNote & { noteId?: string }) => {
  try {
    const data: NewNoteResponse = await crmServiceFetcher(
      `notes/${noteData.noteId}`,
      {
        method: 'PUT',
        cache: 'no-store',
        body: JSON.stringify(replaceUndefinedAndEmptyStringsWithNull(noteData)),
      },
      { format: true, throwError: true }
    );
    if (data) {
      revalidatePath(`/organisations/${noteData.parentEntityId}/details`);
      revalidatePath(`/persons/${noteData.parentEntityId}/details`);
      return { id: data?.id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editNoteServerActionFunction')
    );
    return null;
  }

  return null;
};

export const deleteNote = async (noteId: string, parentEntityId: string) => {
  try {
    const response: Response = await crmServiceFetcher(
      `notes/${noteId}`,
      {
        method: 'DELETE',
      },
      { format: false, throwError: true }
    );
    if (response) {
      revalidatePath(`/organisations/${parentEntityId}/details`);
      revalidatePath(`/persons/${parentEntityId}/details`);
      return { statusCode: response.status };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('deleteNoteServerActionFunction')
    );
    return null;
  }

  return null;
};

export const deleteOpportunity = async (
  opportunityId: string,
  parentEntityId?: string
) => {
  try {
    const response: Response = await crmServiceFetcher(
      `opportunities/${opportunityId}`,
      {
        method: 'DELETE',
        cache: 'no-store',
      },
      { format: false, throwError: true }
    );
    if (response) {
      if (parentEntityId && parentEntityId?.length > 0) {
        revalidatePath(`/organisations/${parentEntityId}/details`);
        revalidatePath(`/persons/${parentEntityId}/details`);
      }
      if (response.ok) {
        revalidatePath(`/opportunities`);
      }
      return { statusCode: response.status, ok: response.ok };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('deleteOpportunityServerActionFunction')
    );
    return null;
  }

  return null;
};

export const addConnection = async (
  parentEntityId: string,
  parentEntity: ENTITIES,
  connectionData: NewConnection
) => {
  try {
    const data = await crmServiceFetcher(
      `${parentEntity}/${parentEntityId}/connections`,
      {
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(connectionData)
        ),
      },
      { format: true, throwError: true }
    );

    if (data) {
      revalidatePath(`/${parentEntity}/${parentEntityId}`);
      return { id: data?.id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('addConnectionServerActionFunction')
    );
    return null;
  }

  return null;
};

export const editConnection = async (
  connectionId: string,
  parentEntityId: string,
  parentEntity: ENTITIES,
  connectionData: NewConnection
) => {
  try {
    const data = await crmServiceFetcher(
      `${parentEntity}/${parentEntityId}/connections/${connectionId}`,
      {
        method: 'PUT',
        cache: 'no-store',
        body: JSON.stringify(
          replaceUndefinedAndEmptyStringsWithNull(connectionData)
        ),
      },
      { format: true, throwError: true }
    );

    if (data) {
      revalidatePath(`/${parentEntity}/${parentEntityId}`);
      return { id: data?.id };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('editConnectionServerActionFunction')
    );
    return null;
  }

  return null;
};

export const deleteConnection = async (
  connectionId: string,
  parentEntityId: string,
  parentEntity: ENTITIES
) => {
  try {
    const res = await crmServiceFetcher(
      `${parentEntity}/${parentEntityId}/connections/${connectionId}`,
      {
        method: 'DELETE',
        cache: 'no-store',
      },
      { format: false, throwError: true }
    );

    if (res.ok) {
      revalidatePath(`/${parentEntity}/${parentEntityId}`);
      return { success: true };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('deleteConnectionServerActionFunction')
    );
    return { success: false };
  }

  return null;
};

export const documentUploadAction = async (
  formData: FormData,
  id: number | string,
  parentType: DocumentParentEntities = DocumentParentEntities.OPPORTUNITIES
) => {
  const path = `${parentType}/${id}/documents`;
  const response = await documentServiceFetcher(
    path,
    {
      method: 'POST',
      body: formData,
      headers: (await getTokenDecodedValues(
        'tenantUserIdHeader'
      )) as HeadersInit,
      cache: 'no-cache',
    },
    {
      format: false,
      throwError: true,
    }
  );

  if (response.status === 202) {
    revalidatePath(`opportunities/${id}/details`);
    return { success: true };
  }

  try {
    const responseJson = await response.json();
    return {
      success: false,
      message: responseJson?.description ?? '',
    };
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('documentUploadActionServerActionFunction')
    );

    return {
      success: false,
    };
  }
};

export const imageUploadAction = async (formData: FormData, id: string) => {
  const path = `opportunities/${id}/images`;

  try {
    const response = await imageServiceFetcher(
      path,
      {
        method: 'POST',
        body: formData,
        cache: 'no-cache',
      },
      { format: false }
    );

    const responseJson = await response.json();

    if (response.status === 200) {
      return {
        success: true,
        body: responseJson as ImageUploadResponse,
      };
    }
    return {
      success: false,
      message: responseJson?.description ?? '',
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
