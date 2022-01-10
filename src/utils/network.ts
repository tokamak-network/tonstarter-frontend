import {DEFAULT_NETWORK} from 'constants/index';
import {ethers} from 'ethers';

export const getNetworkDetails = async (provider: any, address: string) => {
  try {
    let currentNetwork = await provider.getNetwork();
    if (currentNetwork.chainId !== Number(DEFAULT_NETWORK)) {
      return {
        error: `Wrong network selected. Please make sure you are on ${await getNetworkName(
          Number(DEFAULT_NETWORK),
        )}`,
      };
    }
    return {
      currentNetwork,
      networkAddress: address,
      currentBalance: await provider.getBalance(address), // ether balance
    };
  } catch (error) {
    return {
      error: `Unable to detect Web3 on browser`,
    };
  }
};

export const getNetworkName = async (id: string | number) => {
  let link: string;
  switch (id) {
    case 1:
      link = 'Main Network';
      break;
    case 3:
      link = 'Ropsten Testnet Network';
      break;
    case 4:
      link = 'Rinkeby Testnet Network';
      break;
    case 42:
      link = 'Kovan Testnet Network';
      break;
    default:
      link = 'Local Testnet Network';
      break;
  }

  return link as string;
};

export const getExplorerLink = async (id: string | number | undefined) => {
  let link: string;
  switch (id) {
    case 1:
      link = `https://etherscan.io/address/`;
      break;
    case 3:
      link = `https://ropsten.etherscan.io/address/`;
      break;
    case 4:
      link = `https://rinkeby.etherscan.io/address/`;
      break;
    case 42:
      link = `https://kovan.etherscan.io/address/`;
      break;
    default:
      link = 'Unknown network';
      break;
  }

  return link as string;
};

export const getBlockNumber = async (chainId: '1' | '4' | undefined) => {
  const providerNet = {
    1: 'main',
    4: 'rinkeby',
  };
  let net = '';
  if (chainId === undefined) {
    net = 'rinkeby';
  } else {
    net = providerNet[chainId] === undefined ? 'rinkeby' : chainId;
  }
  const provider = ethers.getDefaultProvider(net);
  const currentBlock = await provider.getBlockNumber();
  return currentBlock;
};

export const getUniswapPoolLink = async (id: string | number | undefined) => {
  let link: string;
  switch (id) {
    case 1:
      link = `https://info.uniswap.org/#/pools/`;
      break;
    case 3:
      link = `https://info.uniswap.org/#/pools/`;
      break;
    case 4:
      link = `https://info.uniswap.org/#/pools/`;
      break;
    case 42:
      link = `https://info.uniswap.org/#/pools/`;
      break;
    default:
      link = 'Unknown network';
      break;
  }

  return link as string;
};
