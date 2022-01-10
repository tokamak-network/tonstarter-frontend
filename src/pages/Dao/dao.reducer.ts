import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {LibraryType} from 'types/index';
import {TosStakeList, ClaimList} from './types/index';
import {getTosStakeList} from './utils/getTosStakeList';
import {getClaimalbeList} from './actions';

interface TosStakeState {
  data: {
    tosStakeList: TosStakeList[];
    claimList: ClaimList[];
  };
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

type FetchTosStakes = {
  account: string;
  library: LibraryType;
  chainId: number;
};

const initialState = {
  data: {
    tosStakeList: [],
    claimList: [],
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as TosStakeState;

export const fetchTosStakes = createAsyncThunk(
  'dao/tosStakesAll',
  async (
    {account, library, chainId}: FetchTosStakes,
    {requestId, getState},
  ) => {
    const {currentRequestId, loading} = (getState as any)().dao;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    //tos stake
    const tosStakeList = await getTosStakeList({account, library});

    //claim
    const claimList = await getClaimalbeList({account, library});
    return {tosStakeList, claimList: claimList || []};
  },
);

export const daoReducer = createSlice({
  name: 'dao',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTosStakes.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchTosStakes.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchTosStakes.rejected.type]: (state, action) => {
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
export const selectDao = (state: RootState) => state.dao;
