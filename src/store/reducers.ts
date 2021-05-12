import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import contractReducer from './features/contract/contractSlice';
const rootReducer = combineReducers({
  user: userReducer,
  contract: contractReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
