import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import {formatEther} from 'ethers/lib/utils';
import {ZERO_ADDRESS} from 'constants/index';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as IERC20 from 'services/abis/IERC20.json';

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  cap: string;
  saleStartBlock: string;
  stakeStartBlock: string;
  stakeEndBlock: string;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  defiAddr: string;
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
    let stakeVaults: any[] = [];

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    if (contract) {
      const vaults = await contract.vaultsOfPahse(1);
      stakeVaults = await Promise.all(
        vaults.map(async (vault: any) => {
          const stakeVault = await getContract(vault, StakeVault.abi, library);
          console.log(stakeVault);
          const token = await stakeVault.paytoken();
          const vaultInfo: Partial<Stake> = {
            paytoken: token,
            cap: formatEther(await stakeVault.cap()),
            saleStartBlock: (await stakeVault.saleStartBlock()).toString(),
            stakeStartBlock: (await stakeVault.stakeStartBlock()).toString(),
            blockTotalReward: (await stakeVault.blockTotalReward()).toString(),
            saleClosed: await stakeVault.saleClosed(),
            contractAddress: vault,
            defiAddr: await stakeVault.defiAddr(),
          };
          if (token !== ZERO_ADDRESS) {
            const erc20Token = await getContract(token, IERC20.abi, library);
            vaultInfo.name = await erc20Token.name();
            vaultInfo.symbol = await erc20Token.symbol();
          } else {
            vaultInfo.name = 'Unknown Token';
            vaultInfo.symbol = '';
          }

          return vaultInfo;
        }),
      );
    }
    return stakeVaults;
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
export const selectStake = (selectState: any, stake: any) => stake;
