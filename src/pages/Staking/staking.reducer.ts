import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getTokamakContract, getRPC} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {formatEther} from '@ethersproject/units';
import {period} from 'utils';
import {REACT_APP_TOKAMAK_LAYER2} from 'constants/index';
import {TokenType} from 'types/index';
import {convertNumber} from 'utils/number';

const rpc = getRPC();

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
    // let iERC20: any;

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

    // console.log('-----------api-----------');
    // console.log(vaultReq);
    // console.log(stakeList);

    const currentBlock = await rpc.getBlockNumber();

    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        let mystaked: string = '';
        let myearned: string = '';

        const status = await getStatus(stake, currentBlock);

        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          totalStakers: stake.totalStakers,
          mystaked: convertNumber({
            amount: mystaked,
          }),
          myearned: convertNumber({
            amount: myearned,
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

export const fetchManageModalPayload = async (
  library: any,
  account: string,
  contractAddress: string,
  vaultAddress: string,
) => {
  const res = await getUserInfoForManage(
    library,
    account,
    contractAddress,
    vaultAddress,
  );
  return res;
};

const getUserInfoForManage = async (
  library: any,
  account: string,
  contractAddress: string,
  vaultAddress: string,
) => {
  const currentBlock = getRPC().getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const L2Contract = getTokamakContract('TokamakLayer2');
  // const Vault = getTokamakContract('Vault', vaultAddress);
  const TON = getTokamakContract('TON');
  const WTON = getTokamakContract('WTON');
  const depositManager = getTokamakContract('DepositManager');
  const seigManager = getTokamakContract('SeigManager');
  // try {
  //   const Airdrop = getTokamakContract('Airdrop')
  //   console.log(Airdrop);
  // } catch (err) {
  //   console.log(err)
  // }
  // IIStake1Vault(vault).saleClosed()

  return Promise.all([
    StakeTONContract?.userStaked(account),
    L2Contract?.stakedOf(account),
    StakeTONContract.totalStakedAmount(),
    seigManager.stakeOf(REACT_APP_TOKAMAK_LAYER2, contractAddress),
    depositManager.pendingUnstaked(REACT_APP_TOKAMAK_LAYER2, contractAddress),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
    StakeTONContract.canRewardAmount(account, currentBlock),
    depositManager.globalWithdrawalDelay(),
  ])
    .then((result) => {
      return {
        userRewardTOS: formatEther(result[0].claimedAmount),
        userWithdraw: formatEther(result[0].releasedAmount),
        userStakedAmount: convertNumber({
          amount: result[1],
          type: 'ray',
        }),
        totalStakedAmount: convertNumber({
          amount: result[2],
        }),
        totalStakedAmountL2: convertNumber({
          amount: result[3],
          type: 'ray',
        }),
        totalPendingUnstakedAmountL2: convertNumber({
          amount: result[4],
          type: 'ray',
        }),
        stakeContractBalanceWton: convertNumber({
          amount: result[5],
          type: 'ray',
        }),
        stakeContractBalanceTon: convertNumber({
          amount: result[6],
        }),
        canRewardAmount: convertNumber({
          amount: result[7],
        }),
        globalWithdrawalDelay: result[8].toString(),
      };
    })
    .catch((e) => console.log(e));
};

export const getStatus = async (args: any, blockNumber: number) => {
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
