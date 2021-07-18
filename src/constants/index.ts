import {injected, walletconnect} from 'connectors';
import {WalletInfo} from 'types';

export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK as string;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEPLOYED = {
  FLD: '0x9d4926fB64A656deC8720Ad4e33b80076558120e',
  StakeSimple: '0x1FBC61ed3159d5517F84fAd9AdC421bF0D176C43',
  StakeSimpleFactory: '0xBa10734B85cAe87CEA6824CF974a49E7A72c0Dec',
  StakeTONLogic: '0x1E61f1694990c324C1b9cA3c139E75d3c0BB15E3',
  StakeTONProxyFactory: '0x0E9331E560d40FeFaDaAf311e66B595167A1B8e6',
  StakeTONFactory: '0x7Ae1E44097745b19fFaBA12ca37aAF606328197e',
  StakeDefiFactory: '0x1cb9EEB2bc1EF07f0D1d9563e9dd488C097a27F2',
  StakeFactory: '0x331d3E5d469Eb7619de2d5D1C80b7278e25217A6',
  StakeRegistry: '0xc2443B304d940faAf749AAc1C53FCe48A29F81B3',
  Stake1Vault: '0x98624d67DbF3918290F1be4803855A82f8F69ADE',
  StakeVaultFactory: '0x30946fe3534b9E228923DD1F0392F8aE3E053766',
  Stake1Logic: '0x9f1d66a2cd1A3AeE49e55bDa77B335b1af584480',
  Stake1Proxy: '0xd53e6EaA528840a3625eb93DF2FA63F37Bd1EB7f',
  TON: '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  TOS: '0x1b481bca7156E990E2d90d1EC556d929340E9fC3',
  WTON: '0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2',
  DepositManager: '0x56E465f654393fa48f007Ed7346105c7195CEe43',
  SeigManager: '0x710936500aC59e8551331871Cbad3D33d5e0D909',
  SwapProxy: '0x30e65B3A6e6868F044944Aa0e9C5d52F8dcb138d',
  TokamakLayer2: '0x1fa621d238f30f6651ddc8bd5f4be21c6b894426',
  Airdrop: '0x49108acF8c4fD9b70eCfC0804CfB84DE6EF475Ce',
};

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
export const REACT_APP_DEFAULT_NETWORK = 1;
export const REACT_APP_API_URL = process.env.REACT_APP_API_URL as string;
export const REACT_APP_TOS = process.env.REACT_APP_TOS as string;
export const REACT_APP_RPC_URL = process.env.REACT_APP_RPC_URL as string;
export const REACT_APP_STAKE_TON_LOGIC_FACTORY = process.env
  .REACT_APP_STAKE_TON_LOGIC_FACTORY as string;
export const REACT_APP_STAKE_TON_PROXY_FACTORY = process.env
  .REACT_APP_STAKE_TON_PROXY_FACTORY as string;
export const REACT_APP_STAKE_TON_FACTORY = process.env
  .REACT_APP_STAKE_TON_FACTORY as string;
export const REACT_APP_STAKE_VAULT_FACTORY = process.env
  .REACT_APP_STAKE_VAULT_FACTORY as string;
export const REACT_APP_STAKE_FOR_STABLE_COIN_FACTORY = process.env
  .REACT_APP_STAKE_FOR_STABLE_COIN_FACTORY as string;
export const REACT_APP_STAKE_FACTORY = process.env
  .REACT_APP_STAKE_FACTORY as string;
export const REACT_APP_STAKE_REGISTRY = process.env
  .REACT_APP_STAKE_REGISTRY as string;
export const REACT_APP_STAKE1_LOGIC = process.env
  .REACT_APP_STAKE1_LOGIC as string;
export const REACT_APP_STAKE1_PROXY = process.env
  .REACT_APP_STAKE1_PROXY as string;
export const REACT_APP_TON = process.env.REACT_APP_TON as string;
export const REACT_APP_WTON = process.env.REACT_APP_WTON as string;
export const REACT_APP_DEPOSIT_MANAGER = process.env
  .REACT_APP_DEPOSIT_MANAGER as string;
export const REACT_APP_SEIG_MANAGER = process.env
  .REACT_APP_SEIG_MANAGER as string;
export const REACT_APP_TOKAMAK_LAYER2 = process.env
  .REACT_APP_TOKAMAK_LAYER2 as string;
export const REACT_APP_AIRDROP = process.env.REACT_APP_AIRDROP as string;
export const REACT_APP_MAINNET_API = process.env
  .REACT_APP_MAINNET_API as string;
export const REACT_APP_DEV_API = process.env.REACT_APP_DEV_API as string;
export const REACT_APP_MODE = process.env.REACT_APP_MODE as string;
