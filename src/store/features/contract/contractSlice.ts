import {createSlice} from '@reduxjs/toolkit';
import {ethers} from 'ethers';
import DepositManager from 'contract/abi/DepositManager.json';
import TonManager from 'contract/abi/TON.json';

const provider = new ethers.providers.InfuraProvider('rinkeby', {
  projectId: '27113ffbad864e8ba47c7d993a738a10',
});

let initialState = {
  config: {
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
  },
  abi: {
    TON_MANAGER: TonManager,
    DEPOSIT_MANAGER: DepositManager,
  },
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    // getAddress: (state, action): string => {},
  },
});

// export const {getAbi} = contractSlice.actions;

export default contractSlice.reducer;
