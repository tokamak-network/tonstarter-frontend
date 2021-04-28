import {createSlice} from '@reduxjs/toolkit';

let initialState = {
  mainnet: {
    baseURL: 'https://dashboard-api.tokamak.network',
    candidate: 'https://daoapi.tokamak.network/v1',
    prefixTransactionHash: 'https://etherscan.io/tx/',
    prefixAddress: 'https://etherscan.io/address/',
    network: '1',
  },
  rinkeby: {
    baseURL: 'https://dashboard-api.tokamak.network/rinkeby',
    candidate: 'https://api-dev.tokamak.network/v1',
    prefixTransactionHash: 'https://rinkeby.etherscan.io/tx/',
    prefixAddress: 'https://rinkeby.etherscan.io/address/',
    network: '4',
  },
  development: {
    baseURL: 'http://127.0.0.1:9000',
    candidate: 'https://daoapi.tokamak.network/v1',
    prefixTransactionHash: 'https://etherscan.io/tx/',
    prefixAddress: 'https://etherscan.io/address/',
    network: '1',
  },
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    getAbi: (state, action): string => {
      //   return initialState.contractAddress.temp;
    },
  },
});

export const {getAbi} = contractSlice.actions;

export default contractSlice.reducer;
