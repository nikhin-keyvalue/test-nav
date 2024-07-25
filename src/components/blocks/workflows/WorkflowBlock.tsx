import { definitions } from '@generated/workflow-task-management-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { useTranslations } from 'next-intl';

import { NoData } from '@/components';
import EditButton from '@/components/EditButton';

import DetailBlock from '../DetailBlock';
import WorkflowLine, { WorkflowLineLoadingFallback } from './WorkflowLine';
import WorkflowTask, { WorkflowTaskLoadingFallback } from './WorkflowTask';

const WorkflowBlock = (props: {
  workflows: definitions['IWorkflowListDto']['workflows'];
  href: string;
}) => {
  const t = useTranslations('workflows');
  const { workflows, href } = props;

  return (
    <DetailBlock title={t('workflows')} button={<EditButton href={href} />}>
      {workflows?.length ? (
        <div className='flex flex-col divide-y-2' data-testid='workflowDetails'>
          <Accordion type='single' collapsible>
            {workflows?.map((workflow, index) => (
              <AccordionItem key={workflow.title} value={index.toString()}>
                <AccordionTrigger asChild>
                  <WorkflowLine
                    title={workflow.title}
                    status={workflow.status}
                    leadTimeInMinutes={workflow.leadTimeInMinutes}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <div className='mt-2 flex flex-wrap gap-x-6 gap-y-4 pb-4 pl-8'>
                    {workflow.tasks!.map((task) => {
                      if (task.status === 'DONE') {
                        return (
                          <WorkflowTask
                            key={task.title}
                            status='done'
                            title={task.title!}
                            timeInMinutes={task.minutesUntilCompleted!}
                          />
                        );
                      }
                      if (task.status === 'NEW') {
                        return (
                          <WorkflowTask
                            key={task.title}
                            status='todo'
                            title={task.title!}
                            timeInMinutes={task.minutesToExpiration!}
                          />
                        );
                      }
                      if (task.status === 'HOLD') {
                        return (
                          <WorkflowTask
                            key={task.title}
                            status='pending'
                            title={task.title!}
                            task={task.dependentTaskTitles?.join(',') ?? ''}
                          />
                        );
                      }
                      return undefined;
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <NoData imageDimension={130} primaryText={t('noWorkflows')} />
      )}
    </DetailBlock>
  );
};

export default WorkflowBlock;

export const WorkflowBlockLoadingFallback = () => (
  <div className='flex flex-col'>
    <WorkflowLineLoadingFallback open />
    <div className='mt-2 flex flex-wrap gap-x-6 gap-y-4 pb-4 pl-8'>
      <WorkflowTaskLoadingFallback />
      <WorkflowTaskLoadingFallback />
      <WorkflowTaskLoadingFallback />
    </div>
    <WorkflowLineLoadingFallback open={false} />
    <WorkflowLineLoadingFallback open={false} />
  </div>
);
