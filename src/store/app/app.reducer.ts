import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DEFAULT_NETWORK} from 'constants/index';
import {RootState} from 'store/reducers';
import {
  getExplorerLink,
  getExplorerTxnLink,
  getNetworkName,
  getBlockNumber,
  getUniswapPoolLink,
} from 'utils';

export type AppConfig = {
  selectedNetwork: string;
  explorerTxnLink: string;
  explorerLink: string;
  blockNumber: number;
  uniswapPoolLink: string;
};

interface IAppInit {
  data: AppConfig;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {
    selectedNetwork: '',
    explorerLink: '',
    blockNumber: 0,
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IAppInit;

export const fetchAppConfig = createAsyncThunk(
  'app/config',
  async ({chainId}: any, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().appConfig;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const appConfig: AppConfig = {
      explorerTxnLink: await getExplorerTxnLink(chainId || DEFAULT_NETWORK),
      explorerLink: await getExplorerLink(chainId || DEFAULT_NETWORK),
      selectedNetwork: await getNetworkName(chainId || DEFAULT_NETWORK),
      blockNumber: await getBlockNumber(chainId || DEFAULT_NETWORK),
      uniswapPoolLink: await getUniswapPoolLink(chainId || DEFAULT_NETWORK),
    };

    return appConfig;
  },
);

export const appReducer = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAppConfig.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchAppConfig.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchAppConfig.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export const selectApp = (state: RootState) => state.appConfig;
export const selectExplorerLink = (state: RootState) =>
  state.appConfig.data.explorerLink;
export const selectNetwork = (state: RootState) =>
  state.appConfig.data.selectedNetwork;
