import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';

// const {TON_ADDRESS} = DEPLOYED;

export type User = {
  address: string;
  library: any;
  // tosBalance: string;
};

interface IUser {
  data: User;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IUser;

export const fetchUserInfo = createAsyncThunk(
  'app/user',
  // @ts-ignore
  async ({address, library, reset}, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().user;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    if (reset) {
      return initialState;
    }

    const user: User = {
      address,
      library,
      //@ts-ignore
      // balance: tonBalance !== undefined ? formatEther(tonBalance) : '0',
      // tosBalance: tosBalance !== undefined ? formatEther(tosBalance) : '0',
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
