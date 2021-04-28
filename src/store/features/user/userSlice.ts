import {createSlice} from '@reduxjs/toolkit';
import {useContract} from 'hooks/useContract';

const setBalance = () => {};

let initialState = {
  address: '',
  balance: 0,
  signIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    add: (state, action) => {
      state.balance += action.payload;
    },
  },
});

export const {add} = userSlice.actions;

export default userSlice.reducer;
