import {injected} from 'connectors';
import {WalletInfo} from 'types';
import {DEPLOYED_TYPE} from './type';
import {ethers} from 'ethers';
import {tokens} from './token';

export const REACT_APP_MODE = process.env.REACT_APP_MODE as string;
export const REACT_APP_MAINNET_INFURA_API = process.env
  .REACT_APP_MAINNET_INFURA_API as string;
export const REACT_APP_RINKEBY_INFURA_API = process.env
  .REACT_APP_RINKEBY_INFURA_API as string;
export const REACT_APP_MAINNET_API = process.env
  .REACT_APP_MAINNET_API as string;
export const REACT_APP_DEV_API = process.env.REACT_APP_DEV_API as string;
export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = REACT_APP_MODE === 'DEV' ? 4 : 1;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const API_SERVER =
  REACT_APP_MODE === 'DEV' ? REACT_APP_DEV_API : REACT_APP_MAINNET_API;
export const BASE_PROVIDER =
  REACT_APP_MODE === 'DEV'
    ? ethers.getDefaultProvider('rinkeby')
    : ethers.getDefaultProvider('mainnet');
export const fetchStakeURL = `${API_SERVER}/stakecontracts?chainId=${DEFAULT_NETWORK}`;
export const fetchValutURL = `${API_SERVER}/vaults?chainId=${DEFAULT_NETWORK}`;
export const permitTOSAddress =
  REACT_APP_MODE === 'DEV' ? '0x865264b30eb29A2978b9503B8AfE2A2DDa33eD7E' : '';

export const TOKENS = tokens;

//Old Ver
// const MAINNET_DEPLOYED = {
//   Stake1Proxy_ADDRESS: '0x5F60D1F8720336A76bfb05A0AFCBa471F9673D9f',
//   TON_ADDRESS: '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
//   TOS_ADDRESS: '0x1b481bca7156E990E2d90d1EC556d929340E9fC3',
//   WTON_ADDRESS: '0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2',
//   DepositManager_ADDRESS: '0x56E465f654393fa48f007Ed7346105c7195CEe43',
//   SeigManager_ADDRESS: '0x710936500aC59e8551331871Cbad3D33d5e0D909',
//   SwapProxy_ADDRESS: '0x30e65B3A6e6868F044944Aa0e9C5d52F8dcb138d',
//   TokamakLayer2_ADDRESS: '0x42ccf0769e87cb2952634f607df1c7d62e0bbc52',
//   Airdrop_ADDRESS: '0x49108acF8c4fD9b70eCfC0804CfB84DE6EF475Ce',
//   LockTOS_ADDRESS: '',
//   UniswapStaking_Address: '0xC1349A9a33A0682804c390a3968e26E5a2366153',
//   NPM_Address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
//   BasePool_Address: '0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4',
// };

// Now
const MAINNET_DEPLOYED = {
  Stake1Proxy_ADDRESS: '0x8e539e29D80fd4cB3167409A82787f3B80bf9113',
  TON_ADDRESS: '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  TOS_ADDRESS: '0x409c4D8cd5d2924b9bc5509230d16a61289c8153',
  WTON_ADDRESS: '0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2',
  DepositManager_ADDRESS: '0x56E465f654393fa48f007Ed7346105c7195CEe43',
  SeigManager_ADDRESS: '0x710936500aC59e8551331871Cbad3D33d5e0D909',
  SwapProxy_ADDRESS: '0x30e65B3A6e6868F044944Aa0e9C5d52F8dcb138d',
  TokamakLayer2_ADDRESS: '0x42ccf0769e87cb2952634f607df1c7d62e0bbc52',
  Airdrop_ADDRESS: '0x0620492BAbe0a2cE13688025F8b783B8d6c28955',
  LockTOS_ADDRESS: '',
  UniswapStaking_Address: '0xC1349A9a33A0682804c390a3968e26E5a2366153',
  NPM_Address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  BasePool_Address: '0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4',
  StakeTonControl_ADDRESS: '',
};

const RINKEBY_DEPLOYED = {
  Stake1Proxy_ADDRESS: '0xd53e6EaA528840a3625eb93DF2FA63F37Bd1EB7f',
  TON_ADDRESS: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
  TOS_ADDRESS: '0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd',
  WTON_ADDRESS: '0x709bef48982Bbfd6F2D4Be24660832665F53406C',
  DepositManager_ADDRESS: '0x57F5CD759A5652A697D539F1D9333ba38C615FC2',
  SeigManager_ADDRESS: '0x957DaC3D3C4B82088A4939BE9A8063e20cB2efBE',
  SwapProxy_ADDRESS: '0x8032d21F59CDB42C9c94a3A41524D4CCF0Cae96c',
  TokamakLayer2_ADDRESS: '0x1fa621d238f30f6651ddc8bd5f4be21c6b894426',
  Airdrop_ADDRESS: '0xD958cD2d03aaEe169953780234848445504571E8',
  UniswapStaking_Address: '0x99b09c6CfF45C778a4F5fBF7a4EAD6c3DEBfdcBb',
  NPM_Address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  LockTOS_ADDRESS: '0x5AE404243a3b70Dfba8f91C38c6d455e0D1f2471',
  BasePool_Address: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
  StakeTonControl_ADDRESS: '0xF049030A9D6faCbD6C76E08794CC751b1Dbaa072',
};

export const DEPLOYED: DEPLOYED_TYPE =
  REACT_APP_MODE === 'PRODUCTION' ? MAINNET_DEPLOYED : RINKEBY_DEPLOYED;

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
};
