import * as publicSale from 'services/abis/PublicSale.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertToWei} from 'utils/number';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';

interface I_CallContract {
  account: string;
  library: LibraryType;
  address: string;
}

type CallContractWithAmount = I_CallContract & {amount: string};

export const participate = async (args: CallContractWithAmount) => {
  try {
    const {account, library, amount, address} = args;
    const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
    const signer = getSigner(library, account);
    const res = await PUBLICSALE_CONTRACT.connect(signer).exclusiveSale(
      amount.length > 17 ? amount : convertToWei(amount),
    );
    return setTx(res);
  } catch (e) {
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          status: 'error',
          title: 'Tx fail to send',
          description: `something went wrong`,
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  }
};

export const addWhiteList = async (args: I_CallContract) => {
  try {
    const {account, library, address} = args;
    const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
    const signer = getSigner(library, account);
    const res = await PUBLICSALE_CONTRACT.connect(signer).addWhiteList();
    return setTx(res);
  } catch (e: any) {
    const isNotPassed = e.message.includes('whitelistStartTime has not passed');
    if (isNotPassed) {
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `Whitelist Start Time has not been passed yet`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  }
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
  try {
    const {account, library, address, amount} = args;
    const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
    const signer = getSigner(library, account);
    const res = await PUBLICSALE_CONTRACT.connect(signer).deposit(
      amount.length > 17 ? amount : convertToWei(amount),
    );
    return setTx(res);
  } catch (e: any) {
    // switch (e.message) {
    // case e.message.includes('end the depositTime'):
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          status: 'error',
          title: 'Tx fail to send',
          description: `something went wrong`,
          duration: 5000,
          isClosable: true,
        },
      }),
    );
    // }
  }
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
