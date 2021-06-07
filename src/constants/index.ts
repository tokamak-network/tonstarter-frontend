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

export const REACT_APP_API_URL = process.env.REACT_APP_API_URL as string;
export const REACT_APP_DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK as string;
export const REACT_APP_FLD = process.env.REACT_APP_FLD as string;
export const REACT_APP_STAKE_TON_LOGIC_FACTORY =
  process.env.REACT_APP_STAKE_TON_LOGIC_FACTORY as string;
export const REACT_APP_STAKE_TON_PROXY_FACTORY =
  process.env.REACT_APP_STAKE_TON_PROXY_FACTORY as string;
export const REACT_APP_STAKE_TON_FACTORY =
  process.env.REACT_APP_STAKE_TON_FACTORY as string;
export const REACT_APP_STAKE_VAULT_FACTORY =
  process.env.REACT_APP_STAKE_VAULT_FACTORY as string;
export const REACT_APP_STAKE_FOR_STABLE_COIN_FACTORY =
  process.env.REACT_APP_STAKE_FOR_STABLE_COIN_FACTORY as string;
export const REACT_APP_STAKE_FACTORY = process.env.REACT_APP_STAKE_FACTORY as string;
export const REACT_APP_STAKE_REGISTRY = process.env.REACT_APP_STAKE_REGISTRY as string;
export const REACT_APP_STAKE1_LOGIC = process.env.REACT_APP_STAKE1_LOGIC as string;
export const REACT_APP_STAKE1_PROXY = process.env.REACT_APP_STAKE1_PROXY as string;
export const REACT_APP_TON = process.env.REACT_APP_TON as string;
export const REACT_APP_WTON = process.env.REACT_APP_WTON as string;
export const REACT_APP_DEPOSIT_MANAGER = process.env.REACT_APP_DEPOSIT_MANAGER as string;
export const REACT_APP_SEIG_MANAGER = process.env.REACT_APP_SEIG_MANAGER as string;
export const REACT_APP_TOKAMAK_LAYER2 = process.env.REACT_APP_TOKAMAK_LAYER2 as string;
