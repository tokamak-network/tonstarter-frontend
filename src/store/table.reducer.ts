import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

export type Modal = {
  contractAddress?: string;
  index: number | undefined;
  data?: any;
};

interface IModal {
  data: Modal;
}

type ModalPayload = {
  contractAddress: string;
  index: number;
  data?: any;
};

const initialState = {
  data: {
    contractAddress: undefined,
    index: undefined,
    data: {},
  },
} as IModal;

export const tableReducer = createSlice({
  name: 'table',
  initialState,
  reducers: {
    openTable: (state, {payload}: PayloadAction<ModalPayload>) => {
      state.data.contractAddress = payload.contractAddress;
      state.data.index = payload.index;
      state.data.data = payload.data;
    },
    closeTable: (state) => {
      state.data.contractAddress = undefined;
      state.data.data = {};
    },
  },
});

export const selectTableType = (state: RootState) => state.table;
export const {openTable, closeTable} = tableReducer.actions;
