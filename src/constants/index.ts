import {injected, walletconnect} from 'connectors';
import {WalletInfo} from 'types';

export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = 4;

export const SUPPORTED_WALLETS: {[key: string]: WalletInfo} = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'metamask.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: 'walletconnect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#E8831D',
  },
};
