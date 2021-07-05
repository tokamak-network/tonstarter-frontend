import {getAddress} from '@ethersproject/address';
import {Contract} from '@ethersproject/contracts';
import {AddressZero} from '@ethersproject/constants';
import {JsonRpcSigner, Web3Provider, JsonRpcProvider} from '@ethersproject/providers';

import * as TonABI from 'services/abis/TON.json';
import * as WtonABI from 'services/abis/WTON.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import * as SeigManagerABI from 'services/abis/SeigManager.json';
import * as CandidateABI from 'services/abis/ICandidate.json';
import {
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_TON,
  REACT_APP_DEPOSIT_MANAGER,
  REACT_APP_SEIG_MANAGER,
  DEPLOYED,
  REACT_APP_WTON,
} from 'constants/index';

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

export function getRPC (): JsonRpcProvider {
  // return new JsonRpcProvider('https://rinkeby.rpc.tokamak.network');
  return new JsonRpcProvider('https://rinkeby.infura.io/v3/34448178b25e4fbda6d80f4da62afba2');
}

export function getTokamakContract (want?: string): any {
  const rpc = getRPC();

  const TON = new Contract(REACT_APP_TON, TonABI.abi, rpc);
  const WTON = new Contract(REACT_APP_WTON, WtonABI.abi, rpc);
  const SeigManager = new Contract(REACT_APP_SEIG_MANAGER, SeigManagerABI.abi, rpc);
  const DepositManager = new Contract(REACT_APP_DEPOSIT_MANAGER, DepositManagerABI.abi, rpc)
  const TokamakLayer2 = new Contract(REACT_APP_TOKAMAK_LAYER2, CandidateABI.abi, rpc);

  if (want === 'TON') {
    return TON;
  } else if (want === 'WTON') {
    return WTON;
  } else if (want === 'SeigManager') {
    return SeigManager 
  } else if (want === 'DepositManager') {
    return DepositManager 
  } else if (want === 'TokamakLayer2') {
    return TokamakLayer2 
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