import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

export type ModalType = string;

export type Modal = {
  modal?: ModalType;
  data?: any;
};

interface IModal {
  data: Modal;
}

type ModalPayload = {
  type: ModalType;
  data?: any;
};

const initialState = {
  data: {
    modal: undefined,
    data: {},
  },
} as IModal;

export const tableReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openTable: (state, {payload}: PayloadAction<ModalPayload>) => {
      state.data.modal = payload.type;
      state.data.data = payload.data;
    },
    closeTable: (state) => {
      state.data.modal = undefined;
      state.data.data = {};
    },
  },
});

export const selectModalType = (state: RootState) => state.modal;
export const {openTable, closeTable} = tableReducer.actions;
