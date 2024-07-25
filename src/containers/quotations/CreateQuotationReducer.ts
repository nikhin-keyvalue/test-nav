import { PERSON_TYPES } from '@/constants/filter';
import { PersonTypeStrict } from '@/types/api';

import {
  DiscountRequest,
  ILineGroupItem,
  ImageFile,
  QuotationResponse,
  QuotationStatus,
  QuotationVATType,
} from './api/type';
import { ILineGroupItemDesc } from './constants';

// Refactor reducer - assign proper types

export interface CreateQuotationState {
  id?: string;
  name: string;
  status?: QuotationStatus;
  quotationDate: string;
  opportunityType: PersonTypeStrict;
  quotationValidUntil: string;
  opportunity: {
    name: string;
    id: string;
  };
  lineGroupItems: ILineGroupItem[];
  discount?: DiscountRequest;
  vatType?: QuotationVATType;
  totalExclVat?: number;
  vat?: number;
  totalInclVat?: number;
  currentquotationAPIResponse?: QuotationResponse;
  tradeInImageMap: {
    [key: string]: ImageFile;
  };
  quotationAPIResponse?: QuotationResponse;
  groupNameList?: ILineGroupItemDesc[];
  isProcessInProgress: boolean;
  isSubformEditInProgress: boolean;
}

export const initialCreateContextState: CreateQuotationState = {
  id: undefined,
  name: '',
  status: undefined,
  quotationDate: '',
  quotationValidUntil: '',
  opportunity: {
    name: '',
    id: '',
  },
  opportunityType: PERSON_TYPES.PRIVATE,
  lineGroupItems: [],
  discount: undefined,
  vatType: undefined,
  totalExclVat: undefined,
  vat: undefined,
  totalInclVat: undefined,
  currentquotationAPIResponse: undefined,
  tradeInImageMap: {},
  groupNameList: undefined,
  isProcessInProgress: false,
  isSubformEditInProgress: false,
};

/** Reducer Actions */
export enum CreateQuotationReducerActionType {
  INITIAL_API_CALL_ACTION,
  UPDATE_TRADE_IN_IMAGE_MAP,
  SET_GROUP_ITEM_LIST,
  SET_OPPORTUNITY_TYPE,
  SET_IS_PROCESS_IN_PROGRESS,
  SET_IS_SUBFORM_EDIT_IN_PROGRESS,
}

export type InitialAPICallAction = {
  type: CreateQuotationReducerActionType.INITIAL_API_CALL_ACTION;
  payload: QuotationResponse;
};

export type SetIsProcessInProgress = {
  type: CreateQuotationReducerActionType.SET_IS_PROCESS_IN_PROGRESS;
  payload: boolean;
};

export type SetIsSubFormEditInProgess = {
  type: CreateQuotationReducerActionType.SET_IS_SUBFORM_EDIT_IN_PROGRESS;
  payload: boolean;
};

/** Add Action types on the go */
export type CreateQuotationReducerAction =
  | InitialAPICallAction
  | SetIsProcessInProgress
  | SetIsSubFormEditInProgess
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any;

/** Reducer Definition */
export const createQuotationReducer = (
  state: CreateQuotationState,
  action: CreateQuotationReducerAction
) => {
  const { payload, type } = action;
  switch (type) {
    case CreateQuotationReducerActionType.INITIAL_API_CALL_ACTION: {
      return {
        ...state,
        quotationAPIResponse: payload,
      };
    }
    case CreateQuotationReducerActionType.UPDATE_TRADE_IN_IMAGE_MAP: {
      return {
        ...state,
        tradeInImageMap: {
          ...state.tradeInImageMap,
          ...Object.fromEntries(
            payload.map((image: ImageFile) => [image.id, image])
          ),
        },
      };
    }
    case CreateQuotationReducerActionType.SET_GROUP_ITEM_LIST: {
      return {
        ...state,
        groupNameList: payload,
      };
    }
    case CreateQuotationReducerActionType.SET_OPPORTUNITY_TYPE: {
      return {
        ...state,
        opportunityType: payload,
      };
    }
    case CreateQuotationReducerActionType.SET_IS_PROCESS_IN_PROGRESS: {
      return {
        ...state,
        isProcessInProgress: payload,
      };
    }
    case CreateQuotationReducerActionType.SET_IS_SUBFORM_EDIT_IN_PROGRESS: {
      return {
        ...state,
        isSubformEditInProgress: payload,
      };
    }
    default:
      return state;
  }
};
