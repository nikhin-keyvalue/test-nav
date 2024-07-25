import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { MdExpandMore } from 'react-icons/md';

export const FilterAccordionItem = ({
  children,
  title,
  value,
}: {
  children: React.JSX.Element;
  title: string;
  value: string;
}) => (
  <AccordionItem value={value}>
    <AccordionTrigger className='group flex h-14 w-full items-center border-0 border-b border-solid border-secondary-300 bg-white text-left text-[15px] font-semibold text-primary data-[state=open]:border-none data-[state=open]:bg-transparent'>
      <MdExpandMore className='ml-2 h-6 w-6 text-primary duration-300 group-data-[state=open]:rotate-180' />
      <span className='align-top'>{title}</span>
    </AccordionTrigger>
    <AccordionContent className='border-0 border-b border-solid border-secondary-300'>
      {children}
    </AccordionContent>
  </AccordionItem>
);
