import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {convertNumber} from 'utils/number';
import store from 'store';
import {fetchStakeURL} from 'constants/index';
import {BASE_PROVIDER} from 'constants/index';
import {Stake} from './types';
import {checkL2Status} from './utils';

interface StakeState {
  data: Stake[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({library, reFetch}: any, {requestId, getState}) => {
    //result to dispatch data for Stakes store
    let projects: any[] = [];

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const stakeReq = await fetch(fetchStakeURL)
      .then((res) => res.json())
      .then((result) => result);

    const stakeList = stakeReq.datas;

    const currentBlock = await BASE_PROVIDER.getBlockNumber();

    const vaultsData = store.getState().vaults.data;

    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        let mystaked: string = '';

        const status = await getStatus(stake, currentBlock);
        //@ts-ignore
        const {saleClosed, period} = vaultsData[stake.vault];
        const periodKey = String(stake.stakeContract).toLowerCase();
        const stakePeriod = period[periodKey];
        const res =
          stakePeriod === undefined
            ? '0.0'
            : stakePeriod.includes('year')
            ? '100.' + stakePeriod
            : stakePeriod.includes('month')
            ? '10.' + stakePeriod
            : stakePeriod;

        const L2status = await checkL2Status(stake.stakeContract, library);

        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          totalStakers: stake.totalStakers,
          mystaked: convertNumber({
            amount: mystaked,
          }),
          myearned: convertNumber({
            amount: stake.claimedAmount,
          }),
          stakeBalanceTON: convertNumber({
            amount: stake.totalStakedAmountString,
          }),
          token: stake.paytoken,
          stakeType: stake.stakeType,
          period: res,
          saleStartTime: stake.saleStartBlock,
          saleEndTime: stake.startBlock,
          miningStartTime: stake.startBlock,
          miningEndTime: stake.endBlock,
          fetchBlock: currentBlock,
          status,
          library,
          vault: stake.vault,
          saleClosed,
          ept: getEarningPerTon(vaultsData, stake.vault, stake.endBlock),
          L2status,
        };
        projects.push(stakeInfo);
      }),
    );

    const finalStakeList: any = [];

    //sort by api data
    stakeList.map((stake: any) => {
      projects.map((project, index) => {
        if (stake.name === project.name) {
          return finalStakeList.push(project);
        }
        return null;
      });
      return null;
    });

    return finalStakeList;
  },
);

const getEarningPerTon = (
  vaultsData: any,
  valutAddress: any,
  stakeEndBlock: any,
) => {
  let result = '';
  vaultsData[valutAddress].res.map((project: string) => {
    if (Number(Object.keys(project).toString()) === stakeEndBlock) {
      result = project[stakeEndBlock];
    }
    return result;
  });
  if (
    Number(result) === Infinity ||
    isNaN(Number(result)) === true ||
    result === ''
  ) {
    return undefined;
  }
  return Number.parseFloat(result).toFixed(2);
};

const getStatus = async (args: any, blockNumber: number) => {
  if (blockNumber === 0) {
    return 'loading';
  }
  const {startBlock, endBlock} = args;
  const currentBlock = blockNumber;
  if (currentBlock < startBlock) {
    return 'sale';
  }
  if (currentBlock >= startBlock && currentBlock <= endBlock) {
    return 'start';
  }
  return 'end';
};

export const stakeReducer = createSlice({
  name: 'stakes',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStakes.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchStakes.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStakes.rejected.type]: (state, action) => {
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
export const selectStakes = (state: RootState) => state.stakes;
