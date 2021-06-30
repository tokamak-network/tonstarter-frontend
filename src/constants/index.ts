import {injected, walletconnect} from 'connectors';
import {WalletInfo} from 'types';

export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = process.env.REACT_APP_DEFAULT_NETWORK as string;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEPLOYED = {
  FLD: '0x9d4926fB64A656deC8720Ad4e33b80076558120e',
  StakeSimple: '0x1FBC61ed3159d5517F84fAd9AdC421bF0D176C43',
  StakeSimpleFactory: '0xBa10734B85cAe87CEA6824CF974a49E7A72c0Dec',
  StakeTONLogic: '0x0ACdaEBDFE3Be357fB6B2955536A34eBb69c2169',
  StakeTONProxyFactory: '0x5E2f003119adAEd65218058318Fb58Ab31F67DfE',
  StakeTONFactory: '0x70aeD9162A81Afbb514BC59aaB12aCF69917552E',
  StakeDefiFactory: '0x1cb9EEB2bc1EF07f0D1d9563e9dd488C097a27F2',
  StakeFactory: '0x963A612409656a4945B6Ccf43F30b7a751140949',
  StakeRegistry: '0xbaAF4bCBAd750B85338d924775dF5D1003A89745',
  Stake1Vault: '0x98624d67DbF3918290F1be4803855A82f8F69ADE',
  StakeVaultFactory: '0xBe342d1D384516Ac4d99c1376e505F205b5CE213',
  Stake1Logic: '0x19493EFE20daEc1D8C0188ce279b86D1AbD02cCE',
  Stake1Proxy: '0xC875117259b310eF24479bdfd6AAeC9c9EF86b4E',
  TON: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
  WTON: '0x709bef48982Bbfd6F2D4Be24660832665F53406C',
  DepositManager: '0x57F5CD759A5652A697D539F1D9333ba38C615FC2',
  SeigManager: '0x957DaC3D3C4B82088A4939BE9A8063e20cB2efBE',
  SwapProxy: '0x8032d21F59CDB42C9c94a3A41524D4CCF0Cae96c',
  TokamakLayer2: '0x1fa621d238f30f6651ddc8bd5f4be21c6b894426',
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

export const REACT_APP_API_URL = process.env.REACT_APP_API_URL as string;
export const REACT_APP_DEFAULT_NETWORK = process.env
  .REACT_APP_DEFAULT_NETWORK as string;
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
