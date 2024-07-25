import { FC } from 'react';

import { LocaleList } from '@/constants/common';

interface Tab {
  id: LocaleList;
  content: string;
}

interface TabSwitchPropsType {
  tabs: Tab[];
  activeTab: LocaleList;
  handleSetActiveTab: (id: LocaleList) => void;
  children: React.ReactNode;
}

const TabSwitch: FC<TabSwitchPropsType> = (props) => {
  const { tabs, activeTab, handleSetActiveTab, children } = props;

  return (
    <div className='flex flex-col'>
      <p className='mb-4 flex gap-2'>
        {tabs?.map((item) =>
          activeTab === item.id ? (
            <span
              className='border-b-2 border-b-primary px-2 font-bold uppercase text-primary'
              key={item.id}
            >
              {item.content}
            </span>
          ) : (
            <span
              className='cursor-pointer px-2 font-bold uppercase'
              key={item.id}
              role='presentation'
              onClick={() => handleSetActiveTab(item.id)}
            >
              {item.content}
            </span>
          )
        )}
      </p>
      {children}
    </div>
  );
};

export default TabSwitch;
