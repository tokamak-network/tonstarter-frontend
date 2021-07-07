import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

export type TxType = {
  tx: boolean;
  data?: any;
};

type ModalPayload = {
  tx: boolean;
  data?: any;
};

const initialState = {
  tx: false,
  data: {},
} as TxType;

export const txReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setTxPending: (state, {payload}: PayloadAction<ModalPayload>) => {
      state.tx = payload.tx;
      state.data = payload.data;
    },
  },
});

export const selectTxType = (state: RootState) => state.tx;
export const {setTxPending} = txReducer.actions;
