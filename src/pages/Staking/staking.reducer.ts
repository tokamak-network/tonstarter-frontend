import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import {BigNumber} from 'ethers';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import {formatEther} from '@ethersproject/units';

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
  async ({contract, library}: any, {requestId, getState}) => {
    let projectsList: any[] = [];

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    if (contract) {
      const vaults = await contract.vaultsOfPahse(1);
      // stakeVaults = await Promise.all(
      //   vaults.map(async (vault: any) => {
      const stakeVault = await getContract(vaults[0], StakeVault.abi, library);
      // const stakeType = await stakeVault?.stakeType();
      // const token = await stakeVault.paytoken();
      const stakeList: string[] = await stakeVault?.stakeAddressesAll();
      projectsList = await Promise.all(
        stakeList.map(async (item, index) => {
          let info = await stakeVault.stakeInfos(item);

          const stakeInfo: Partial<Stake> = {
            stakeContract: stakeList,
            name: info[0],
            saleStartBlock: 0,
            stakeStartBlock: info[1],
            stakeEndBlock: info[2],
            balance: formatEther(info[3]),
            totalRewardAmount: formatEther(info[4]),
            claimRewardAmount: formatEther(info[5]),
            totalStakers: 0,
          };

          return stakeInfo;
        }),
      );
      // const vaultInfo: Partial<Stake> = {
      //   paytoken: token,
      //   cap: utils.formatEther(await stakeVault.cap()),
      //   saleStartBlock: (await stakeVault.saleStartBlock()).toString(),
      //   stakeStartBlock: (await stakeVault.stakeStartBlock()).toString(),
      //   blockTotalReward: (await stakeVault.blockTotalReward()).toString(),
      //   saleClosed: await stakeVault.saleClosed(),
      //   contractAddress: vault,
      //   defiAddr: await stakeVault.defiAddr(),
      // };
      // if (token !== ZERO_ADDRESS) {
      //   const erc20Token = await getContract(token, IERC20.abi, library);
      //   vaultInfo.name = await erc20Token.name();
      //   vaultInfo.symbol = await erc20Token.symbol();
      // } else {
      //   vaultInfo.name = 'Unknown Token';
      //   vaultInfo.symbol = '';
      // }
      //   }),
      // );
    }
    return projectsList;
  },
);

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
