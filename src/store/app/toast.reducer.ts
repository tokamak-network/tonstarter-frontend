import {createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';

export type Toast = {
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
    message: '',
    description: '',
    duration: 3000,
    isClosable: true,
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as IToast;

export const toastReducer = createSlice({
  name: 'toast',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const selectToast = (state: RootState) => state.toast;