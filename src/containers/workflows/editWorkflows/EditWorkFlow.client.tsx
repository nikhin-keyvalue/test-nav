'use client';

import { definitions } from '@generated/workflow-task-management-types';
import { Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { FC, useState, useTransition } from 'react';

import SpinnerScreen from '@/components/SpinnerScreen';
import SubmitLine from '@/components/SubmitLine';
import { useTranslations } from '@/hooks/translation';
import { WORKFLOW_ENTITIES } from '@/types/common';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

import { workflowsSaveAction } from '../api/actions';
import WorkflowEditForm from './WorkFlowEditForm';

interface Props {
  availableWorkflows: definitions['IWorkflowItemDto'][] | [];
  currentWorkflows: definitions['IWorkflowDto'][];
  workflowServiceId: string;
  workflowServiceType: definitions['WorkflowTaskDto']['workflowServiceType'];
}

const EditWorkflow: FC<Props> = ({
  availableWorkflows,
  currentWorkflows,
  workflowServiceId,
  workflowServiceType,
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [isSubmitting, startTransition] = useTransition();

  const [workflows, setWorkflows] = useState<definitions['IWorkflowItemDto'][]>(
    []
  );

  const handleSave = () => {
    const workflowIdList = workflows.map((workflow) => workflow.id!);

    const payload = { workflowIdList, workflowServiceId, workflowServiceType };

    startTransition(async () => {
      const res = await workflowsSaveAction(
        payload,
        WORKFLOW_ENTITIES[workflowServiceType]
      );
      if (res?.success) {
        showSuccessToast(t('common.savedSuccessfully'));

        router.push(
          `/${WORKFLOW_ENTITIES[workflowServiceType]}/${workflowServiceId}/details`
        );
      } else showErrorToast(t('common.somethingWentWrong'));
    });
  };

  // TODO: Fix types of currentworkflow and other workflows when integrating delete (presently apis return different types for current and all workflows)

  return (
    <form action={handleSave} id='editWorkflowForm'>
      {isSubmitting && <SpinnerScreen />}
      <WorkflowEditForm
        workflows={workflows}
        currentWorkflows={currentWorkflows}
        availableWorkflows={availableWorkflows}
        onNewWorkflowSelected={(workflow) =>
          setWorkflows([...workflows, workflow])
        }
      />
      <Divider />
      <SubmitLine testId='edit-workflow-submit-line' />
    </form>
  );
};

export default EditWorkflow;
