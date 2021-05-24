import {combineReducers} from '@reduxjs/toolkit';
import {stakeReducer} from 'pages/Staking/staking.reducer';
import {appReducer} from './app/app.reducer';

const rootReducer = combineReducers({
  stakes: stakeReducer.reducer,
  appConfig: appReducer.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
