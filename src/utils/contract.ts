import {getAddress} from '@ethersproject/address';
import {Contract} from '@ethersproject/contracts';
import {AddressZero} from '@ethersproject/constants';
import {
  JsonRpcSigner,
  Web3Provider,
  JsonRpcProvider,
} from '@ethersproject/providers';
import {DEPLOYED} from 'constants/index';
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
// import {
//   DEPLOYED.TOKAMAK_LAYER2,
//   DEPLOYED.TON,
//   DEPLOYED.TOS,
//   DEPLOYED.DEPOSIT_MANAGER,
//   DEPLOYED.SEIG_MANAGER,
//   DEPLOYED.WTON,
//   DEPLOYED.STAKE1_PROXY,
//   DEPLOYED.AIRDROP,
// } from 'constants/index';

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

export function getTokamakContract(want: string, address?: string): any {
  const rpc = getRPC();

  const TON = new Contract(DEPLOYED.TON, TonABI.abi, rpc);
  console.log(DEPLOYED.TON);
  console.log(DEPLOYED.TON)
  const WTON = new Contract(DEPLOYED.WTON, WtonABI.abi, rpc);
  const TOS = new Contract(DEPLOYED.TOS,  TosABI.abi, rpc);
  const SeigManager = new Contract(
    DEPLOYED.SeigManager,
    SeigManagerABI.abi,
    rpc,
  );
  const DepositManager = new Contract(
    DEPLOYED.DepositManager,
    DepositManagerABI.abi,
    rpc,
  );
  const TokamakLayer2 = new Contract(
    DEPLOYED.TokamakLayer2,
    CandidateABI.abi,
    rpc,
  );
  const VaultProxy = new Contract(
    DEPLOYED.Stake1Proxy,
    StakeVaultLogic.abi,
    rpc,
  );
  const Airdrop = new Contract(DEPLOYED.Airdrop, AirdropVaultABI.abi, rpc);

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
