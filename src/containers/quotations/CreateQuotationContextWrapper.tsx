/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import {
  createQuotationReducer,
  CreateQuotationReducerAction,
  CreateQuotationState,
  initialCreateContextState,
} from './CreateQuotationReducer';

type CreateQuotationContextType = {
  state: CreateQuotationState;
  dispatch: Dispatch<CreateQuotationReducerAction>;
};

const CreateQuotationContext = createContext<CreateQuotationContextType>({
  state: initialCreateContextState,
  dispatch: () => null,
});

export function CreateQuotationContextWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch]: [
    CreateQuotationState,
    Dispatch<CreateQuotationReducerAction>,
  ] = useReducer(createQuotationReducer, initialCreateContextState);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <CreateQuotationContext.Provider value={contextValue}>
      {children}
    </CreateQuotationContext.Provider>
  );
}

export function useCreateQuotationContext() {
  return useContext(CreateQuotationContext);
}
