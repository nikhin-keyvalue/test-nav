'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';

import MenuBarContext from './MenuBarContext';

const MenuBarContextProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleMenuBar = useCallback(() => {
    setIsVisible((value) => !value);
  }, []);

  const providerValue = useMemo(
    () => ({
      isVisible,
      toggleMenuBar,
    }),
    [isVisible, toggleMenuBar]
  );

  return (
    <MenuBarContext.Provider value={providerValue}>
      {children}
    </MenuBarContext.Provider>
  );
};

export default MenuBarContextProvider;
