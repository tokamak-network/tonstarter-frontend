import * as ERC20 from 'services/abis/ERC20.json';
import * as LockTOSDividend from 'services/abis/LockTOSDividend.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertNumber, convertToWei} from 'utils/number';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from 'constants/index';
import {
  createStarter,
  putEditStarter,
  createPool,
  delPool,
  putEditPool,
} from '../utils/createStarter';
import {AdminObject, PoolData} from '@Admin/types';

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

export const checkApprove = async (args: I_CallContract): Promise<string> => {
  try {
    const {account, library, address} = args;
    const {LockTOSDividend_ADDRESS} = DEPLOYED;

    const ERC20_CONTRACT = new Contract(address, ERC20.abi, library);
    const approvedAmount = await ERC20_CONTRACT.allowance(
      account,
      LockTOSDividend_ADDRESS,
    );
    const result = convertNumber({
      amount: approvedAmount,
    }) as string;
    return result;
  } catch (e) {
    console.log(e);
    return '0.00';
  }
};

export const addStarter = async (args: AdminObject) => {
  try {
    // for (const [key, value] of Object.entries(args)) {
    //   if (
    //     value === '' ||
    //     value === 0 ||
    //     value === undefined ||
    //     value === null
    //   ) {
    //     return store.dispatch(
    //       //@ts-ignore
    //       openToast({
    //         payload: {
    //           status: 'error',
    //           title: 'Fail to post',
    //           description: `You need to fill ${key} field out.`,
    //           duration: 5000,
    //           isClosable: true,
    //         },
    //       }),
    //     );
    //   }
    // }
    return createStarter(args);
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

export const editStarter = async (args: AdminObject) => {
  try {
    // for (const [key, value] of Object.entries(args)) {
    //   if (
    //     value === '' ||
    //     value === 0 ||
    //     value === undefined ||
    //     value === null
    //   ) {
    //     return store.dispatch(
    //       //@ts-ignore
    //       openToast({
    //         payload: {
    //           status: 'error',
    //           title: 'Fail to post',
    //           description: `You need to fill ${key} field out.`,
    //           duration: 5000,
    //           isClosable: true,
    //         },
    //       }),
    //     );
    //   }
    // }
    return putEditStarter(args);
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
  addStarter,
  editStarter,
  addPool,
  editPool,
  deletePool,
  checkApprove,
};

export default actions;