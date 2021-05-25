import {combineReducers} from '@reduxjs/toolkit';
import {stakeReducer} from 'pages/Staking/staking.reducer';
import {appReducer} from './app/app.reducer';
import {userReducer} from './app/user.reducer';

const rootReducer = combineReducers({
  stakes: stakeReducer.reducer,
  appConfig: appReducer.reducer,
  user: userReducer.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
