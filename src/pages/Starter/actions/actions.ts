import * as publicSale from 'services/abis/PublicSale.json';
import * as TON from 'services/abis/TON.json';
import * as WTON from 'services/abis/WTON.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertToRay, convertToWei} from 'utils/number';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from '../../../constants/index';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
interface I_CallContract {
  account: string;
  library: LibraryType;
  address: string;
  tokenType?: string;
}

type CallContractWithAmount = I_CallContract & {amount: string};

export const addToken = async (
  tokenAddress: string,
  library: LibraryType,
  tokenImage: string,
) => {
  const ERC20_CONTRACT = new Contract(tokenAddress, ERC20.abi, library);
  const tokenSymbol = await ERC20_CONTRACT.symbol();
  const tokenDecimals = await ERC20_CONTRACT.decimals();
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    //@ts-ignore
    const wasAdded = await window?.ethereum?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};

export const participate = async (args: CallContractWithAmount) => {
  try {
    const {account, library, amount, address, tokenType} = args;
    const signer = getSigner(library, account);
    let contractAddress;
    // const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
    // const res = await PUBLICSALE_CONTRACT.connect(signer).exclusiveSale(
    //   // amount.length > 17 ? amount :
    //   convertToWei(amount),
    // );
    let res;
    if (tokenType === 'TON') {
      contractAddress = DEPLOYED.TON_ADDRESS;
      const TON_CONTRACT = new Contract(address, TON.abi, library);
      res = await TON_CONTRACT.connect(signer).approveAndCall(
        contractAddress,
        {amount: convertToWei(amount)},
        0,
      );
    } else if (tokenType === 'WTON') {
      contractAddress = DEPLOYED.WTON_ADDRESS;
      const WTON_CONTRACT = new Contract(address, WTON.abi, library);
      res = await WTON_CONTRACT.connect(signer).approveAndCall(
        contractAddress,
        {amount: convertToWei(amount)},
        0,
      );
    }
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
    const {account, library, address, amount, tokenType} = args;
    const signer = getSigner(library, account);
    const {TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;
    // const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
    // const res = await PUBLICSALE_CONTRACT.connect(signer).deposit(
    //   amount.length > 17 ? amount : convertToWei(amount),
    // );
    let res;

    if (tokenType === 'TON') {
      const TON_CONTRACT = new Contract(TON_ADDRESS, TON.abi, library);
      const convertedAmount = convertToWei(amount);
      res = await TON_CONTRACT.connect(signer).approveAndCall(
        address,
        convertedAmount,
        0,
      );
    } else if (tokenType === 'WTON') {
      const WTON_CONTRACT = new Contract(WTON_ADDRESS, WTON.abi, library);
      const convertedAmount = convertToRay(amount);
      res = await WTON_CONTRACT.connect(signer).approveAndCall(
        address,
        convertedAmount,
        0,
      );
    }
    return setTx(res);
  } catch (e: any) {
    console.log(e);
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
