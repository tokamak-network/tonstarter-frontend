import {combineReducers} from '@reduxjs/toolkit';
import {stakeReducer} from 'pages/Staking/staking.reducer';
import {rewardReducer} from 'pages/Reward/reward.reducer';
import {daoReducer} from 'pages/Dao/dao.reducer';
import {appReducer} from './app/app.reducer';
import {toastReducer} from './app/toast.reducer';
import {userReducer} from './app/user.reducer';
import {modalReducer} from './modal.reducer';
import {tableReducer} from './table.reducer';
import {txReducer} from './tx.reducer';
import {refetchReducer} from './refetch.reducer';
import {vaultReducer} from 'pages/Staking/vault.reducer';
import mintV3 from './mint/v3/reducer'
import { api as dataApi } from './data/slice'

const rootReducer = combineReducers({
  stakes: stakeReducer.reducer,
  vaults: vaultReducer.reducer,
  appConfig: appReducer.reducer,
  user: userReducer.reducer,
  rewards: rewardReducer.reducer,
  toast: toastReducer.reducer,
  modal: modalReducer.reducer,
  table: tableReducer.reducer,
  tx: txReducer.reducer,
  refetch: refetchReducer.reducer,
  dao: daoReducer.reducer,
  mintV3: mintV3,
  [dataApi.reducerPath]: dataApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
