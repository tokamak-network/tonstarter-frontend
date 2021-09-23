// export const fetchTosStakes = () => {
//   return null;
// };

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {fetchStarterURL} from 'constants/index';
import { any } from 'prop-types';

type Starter = {
  projectid: Number,
  chainId: Number,
  name: String,
  symbol: String,
  tokenAddress: String,
  saleAddress: String,
  creator: String,
  status: String, //temp
  priority: String, //temp
  totalSupply: String,
  fundingToken: String,
  description: String,
  saleStart: Number,
  saleEnd: Number,
  tierAllocation: String,
  ratio: String,
  tokenAllocation: String,
  minAllocation: String,
  maxAllocation: String,
  stakedToken: String,
  stakedPeriod: String,
  website: String,
  telegram: String,
  medium: String,
  twitter: String,
  discord: String,
  del: Boolean,
	production: Boolean,
}

interface StarterState {
  data: Starter[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StarterState

export const fetchStarters = createAsyncThunk(
  'app/starters',
  // @ts-ignore
  async ({chainId}: any, {requestId, getState}) => {
    //@ts-ignore
    const {currentRequestId, loading} = getState().starters;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const starterReq = await fetch(fetchStarterURL)
      .then((res) => res.json())
      .then((result) => result);
    const starterData = starterReq.datas;
    console.log(starterData)
    return starterData
  }
)

export const starterReducer = createSlice({
  name: 'starter',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStarters.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchStarters.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStarters.rejected.type]: (state, action) => {
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
export const selectStarters = (state: RootState) => state.starters;