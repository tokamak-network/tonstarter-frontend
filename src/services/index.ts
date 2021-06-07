import {TransactionResponse} from '@ethersproject/providers';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {REACT_APP_STAKE_VAULT_FACTORY} from '../constants/index';
import * as StakeVault from './abis/Stake1Vault.json';
import {getContract} from '../utils/contract';

export const ClaimStake = createAsyncThunk(
  'stake/claimStake',
  async ({account, value, library}: any, {rejectWithValue}) => {
    try {
      const stakeVault = await getContract(
        REACT_APP_STAKE_VAULT_FACTORY,
        StakeVault.abi,
        library,
      );
      const canClaim = await stakeVault?.canClaim(account, value);
      if (canClaim) {
        const transaction: TransactionResponse = await stakeVault?.claim(
          account,
          value,
        );
        await transaction.wait(2); // wait for 2 confirmations
      } else {
        rejectWithValue('Unable to claim funds');
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
