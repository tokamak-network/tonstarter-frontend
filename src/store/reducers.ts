import { airdropReducer } from './../components/Airdrop/airdrop.reducer';
import {combineReducers} from '@reduxjs/toolkit';
import {stakeReducer} from 'pages/Staking/staking.reducer';
import {appReducer} from './app/app.reducer';
import {toastReducer} from './app/toast.reducer';
import {userReducer} from './app/user.reducer';
import {modalReducer} from './modal.reducer';
import {tableReducer} from './table.reducer';
import {txReducer} from './tx.reducer';
import {stakeDetailReducer} from 'pages/Staking/stakingDetail.reducer';

const rootReducer = combineReducers({
  stakes: stakeReducer.reducer,
  stakesDetail: stakeDetailReducer.reducer,
  appConfig: appReducer.reducer,
  airdrop: airdropReducer.reducer,
  user: userReducer.reducer,
  toast: toastReducer.reducer,
  modal: modalReducer.reducer,
  table: tableReducer.reducer,
  tx: txReducer.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
