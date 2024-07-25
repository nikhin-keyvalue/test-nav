'use client';

import { createContext } from 'react';

const MenuBarContext = createContext<{
  isVisible: boolean;
  toggleMenuBar: () => void;
}>({
  isVisible: false,
  toggleMenuBar: () => {},
});

export default MenuBarContext;
