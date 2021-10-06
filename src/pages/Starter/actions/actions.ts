import {DEPLOYED} from 'constants/index';
import * as publicSale from 'services/abis/PublicSale.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertToWei} from 'utils/number';

interface I_CallContract {
  account: string;
  library: LibraryType;
}

export const participate = async (args: I_CallContract & {amount: string}) => {
  const {account, library, amount} = args;
  const {PublicSale_ADDRESS} = DEPLOYED;
  const PUBLICSALE_CONTRACT = new Contract(
    PublicSale_ADDRESS,
    publicSale.abi,
    library,
  );
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).exclusiveSale(
    convertToWei(amount),
  );
  return setTx(res);
};

export const addWhiteList = async (args: I_CallContract) => {
  const {account, library} = args;
  const {PublicSale_ADDRESS} = DEPLOYED;
  const PUBLICSALE_CONTRACT = new Contract(
    PublicSale_ADDRESS,
    publicSale.abi,
    library,
  );
  const signer = getSigner(library, account);
  const res = await PUBLICSALE_CONTRACT.connect(signer).addWhiteList();
  return setTx(res);
};

export const calculTier = async (args: I_CallContract) => {
  const {account, library} = args;
  const {PublicSale_ADDRESS} = DEPLOYED;
  const PUBLICSALE_CONTRACT = new Contract(
    PublicSale_ADDRESS,
    publicSale.abi,
    library,
  );
  const res = await PUBLICSALE_CONTRACT.calculTier(account);
  return res;
};

export const isWhiteList = async (args: I_CallContract) => {
  const {account, library} = args;
  const {PublicSale_ADDRESS} = DEPLOYED;
  const PUBLICSALE_CONTRACT = new Contract(
    PublicSale_ADDRESS,
    publicSale.abi,
    library,
  );
  const res = await PUBLICSALE_CONTRACT.usersEx(account);
  return res;
};
