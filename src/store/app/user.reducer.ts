import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import * as ERC20 from 'services/abis/ERC20.json';
import {REACT_APP_TON} from 'constants/index';
import {formatEther} from '@ethersproject/units';

export type User = {
  balance: string;
};

interface IUser {
  data: User;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {
    balance: '0',
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IUser;

export const fetchUserInfo = createAsyncThunk(
  'app/user',
  // @ts-ignore
  async ({address, library}, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const contract = getContract(REACT_APP_TON, ERC20.abi, library);

    let user: User = {
      balance: formatEther(await contract.balanceOf(address)),
    };

    return user;
  },
);

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUserInfo.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchUserInfo.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchUserInfo.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

// @ts-ignore
export const selectUser = (state: RootState) => state.user;
// @ts-ignore
export const selectBalance = (state: RootState) => state.user.data.balance;
