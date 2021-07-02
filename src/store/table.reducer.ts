import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

export type Modal = {
  contractAddress?: string;
  data?: any;
};

interface IModal {
  data: Modal;
}

type ModalPayload = {
  contractAddress: string;
  data?: any;
};

const initialState = {
  data: {
    contractAddress: undefined,
    data: {},
  },
} as IModal;

export const tableReducer = createSlice({
  name: 'table',
  initialState,
  reducers: {
    openTable: (state, {payload}: PayloadAction<ModalPayload>) => {
      state.data.contractAddress = payload.contractAddress;
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
