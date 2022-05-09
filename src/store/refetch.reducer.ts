import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

type TsType = undefined | 'Staking' | 'Dao' | 'Pool' | 'Reward' | 'Admin'| 'Launch';

export type TxType = {
  transactionType: TsType;
  blockNumber: undefined | number;
  data?: any;
};

const initialState = {
  transactionType: undefined,
  blockNumber: undefined,
  data: {},
} as TxType;

export const refetchReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setTransaction: (state, {payload}: PayloadAction<TxType>) => {
      state.transactionType = payload.transactionType;
      state.blockNumber = payload.blockNumber;
      state.data = payload.data;
    },
  },
});

export const selectTransactionType = (state: RootState) => state.refetch;
export const {setTransaction} = refetchReducer.actions;
