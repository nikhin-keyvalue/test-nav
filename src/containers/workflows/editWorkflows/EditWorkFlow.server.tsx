import { definitions } from '@generated/workflow-task-management-types';
import { redirect } from 'next/navigation';

import { UserDetails } from '@/components/user-details/types';
import { currentUser } from '@/hooks/server/currentUser';
import { WORKFLOW_ENTITIES } from '@/types/common';

import { getAllWorkflows, getCurrentWorkflows } from '../api/actions';
import EditWorkflow from './EditWorkFlow.client';

const EditWorkFlow = async ({
  workflowServiceId,
  entity,
  dealerId,
}: {
  workflowServiceId: string;
  entity: definitions['WorkflowTaskDto']['workflowServiceType'];
  dealerId: string;
}) => {
  const allWorkflowsPromise = getAllWorkflows(dealerId as string, entity);

  const currentWorkflowsPromise = getCurrentWorkflows(
    workflowServiceId,
    entity
  );

  const userDetailsPromise = currentUser();

  const [allWorkflowsData, currentWorkflowsData, userDetails]: [
    definitions['IAllWorkflowsDto'] | null,
    definitions['IWorkflowListDto'],
    UserDetails,
  ] = await Promise.all([
    allWorkflowsPromise,
    currentWorkflowsPromise,
    userDetailsPromise,
  ]);

  const roles = userDetails?.authorities;

  const isAuthorized =
    roles?.includes('ROLE_TASK_ADMIN') || roles?.includes('ROLE_TASK');

  if (!isAuthorized) redirect(`/${WORKFLOW_ENTITIES[entity]}`);

  return (
    <EditWorkflow
      availableWorkflows={allWorkflowsData?.allWorkflows || []}
      currentWorkflows={currentWorkflowsData?.workflows || []}
      workflowServiceId={workflowServiceId}
      workflowServiceType={entity}
    />
  );
};

export default EditWorkFlow;
