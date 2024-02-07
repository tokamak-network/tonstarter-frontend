import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {fetchRewardsURL} from 'constants/index';
import {interfaceReward} from './types';
import {rewardDB} from 'constants/db';

interface RewardState {
  datas: interfaceReward[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  datas: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as RewardState;

export const fetchRewards = createAsyncThunk(
  'app/rewards',
  // @ts-ignore
  async ({chainId}: any, {requestId, getState}) => {
    /**
     * fetch through api
     */
    // //@ts-ignore
    // const {currentRequestId, loading} = getState().rewards;
    // if (loading !== 'pending' || requestId !== currentRequestId) {
    //   return;
    // }

    // const rewardReq = await fetch(fetchRewardsURL)
    //   .then((res) => res.json())
    //   .then((result) => result);
    // const rewardData = rewardReq.datas;
    const rewardData = rewardDB;
    return rewardData;
  },
);

export const rewardReducer = createSlice({
  name: 'rewards',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchRewards.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchRewards.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.datas = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchRewards.rejected.type]: (state, action) => {
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
export const selectRewards = (state: RootState) => state.rewards;
