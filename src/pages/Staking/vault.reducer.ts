import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {convertNumber} from 'utils/number';

type Vault = {
  // address: AddressDetail;
  // tosBalance: string;
  cap: number;
  stakeStartBlock: number;
  stakeEndBlock: number;
  expectedStakeEndBlockTotal: [{block: number}];
};

type VaultList = [Vault];

interface IStakeDetail {
  data: Vault;
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

const getEarningPerBlock = (vaults: VaultList) => {
  console.log(vaults);
  const result = vaults.map((e) => {
    const {stakeStartBlock, stakeEndBlock, cap, expectedStakeEndBlockTotal} = e;
    const totalBlocks = stakeEndBlock - stakeStartBlock;
    const totalReward = convertNumber({
      amount: cap.toLocaleString('fullwide', {useGrouping: false}),
    });
    const epb = Number(totalReward) / totalBlocks;
    console.log(totalBlocks, totalReward, epb);
    const dd = expectedStakeEndBlockTotal.map(
      (project: any, index: number) =>
        ((project.block - stakeStartBlock) * epb) /
          expectedStakeEndBlockTotal.length -
        index,
    );
    console.log(dd);
  });
  console.log(result);
  return result;
};

export const fetchVaults = createAsyncThunk(
  'app/vaults',
  // @ts-ignore
  async ({chainId}: any, {requestId, getState}) => {
    console.log('***vault***');
    // @ts-ignore
    const {currentRequestId, loading} = getState().vaults;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const chainIdforFetch = chainId === undefined ? '4' : chainId;
    const fetchValutUrl = `https://api.tokamak.network/v1/vaults?chainId=${chainIdforFetch}`;
    const vaultReq = await fetch(fetchValutUrl)
      .then((res) => res.json())
      .then((result) => result);
    const vaultData = vaultReq.datas;
    console.log(vaultData);

    const result = getEarningPerBlock(vaultData);
    return result;
  },
);

export const vaultReducer = createSlice({
  name: 'vaults',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchVaults.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchVaults.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchVaults.rejected.type]: (state, action) => {
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
export const selectStakes = (state: RootState) => state.vaults;
