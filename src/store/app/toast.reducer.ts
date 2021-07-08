import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';

export type Toast = {
  title?: string;
  status: string;
  message?: string;
  description?: string;
  duration?: number;
  isClosable: boolean;
};

interface IToast {
  data: Toast;
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {
    status: '',
    message: 'wow',
    description: '',
    duration: 3000,
    isClosable: true,
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IToast;

export const openToast = createAsyncThunk(
  'toast',
  //@ts-ignore
  async ({payload, initialize}, {requestId, getState}) => {
    // @ts-ignore
    const {currentRequestId, loading} = getState().toast;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    const toast: Toast = Object.assign(payload, {position: 'top'});
    return toast;
  },
);

export const toastReducer = createSlice({
  name: 'toast',
  initialState,
  reducers: {},
  extraReducers: {
    [openToast.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        //@ts-ignore
        state.currentRequestId = action.meta.requestId;
      }
    },
    [openToast.fulfilled.type]: (state, action) => {
      //@ts-ignore
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [openToast.rejected.type]: (state, action) => {
      //@ts-ignore
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        //@ts-ignore
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

export const selectToast = (state: RootState) => state.toast;
