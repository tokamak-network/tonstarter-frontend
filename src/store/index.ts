import {configureStore, Action, getDefaultMiddleware} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {ThunkAction} from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, {RootState} from 'store/reducers';

const middleware = [...getDefaultMiddleware(), logger];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

export default store;
