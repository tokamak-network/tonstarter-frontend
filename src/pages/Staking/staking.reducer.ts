import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import {BigNumber} from 'ethers';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as IERC20 from 'services/abis/IERC20.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as tonABI from 'services/abis/TON.json';
import * as fldABI from 'services/abis/FLD.json';
import {formatEther} from '@ethersproject/units';
import {period, formatStartTime, formatEndTime} from 'utils/timeStamp';
import {REACT_APP_TON, REACT_APP_FLD} from 'constants/index';
export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  cap: string;
  saleStartBlock: string | number;
  stakeStartBlock: string | number;
  stakeEndBlock: string | number;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  defiAddr: string;
  stakeContract: string[];
  balance: BigNumber | string;
  totalRewardAmount: BigNumber | string;
  claimRewardAmount: BigNumber | string;
  totalStakers: number | string;
  token: {
    address: string;
    name: string;
    symbol: string;
  };
  myton: BigNumber | string;
  myfld: BigNumber | string;
  mystaked: BigNumber | string;
  mywithdraw: BigNumber | string;
  myclaimed: BigNumber | string;
  canRewardAmount: BigNumber | string;
  stakeBalanceTON: BigNumber | string;
  stakeBalanceETH: BigNumber | string;
  stakeBalanceFLD: BigNumber | string;
  tokamakStaked: BigNumber | string;
  tokamakPendingUnstaked: BigNumber | string;
  staketype: string;
  period: string | number;
  startTime: string;
  endTime: string;
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
  async ({contract, library, account}: any, {requestId, getState}) => {
    let stakeVaults: any[] = [];
    let stakeList: any;

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    if (contract) {
      const vaults = await contract.vaultsOfPahse(1);
      stakeList = await Promise.all(
        vaults.map(async (vault: any) => {
          const stakeVault = await getContract(vault, StakeVault.abi, library);
          const stakeType = await stakeVault?.stakeType();
          const token = await stakeVault.paytoken();
          const iERC20 = await getContract(token, IERC20.abi, library);
          // const stakeList: string[] = await stakeVault?.stakeAddressesAll();
          return {
            iERC20: iERC20,
            stakeType: stakeType,
            stakeList: await stakeVault?.stakeAddressesAll(),
            stakeVault,
            token,
          };
        }),
      );

      stakeVaults = await Promise.all(
        stakeList[0].stakeList.map(async (item: any) => {
          let info = await stakeList[0].stakeVault.stakeInfos(item);

          const startTime = await formatStartTime(info[1]);
          const endTime = await formatEndTime(info[1], info[2]);

          const stakeInfo: Partial<Stake> = {
            contractAddress: item,
            name: info[0],
            saleStartBlock: 0,
            stakeStartBlock: info[1],
            stakeEndBlock: info[2],
            balance: formatEther(info[3]),
            totalRewardAmount: formatEther(info[4]),
            claimRewardAmount: formatEther(info[5]),
            totalStakers: 0,
            myton: formatEther(0),
            myfld: formatEther(0),
            mystaked: formatEther(0),
            mywithdraw: formatEther(0),
            myclaimed: formatEther(0),
            canRewardAmount: formatEther(0),
            stakeBalanceTON: formatEther(0),
            stakeBalanceETH: formatEther(0),
            stakeBalanceFLD: formatEther(0),
            tokamakStaked: formatEther(0),
            tokamakPendingUnstaked: formatEther(0),
            token: {
              address: stakeList[0].token,
              name: await stakeList[0].iERC20?.name(),
              symbol: await stakeList[0].iERC20?.symbol(),
            },
            stakeType: stakeList[0].stakeType,
            period: period(info[1], info[2]),
            startTime: startTime,
            endTime: endTime,
          };
          // await getMy(stakeInfo, stakeList[0], library, account);
          return stakeInfo;
        }),
      );
    }

    return stakeVaults;
  },
);

const getMy = async (
  stakeInfo: Partial<Stake>,
  stakeContractAddress: string,
  library: any,
  account: string,
) => {
  const TON = await getContract(REACT_APP_TON, tonABI.abi, library);
  const myTON = await TON?.balanceOf(account);
  stakeInfo.myton = formatEther(myTON);
  const FLD = await getContract(REACT_APP_FLD, fldABI.abi, library);
  const myFLD = await FLD?.balanceOf(account);
  stakeInfo.myfld = formatEther(myFLD);

  const StakeTONContract = await getContract(
    stakeContractAddress,
    StakeTON.abi,
    library,
  );
  stakeInfo.saleStartBlock = await StakeTONContract?.saleStartBlock();
  const staked = await StakeTONContract?.userStaked(account);

  stakeInfo.mystaked = formatEther(staked.amount);
  stakeInfo.myclaimed = formatEther(staked.claimedAmount);
  stakeInfo.mywithdraw = formatEther(staked.releasedAmount);
  const total = await StakeTONContract?.totalStakers();
  stakeInfo.totalStakers = total.toString();
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

export const selectStakes = (state: RootState) => state.stakes;
