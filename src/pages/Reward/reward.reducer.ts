import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {fetchRewardsURL} from 'constants/index';
import { any } from 'prop-types';

type Reward = {
    chainId: Number, 
    poolName: String,
    poolAddress: String,
    rewardToken: String,
    incentiveKey: Object,
    startTime: Number,
    endTime: Number,
    allocatedReward: String,
    numStakers: Number,
    status: String
}

interface RewardState{ 
    data: Reward[];
    loading: 'idle' | 'pending';
    error: any;
    currentRequestId?: string;
}

const initialState = {
    data: [],
    loading: 'idle',
    error: null,
    currentRequestId: undefined,
  } as RewardState

  export const fetchRewards = createAsyncThunk(
      'app/rewards',
       // @ts-ignore
  async ({chainId}: any, {requestId, getState}) => {
    //@ts-ignore
    const {currentRequestId, loading} = getState().rewards;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const rewardReq = await fetch(fetchRewardsURL)
    .then((res) => res.json())
    .then((result) => result);
    const rewardData = rewardReq.datas;
    console.log('rewardData', rewardData);
    return rewardData;
} 
  )

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
          state.data = action.payload;
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
    }
  })
  
  // @ts-ignore
  export const selectRewards = (state: RootState) => state.rewards;