import {combineReducers} from '@reduxjs/toolkit';
import {stakeReducer} from 'pages/Staking/staking.reducer';
import {appReducer} from './app/app.reducer';
import {toastReducer} from './app/toast.reducer';
import {userReducer} from './app/user.reducer';
import {modalReducer} from './modal.reducer';
import {tableReducer} from './table.reducer';

const rootReducer = combineReducers({
  stakes: stakeReducer.reducer,
  appConfig: appReducer.reducer,
  user: userReducer.reducer,
  toast: toastReducer.reducer,
  modal: modalReducer.reducer,
  table: tableReducer.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
