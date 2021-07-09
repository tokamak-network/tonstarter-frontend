import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';

type AddressDetail = {
  myStaked: number;
  myEarned: number;
  totalStaker: number;
};

type StakeDetail = {
  address: AddressDetail;
  // tosBalance: string;
};

interface IStakeDetail {
  data: StakeDetail;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {},
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IStakeDetail;

export const fetchStakesDetail = createAsyncThunk(
  'app/stakeDetail',
  // @ts-ignore
  async ({account, library, reset}, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().stakeDetail;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    // const userInfo = await fetchUserData({library, account, contractAddress});

    return {};
  },
);

export const stakeDetailReducer = createSlice({
  name: 'stakesDetail',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStakesDetail.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchStakesDetail.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStakesDetail.rejected.type]: (state, action) => {
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
export const selectStakeDetail = (state: RootState) => state.stakesDetail;
// @ts-ignore
export const selectStakeDetailData = (state: RootState) =>
  state.stakesDetail.data;
