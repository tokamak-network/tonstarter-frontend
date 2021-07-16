import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getRPC} from 'utils/contract';
import {period} from 'utils';
import {TokenType} from 'types/index';
import {convertNumber} from 'utils/number';
import store from 'store';

const rpc = getRPC();

export type Vault = {};

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  stakeContract: string[];
  balance: Number | string;
  totalRewardAmount: Number | string;
  claimRewardAmount: Number | string;
  totalStakers: number | string;
  token: TokenType;
  withdrawalDelay: string;
  mystaked: Number | string;
  claimableAmount: Number | string;
  myearned: Number | string;
  stakeBalanceTON: string;
  staketype: string;
  period: string;
  status: string;
  library: any;
  account: any;
  fetchBlock: number | undefined;
  saleStartTime: string | undefined;
  saleEndTime: string | undefined;
  miningStartTime: string | undefined;
  miningEndTime: string | undefined;
  vault: string;
  ept: any;
};

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
  async ({library, account, chainId, reFetch}: any, {requestId, getState}) => {
    //result to dispatch data for Stakes store
    let projects: any[] = [];

    const chainIdforFetch = chainId === undefined ? '4' : chainId;
    // const fetchValutUrl = `https://api.tokamak.network/v1/vaults?chainId=${chainIdforFetch}`;
    const fetchStakeUrl = `https://api.tokamak.network/v1/stakecontracts?chainId=${chainIdforFetch}`;

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    // const vaultReq = await fetch(fetchValutUrl)
    //   .then((res) => res.json())
    //   .then((result) => result);

    const stakeReq = await fetch(fetchStakeUrl)
      .then((res) => res.json())
      .then((result) => result);

    const stakeList = stakeReq.datas;
    // const vaultList = vaultReq.datas;

    // console.log('-----------api-----------');
    // console.log(vaultList);
    // console.log(stakeList);

    const currentBlock = await rpc.getBlockNumber();

    const vaultsData = store.getState().vaults.data;
    console.log(stakeList);
    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        let mystaked: string = '';

        const status = await getStatus(stake, currentBlock);
        console.log(stake);
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
          period: period(stake.startBlock, stake.endBlock),
          saleStartTime: stake.saleStartBlock,
          saleEndTime: stake.startBlock,
          miningStartTime: stake.startBlock,
          miningEndTime: stake.endBlock,
          fetchBlock: currentBlock,
          status,
          library,
          account,
          vault: stake.vault,
          saleClosed: stake.saleClosed,
          ept: getEarningPerTon(vaultsData, stake.vault, stake.endBlock),
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
  vaultsData[valutAddress].map((project: string) => {
    if (Number(Object.keys(project).toString()) === stakeEndBlock) {
      result = project[stakeEndBlock];
    }
    return result;
  });
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
