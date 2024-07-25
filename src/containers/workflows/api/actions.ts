'use server';

import { definitions } from '@generated/workflow-task-management-types';
import { revalidatePath } from 'next/cache';

import { WORKFLOW_ENTITIES } from '@/types/common';
import { metaFactoryFetcher } from '@/utils/api';
import { getTraceId } from '@/utils/common';

export const getAllWorkflows = async (
  dealerId: string,
  workflowServiceType: definitions['WorkflowTaskDto']['workflowServiceType']
) => {
  try {
    const response: definitions['IAllWorkflowsDto'] = await metaFactoryFetcher(
      `api/workflow/all?dealerId=${dealerId}&workflowServiceType=${workflowServiceType}`
    );
    return response;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getAllWorkflowsMetafactoryServerActionFunction')
    );
    return null;
  }
};

export const getCurrentWorkflows = async (
  workflowServiceId: string,
  workflowServiceType: definitions['WorkflowTaskDto']['workflowServiceType']
) => {
  try {
    const response = await metaFactoryFetcher(
      `api/workflow/current?workflowServiceId=${workflowServiceId}&workflowServiceType=${workflowServiceType}`
    );
    return response;
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('getCurrentWorkflowsMetafactoryServerActionFunction')
    );
    return null;
  }
};

export const workflowsSaveAction = async (
  payload: definitions['WorkflowTaskDto'],
  entity: WORKFLOW_ENTITIES
) => {
  try {
    const data = await metaFactoryFetcher(
      `api/workflow/tasks`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      { format: false, throwError: true }
    );
    if (data.ok) {
      revalidatePath(`/${entity}/${payload.workflowServiceId}/details`);
      return { success: true };
    }
  } catch (error) {
    console.log(
      'ERROR Something went wrong :',
      error,
      'AWS-XRAY-TRACE-ID=',
      getTraceId('workflowsSaveActionMetafactoryServerActionFunction')
    );
    return { success: false };
  }

  return null;
};
