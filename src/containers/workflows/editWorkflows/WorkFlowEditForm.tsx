'use client';

import { Typography } from '@AM-i-B-V/ui-kit';
import { definitions } from '@generated/workflow-task-management-types';
import { Autocomplete, Divider, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { MdOutlineManageSearch } from 'react-icons/md';

// import { DropdownMenu, DropdownMenuTrigger } from '@/components/DropdownMenu';
import FormPageHeader from '@/components/FormPageHeader';
import { useTranslations } from '@/hooks/translation';

interface Props {
  workflows: definitions['IWorkflowItemDto'][];
  onNewWorkflowSelected: (workflow: definitions['IWorkflowItemDto']) => void;
  availableWorkflows: definitions['IWorkflowItemDto'][] | [];
  currentWorkflows?: definitions['IWorkflowDto'][];
  isBulk?: boolean;
  isCompleteData?: boolean;
}

const WorkflowEditForm = ({
  workflows,
  onNewWorkflowSelected,
  availableWorkflows,
  currentWorkflows,
  isBulk = false,
  isCompleteData = false,
}: Props) => {
  // const [selectedWorkflows, setSelectedWorkflows] = useState<
  //   (definitions['IWorkflowDto'] | definitions['IWorkflowItemDto'])[]
  // >([]);
  const [inputValue, setInputValue] = useState('');

  const t = useTranslations();

  // const handleSelection = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   workflow: definitions['IWorkflowDto'] | definitions['IWorkflowItemDto']
  // ) => {
  //   if (e.target.checked) setSelectedWorkflows((prev) => [...prev, workflow]);
  //   else
  //     setSelectedWorkflows(
  //       (prev) =>
  //         prev?.filter((selectedWorkflow) => selectedWorkflow !== workflow)
  //     );
  // };

  // const toggleAllSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.checked)
  //     setSelectedWorkflows(
  //       currentWorkflows ? [...workflows, ...currentWorkflows] : [...workflows]
  //     );
  //   else setSelectedWorkflows([]);
  // };

  const filteredAvailableWorkflows = useMemo(
    () =>
      availableWorkflows?.filter(
        (option) => !workflows.some((workflow) => workflow.id === option.id)
      ),
    [availableWorkflows, workflows]
  );

  return (
    <>
      <FormPageHeader>
        <Typography variant='titleLargeBold' className='text-secondary'>
          {t('workflows.edit')}
        </Typography>
      </FormPageHeader>
      <div className='xs:w-full flex flex-col gap-y-4 px-4 py-8 sm:w-[592px] sm:px-6'>
        {!isCompleteData && (
          <div className='text-1.5xl font-kanit font-semibold'>
            {t('workflows.title')}
          </div>
        )}
        <Autocomplete
          options={filteredAvailableWorkflows || []}
          getOptionLabel={(option) => option.title || ''}
          getOptionDisabled={(option) =>
            workflows.some((workflow) => workflow === option)
          }
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.title}
            </li>
          )}
          inputValue={inputValue}
          popupIcon={<MdOutlineManageSearch />}
          onInputChange={(event, value, reason) => {
            if (event && event.type === 'blur') {
              setInputValue('');
            } else if (reason !== 'reset') {
              setInputValue(value);
            }
          }}
          disableClearable
          renderInput={(params) => (
            <TextField {...params} label={t('workflows.addWorkflow')} />
          )}
          onChange={(e, value) => {
            if (value) onNewWorkflowSelected(value);
          }}
          sx={{
            '& .MuiAutocomplete-popupIndicator': { transform: 'none' },
          }}
        />
        {/* <div className='flex items-center gap-x-3'>
        <Checkbox
          checked={
            workflows.length || currentWorkflows?.length
              ? selectedWorkflows.length ===
                workflows.length + (currentWorkflows?.length || 0)
              : false
          }
          color='secondary'
          size='small'
          sx={{ p: 0 }}
          onChange={toggleAllSelection}
        />
        <div>
          {t('stockDetails.workflows.workflowsSelected', {
            count: selectedWorkflows.length,
          })}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className='data-[state=open]:bg-secondary data-[state=open]:text-white'
          >
            <Button
              color='secondary'
              variant='outlined'
              startIcon={<MdMoreVert />}
              disabled={selectedWorkflows.length === 0}
            >
              {t('common.takeAction')}
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div> */}
        <div>
          <div className='divide-x-0 divide-y divide-solid divide-secondary-300'>
            {currentWorkflows?.map((currentWorkflow) => (
              <div
                key={currentWorkflow.title}
                className='flex items-center justify-between py-2'
              >
                <div className='flex gap-x-2'>
                  {/* <Checkbox
                    checked={selectedWorkflows.some(
                      (selectedWorkflow) => selectedWorkflow === currentWorkflow
                    )}
                    color='secondary'
                    size='small'
                    sx={{ p: 0 }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSelection(e, currentWorkflow)
                    }
                  /> */}
                  {currentWorkflow.title}
                </div>
                {/* <WorkFlowActions /> */}
              </div>
            ))}
          </div>
          <div>
            {workflows.map((workflow) => (
              <div key={workflow.title}>
                <Divider />
                <div className='flex items-center justify-between py-2'>
                  <div className='flex gap-x-2'>
                    {/* <Checkbox
                      checked={selectedWorkflows.some(
                        (selectedWorkflow) => selectedWorkflow === workflow
                      )}
                      color='secondary'
                      size='small'
                      sx={{ p: 0 }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSelection(e, workflow)
                      }
                    /> */}
                    {workflow.title}
                  </div>
                  {/* Commented for now because of no actions */}
                  {/* {isBulk ? <BulkWorkflowActions /> : <WorkFlowActions />} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowEditForm;
