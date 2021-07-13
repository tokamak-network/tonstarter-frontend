import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
// import {getRPC} from 'utils/contract';
// import {period} from 'utils';
// import {TokenType} from 'types/index';
// import {convertNumber} from 'utils/number';
import { getTokamakContract } from '../../utils/contract';
// import {BigNumber, ethers} from 'ethers';

// const rpc = getRPC();

export type Airdrop = {
  unclaimedInfo: string;
  airdropInfo: Array<Object>;
};

interface AirdropState {
  data: Airdrop[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as AirdropState;

export const fetchAirdrop = createAsyncThunk(
  'airdrop/all',
  async ({library, account, chainId, reFetch}: any, {requestId, getState}: any) => {

    const {currentRequestId, loading} = getState().airdrop;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    // const currentBlock = await rpc.getBlockNumber();
    const AirdropVault = getTokamakContract('Airdrop');
    let unclaimedInfos;
    
    const tgeCount = await AirdropVault.totalTgeCount();
    let roundInfo: any = [];
    for (let i=1; i <= tgeCount; i++) {
      await Promise.all([
        AirdropVault.getTgeInfos(i)
      ]).then((result) => {
        const airdropInfo = {
          roundNumber: i,
          allocatedAmount: result[0].allocatedAmount.toString()
        }
        roundInfo.push(airdropInfo);
      });
    }
    // console.log(roundInfo);
    
    // try {
    //   unclaimedInfos = await AirdropVault.unclaimedInfos();
    //   tgeInfo = await AirdropVault.getTgeInfos(1);
    //   totalAmount = await AirdropVault.totalAllocatedAmount();
    //   const tgeCount = await AirdropVault.totalTgeCount();
    //   const startTime = await AirdropVault.startTime();
    //   const periodTimesPerClaim = await AirdropVault.periodTimesPerCliam();
    //   const endTime = await AirdropVault.endTime();
      
    //   console.log(tgeCount.toString())
    //   console.log(totalAmount.toString())

    //   console.log(periodTimesPerClaim.toString());
    //   console.log(endTime.toString())
    //   console.log(startTime.toString());
      
    //   console.log(tgeInfo.started);
    //   console.log(tgeInfo.amount.toString());
    //   console.log(tgeInfo.allocatedAmount.toString())
    //   // console.log(allocated.toString())
    // } catch (err) {
    //   console.log(err);
    // }


    const airdropInfo: Partial<Airdrop> = {
      unclaimedInfo: unclaimedInfos,
      airdropInfo: roundInfo,
    }

    return airdropInfo;
  },
);

export const airdropReducer = createSlice({
  name: 'airdrop',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAirdrop.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchAirdrop.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchAirdrop.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  }
});
// @ts-ignore
export const selectAirdrop = (state: RootState) => state.airdrop;
