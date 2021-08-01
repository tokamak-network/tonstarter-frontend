import {combineReducers} from '@reduxjs/toolkit';
import {stakeReducer} from 'pages/Staking/staking.reducer';
import {appReducer} from './app/app.reducer';
import {toastReducer} from './app/toast.reducer';
import {userReducer} from './app/user.reducer';
import {modalReducer} from './modal.reducer';
import {tableReducer} from './table.reducer';
import {txReducer} from './tx.reducer';
import {vaultReducer} from 'pages/Staking/vault.reducer';
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import application from './application/reducer'
import lists from './lists/reducer'
import userSwap from './userSwap/reducer'

const rootReducer = combineReducers({
  stakes: stakeReducer.reducer,
  vaults: vaultReducer.reducer,
  appConfig: appReducer.reducer,
  user: userReducer.reducer,
  toast: toastReducer.reducer,
  modal: modalReducer.reducer,
  table: tableReducer.reducer,
  tx: txReducer.reducer,
  multicall,
  swap,
  application,
  lists,
  userSwap,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
