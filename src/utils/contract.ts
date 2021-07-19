import {getAddress} from '@ethersproject/address';
import {Contract} from '@ethersproject/contracts';
import {AddressZero} from '@ethersproject/constants';
import {
  JsonRpcSigner,
  Web3Provider,
  JsonRpcProvider,
} from '@ethersproject/providers';

import * as TonABI from 'services/abis/TON.json';
import * as WtonABI from 'services/abis/WTON.json';
import * as TosABI from 'services/abis/TOS.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import * as SeigManagerABI from 'services/abis/SeigManager.json';
import * as CandidateABI from 'services/abis/ICandidate.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as StakeVaultLogic from 'services/abis/Stake1Logic.json';
import * as StakeVault from 'services/abis/Stake1Vault.json';
// import * as StakeVaultStorage from 'services/abis/StakeVaultStorage.json';
import * as AirdropVaultABI from 'services/abis/AirdropVault.json';
import {DEPLOYED} from 'constants/index';

const {
  TokamakLayer2_ADDRESS,
  TON_ADDRESS,
  TOS_ADDRESS,
  DepositManager_ADDRESS,
  SeigManager_ADDRESS,
  WTON_ADDRESS,
  Stake1Proxy_ADDRESS,
  Airdrop_ADDRESS,
} = DEPLOYED;

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string,
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string,
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getRPC(): JsonRpcProvider {
  // return new JsonRpcProvider('https://rinkeby.rpc.tokamak.network');
  return new JsonRpcProvider(
    'https://mainnet.infura.io/v3/34448178b25e4fbda6d80f4da62afba2',
  );
}

export function getTokamakContract(want: string, address?: string, library?: Web3Provider): any {
  // const rpc = getRPC();
  const rpc = library;

  const TON = new Contract(TON_ADDRESS, TonABI.abi, rpc);
  const WTON = new Contract(WTON_ADDRESS, WtonABI.abi, rpc);
  const TOS = new Contract(TOS_ADDRESS, TosABI.abi, rpc);
  const SeigManager = new Contract(
    SeigManager_ADDRESS,
    SeigManagerABI.abi,
    rpc,
  );
  const DepositManager = new Contract(
    DepositManager_ADDRESS,
    DepositManagerABI.abi,
    rpc,
  );
  const TokamakLayer2 = new Contract(
    TokamakLayer2_ADDRESS,
    CandidateABI.abi,
    rpc,
  );
  const VaultProxy = new Contract(
    Stake1Proxy_ADDRESS,
    StakeVaultLogic.abi,
    rpc,
  );
  const Airdrop = new Contract(Airdrop_ADDRESS, AirdropVaultABI.abi, rpc);

  if (want === 'TON') {
    return TON;
  } else if (want === 'TOS') {
    return TOS;
  } else if (want === 'Airdrop') {
    return Airdrop;
  } else if (want === 'WTON') {
    return WTON;
  } else if (want === 'SeigManager') {
    return SeigManager;
  } else if (want === 'DepositManager') {
    return DepositManager;
  } else if (want === 'TokamakLayer2') {
    return TokamakLayer2;
  } else if (want === 'StakeTON') {
    if (address) {
      return new Contract(address, StakeTON.abi, rpc);
    } else {
      throw Error('Need Contract Address!');
    }
  } else if (want === 'VaultProxy') {
    return VaultProxy;
  } else if (want === 'Vault') {
    if (address) {
      return new Contract(address, StakeVault.abi, rpc);
    } else {
      throw Error('Need Contract Address!');
    }
  } else {
    throw Error('Invalid contract name!');
  }
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any,
  );
}
