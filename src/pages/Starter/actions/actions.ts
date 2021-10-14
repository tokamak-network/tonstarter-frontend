import * as publicSale from 'services/abis/PublicSale.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertToWei} from 'utils/number';

interface I_CallContract {
  account: string;
  library: LibraryType;
  address: string;
}

type CallContractWithAmount = I_CallContract & {amount: string};

export const participate = async (args: CallContractWithAmount) => {
  const {account, library, amount, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).exclusiveSale(
    convertToWei(amount),
  );
  return setTx(res);
};

export const addWhiteList = async (args: I_CallContract) => {
  const {account, library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).addWhiteList();
  return setTx(res);
};

export const calculTier = async (args: I_CallContract) => {
  const {account, library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.calculTier(account);
  return res;
};

export const isWhiteList = async (args: I_CallContract) => {
  const {account, library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.usersEx(account);
  return res;
};

export const openSale = async (args: I_CallContract) => {
  const {account, library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).openSale();
  return setTx(res);
};

export const deposit = async (args: I_CallContract & {amount: string}) => {
  const {account, library, address, amount} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).deposit(
    convertToWei(amount),
  );
  return setTx(res);
};

export const claim = async (args: I_CallContract) => {
  const {account, library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).claim();
  return setTx(res);
};

export const depositWithdraw = async (args: I_CallContract) => {
  const {account, library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).depositWithdraw();
  return setTx(res);
};
