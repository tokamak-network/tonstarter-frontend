import {configureStore, Action, getDefaultMiddleware} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {ThunkAction} from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, {RootState} from './reducers';

let middleware: any[] = [];

// disable redux logger on production
if (process.env.NODE_ENV !== 'production') {
  middleware = [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    logger,
  ];
} else {
  middleware = [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ];
}

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production' ? true : false, // disable devtools on production
});

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

export default store;
