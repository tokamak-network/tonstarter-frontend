import * as ERC20 from 'services/abis/ERC20.json';
import * as LockTOSDividend from 'services/abis/LockTOSDividend.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertToWei} from 'utils/number';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from 'constants/index';
import {createPool, delPool, putEditPool} from '../utils/createStarter';
import {PoolData} from '@Admin/types';

interface I_CallContract {
  account: string;
  library: LibraryType;
  address: string;
}

const getERC20Approve = async (args: I_CallContract & {amount: string}) => {
  try {
    const {account, library, amount, address} = args;
    const {LockTOSDividend_ADDRESS} = DEPLOYED;

    const ERC20_CONTRACT = new Contract(address, ERC20.abi, library);
    const signer = getSigner(library, account);
    const res = await ERC20_CONTRACT.connect(signer).approve(
      LockTOSDividend_ADDRESS,
      convertToWei(amount),
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

const distribute = async (args: I_CallContract & {amount: string}) => {
  try {
    const {account, library, amount, address} = args;
    const {LockTOSDividend_ADDRESS} = DEPLOYED;
    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );
    const signer = getSigner(library, account);

    const res = await LOCKTOS_DIVIDEND_CONTRACT.connect(signer).distribute(
      address,
      convertToWei(amount),
    );

    return setTx(res);
  } catch (e) {
    console.log(e);
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

export const addPool = async (args: PoolData) => {
  try {
    for (const [key, value] of Object.entries(args)) {
      if (value === '' || value === undefined || value === null) {
        return store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: 'error',
              title: 'Fail to post',
              description: `You need to fill ${key} field out.`,
              duration: 5000,
              isClosable: true,
            },
          }),
        );
      }
      return createPool(args);
    }
  } catch (e) {
    console.log(e);
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

export const editPool = async (args: PoolData) => {
  console.log('--args--');
  console.log(args);
  try {
    for (const [key, value] of Object.entries(args)) {
      if (value === '' || value === undefined || value === null) {
        return store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: 'error',
              title: 'Fail to post',
              description: `You need to fill ${key} field out.`,
              duration: 5000,
              isClosable: true,
            },
          }),
        );
      }
      return putEditPool(args);
    }
  } catch (e) {
    console.log(e);
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

export const deletePool = async (args: {poolAddress: string}) => {
  try {
    for (const [key, value] of Object.entries(args)) {
      if (value === '' || value === undefined || value === null) {
        return store.dispatch(
          //@ts-ignore
          openToast({
            payload: {
              status: 'error',
              title: 'Fail to post',
              description: `You need to fill ${key} field out.`,
              duration: 5000,
              isClosable: true,
            },
          }),
        );
      }
      return delPool(args);
    }
  } catch (e) {
    console.log(e);
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

const actions = {
  getERC20Approve,
  distribute,
  addPool,
  editPool,
  deletePool,
};

export default actions;
