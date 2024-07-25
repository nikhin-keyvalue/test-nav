import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { MdOutlineLanguage } from 'react-icons/md';

import LanguageChanger from '@/components/user-details/LanguageChanger';
import { languages } from '@/constants/language';

const LanguageChangeComponent = () => (
  <DropdownMenu>
    <DropdownMenuTrigger className='flex gap-1 text-white'>
      <MdOutlineLanguage size='1.5rem' fill='#B4C2C7' />{' '}
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent>
        <DropdownMenuItem
          style={{ position: 'fixed', top: '-48px', left: '30px' }}
        >
          {languages.map((lang) => (
            <LanguageChanger key={lang} lang={lang} />
          ))}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenu>
);

export default LanguageChangeComponent;
