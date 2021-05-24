import {injected, walletconnect} from 'connectors';
import {WalletInfo} from 'types';

export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK as string;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const SUPPORTED_WALLETS: {[key: string]: WalletInfo} = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'metamask.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
    type: 'INJECTED',
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    type: 'METAMASK',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: 'walletconnect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#E8831D',
    mobile: true,
    type: 'WALLET_CONNECT',
  },
};

export const REACT_APP_FLD =
  process.env.REACT_APP_FLD || '0x867f9fb5fFb11c6ca6EAc8e0DfFED435A77fA8DB';
export const REACT_APP_STAKE_REGISTRY =
  process.env.REACT_APP_STAKE_REGISTRY ||
  '0x292517E20a96f0A26b828A679AECA67443310fFA';
export const REACT_APP_STAKE_LOGIC =
  process.env.REACT_APP_STAKE_LOGIC ||
  '0xFf4Cc3eEBfa3dc06d95efe8A8770B007b25614C8';
export const REACT_APP_STAKE_PROXY =
  process.env.REACT_APP_STAKE_PROXY ||
  '0x655E382ea2D1C440eE74543Ae68600a02278FeC5';
export const REACT_APP_STAKE_FACTORY =
  process.env.REACT_APP_STAKE_FACTORY ||
  '0x30946fe3534b9E228923DD1F0392F8aE3E053766';
export const REACT_APP_TON =
  process.env.REACT_APP_TON || '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0';
export const REACT_APP_WTON =
  process.env.REACT_APP_WTON || '0x709bef48982Bbfd6F2D4Be24660832665F53406C';
export const REACT_APP_DEPOSIT_MANAGER =
  process.env.REACT_APP_DEPOSIT_MANAGER ||
  '0x57F5CD759A5652A697D539F1D9333ba38C615FC2';
export const REACT_APP_SEIGMANAGER =
  process.env.REACT_APP_SEIGMANAGER ||
  '0x957DaC3D3C4B82088A4939BE9A8063e20cB2efBE';
export const REACT_STAKE_VAULT =
  process.env.REACT_STAKE_VAULT || '0x57Ac4234c5E4CA367fB2b956679415d46f757CBd';
