import * as ERC20 from 'services/abis/ERC20.json';
import * as LockTOSDividend from 'services/abis/LockTOSDividend.json';
import * as TokenDividendProxyPool from 'services/abis/TokenDividendProxyPool.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {setTxPending} from 'store/tx.reducer';
import {LibraryType} from 'types';
import {convertNumber, convertToRay, convertToWei} from 'utils/number';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {toastWithReceipt} from 'utils';
import {DEPLOYED} from 'constants/index';
import {ethers} from 'ethers';
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
interface I_CallContract2 {
  account: string;
  library: LibraryType;
  addresses: any;
}

const getERC20ApproveTOS = async (
  args: I_CallContract & {amount: string; isRay?: boolean},
) => {
  try {
    const {account, library, amount, address, isRay} = args;
    const {LockTOSDividend_ADDRESS} = DEPLOYED;

    const ERC20_CONTRACT = new Contract(address, ERC20.abi, library);
    const signer = getSigner(library, account);
    const res = await ERC20_CONTRACT.connect(signer).approve(
      LockTOSDividend_ADDRESS,
      isRay === true ? convertToRay(amount) : convertToWei(amount),
    );

    store.dispatch(setTxPending({tx: true}));
    if (res) {
      toastWithReceipt(res, setTxPending, 'Airdrop');
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

const getERC20ApproveTON = async (
  args: I_CallContract & {amount: string; isRay?: boolean},
) => {
  try {
    const {account, library, amount, address, isRay} = args;
    const {TokenDividendProxyPool_ADDRESS} = DEPLOYED;
    const ERC20_CONTRACT = new Contract(address, ERC20.abi, library);
    const signer = getSigner(library, account);

    const res = await ERC20_CONTRACT.connect(signer).approve(
      TokenDividendProxyPool_ADDRESS,
      isRay === true ? convertToRay(amount) : convertToWei(amount),
    );

    store.dispatch(setTxPending({tx: true}));
    if (res) {
      toastWithReceipt(res, setTxPending, 'Airdrop');
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

const distributeTOS = async (
  args: I_CallContract & {amount: string; isRay?: boolean},
) => {
  try {
    const {account, library, amount, address, isRay} = args;
    const {LockTOSDividend_ADDRESS} = DEPLOYED;
    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );
    const signer = getSigner(library, account);

    const res = await LOCKTOS_DIVIDEND_CONTRACT.connect(signer).distribute(
      address,
      isRay === true ? convertToRay(amount) : convertToWei(amount),
    );

    store.dispatch(setTxPending({tx: true}));
    if (res) {
      toastWithReceipt(res, setTxPending, 'Airdrop');
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

const distributeTON = async (
  args: I_CallContract & {amount: string; isRay?: boolean},
) => {
  try {
    const {account, library, amount, address, isRay} = args;
    const {TokenDividendProxyPool_ADDRESS} = DEPLOYED;
    const TOKEN_DIVIDEND_PROXY_CONTRACT = new Contract(
      TokenDividendProxyPool_ADDRESS,
      TokenDividendProxyPool.abi,
      library,
    );
    const signer = getSigner(library, account);

    const res = await TOKEN_DIVIDEND_PROXY_CONTRACT.connect(signer).distribute(
      address,
      isRay === true ? convertToRay(amount) : convertToWei(amount),
    );

    store.dispatch(setTxPending({tx: true}));
    if (res) {
      toastWithReceipt(res, setTxPending, 'Airdrop');
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

// const getDistributedTosAmount = async (args: I_CallContract2) => {
//   try {
//     const {account, library} = args;
//     const {LockTOSDividend_ADDRESS, TOS_ADDRESS} = DEPLOYED;

//     const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
//       LockTOSDividend_ADDRESS,
//       LockTOSDividend.abi,
//       library,
//     );

//     const signer = getSigner(library, account);

//     const res = await LOCKTOS_DIVIDEND_CONTRACT.connect(signer).distributions(
//       TOS_ADDRESS,
//     );

//     console.log(
//       'getDistributedTosAmount: ',
//       ethers.utils.formatEther(res.totalDistribution),
//     );
//     //17425 - adds when I distribute to TOS Holders
//     return res;

//     // return setTx(res);
//   } catch (e) {
//     console.log(e);
//     store.dispatch(
//       //@ts-ignore
//       openToast({
//         payload: {
//           status: 'error',
//           title: 'Tx fail to send',
//           description: `something went wrong`,
//           duration: 5000,
//           isClosable: true,
//         },
//       }),
//     );
//   }
// };

// const getDistributedTonAmount = async (args: I_CallContract2) => {
//   try {
//     const {account, library} = args;
//     const {TON_ADDRESS, TokenDividendProxyPool_ADDRESS} = DEPLOYED;

//     const TOKEN_DIVIDEND_PROXY_CONTRACT = new Contract(
//       TokenDividendProxyPool_ADDRESS,
//       TokenDividendProxyPool.abi,
//       library,
//     );

//     const signer = getSigner(library, account);

//     const res = await TOKEN_DIVIDEND_PROXY_CONTRACT.connect(
//       signer,
//     ).totalDistribution(TON_ADDRESS);

//     console.log('totalDistribution: ', ethers.utils.formatEther(res));

//     const res2 = await TOKEN_DIVIDEND_PROXY_CONTRACT.connect(
//       signer,
//     ).distributions(TON_ADDRESS);

//     console.log('getDistributedTonAmount: ', res2);
//     //14000

//     return res;

//     // return setTx(res);
//   } catch (e) {
//     console.log(e);
//     store.dispatch(
//       //@ts-ignore
//       openToast({
//         payload: {
//           status: 'error',
//           title: 'Tx fail to send',
//           description: `something went wrong`,
//           duration: 5000,
//           isClosable: true,
//         },
//       }),
//     );
//   }
// };

export const claimToken = async (
  args: I_CallContract & {tonStaker?: boolean; tosStaker?: boolean},
) => {
  try {
    const {account, library, address, tonStaker, tosStaker} = args;
    const {TokenDividendProxyPool_ADDRESS, LockTOSDividend_ADDRESS} = DEPLOYED;

    console.log('tonStaker claimToken: ', tonStaker);
    console.log('tosStaker claimToken', tosStaker);

    const TOKEN_DIVIDEND_PROXY_CONTRACT = new Contract(
      TokenDividendProxyPool_ADDRESS,
      TokenDividendProxyPool.abi,
      library,
    );

    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );

    if (account === undefined || account === null || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    if (tonStaker && !tosStaker) {
      const res = await TOKEN_DIVIDEND_PROXY_CONTRACT.connect(signer).claim(
        address,
      );
      store.dispatch(setTxPending({tx: true}));
      if (res) {
        toastWithReceipt(res, setTxPending, 'Airdrop');
      }
    } else if (tosStaker && !tonStaker) {
      const res = await LOCKTOS_DIVIDEND_CONTRACT.connect(signer).claim(
        address,
      );
      store.dispatch(setTxPending({tx: true}));
      if (res) {
        toastWithReceipt(res, setTxPending, 'Airdrop');
      }
    } else {
      console.log('CLAIM TOKEN ERROR');
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

export const claimMultipleTokens = async (args: I_CallContract2) => {
  try {
    const {account, library, addresses} = args;
    const {TokenDividendProxyPool_ADDRESS, LockTOSDividend_ADDRESS} = DEPLOYED;

    console.log('claimMultiple tokens: ', addresses);

    const TOKEN_DIVIDEND_PROXY_CONTRACT = new Contract(
      TokenDividendProxyPool_ADDRESS,
      TokenDividendProxyPool.abi,
      library,
    );

    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );

    if (account === undefined || account === null || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);

    // const res = await TOKEN_DIVIDEND_PROXY_CONTRACT.connect(signer).claimBatch(
    //   tokens,
    // );
    // store.dispatch(setTxPending({tx: true}));
    // if (res) {
    //   toastWithReceipt(res, setTxPending, 'Airdrop');
    // }
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

export const checkApprove = async (
  args: I_CallContract & {isRay?: boolean},
): Promise<string> => {
  try {
    const {account, library, address, isRay} = args;
    const {LockTOSDividend_ADDRESS} = DEPLOYED;

    const ERC20_CONTRACT = new Contract(address, ERC20.abi, library);
    const approvedAmount = await ERC20_CONTRACT.allowance(
      account,
      LockTOSDividend_ADDRESS,
    );
    const result = convertNumber({
      amount: approvedAmount,
      type: isRay ? 'ray' : 'wei',
      localeString: true,
    }) as string;
    return result;
  } catch (e) {
    console.log(e);
    return '0.00';
  }
};

export const checkApproveTON = async (
  args: I_CallContract & {isRay?: boolean},
): Promise<string> => {
  try {
    const {account, library, address, isRay} = args;
    const {TokenDividendProxyPool_ADDRESS} = DEPLOYED;

    const ERC20_CONTRACT = new Contract(address, ERC20.abi, library);
    const approvedAmount = await ERC20_CONTRACT.allowance(
      account,
      TokenDividendProxyPool_ADDRESS,
    );
    const result = convertNumber({
      amount: approvedAmount,
      type: isRay ? 'ray' : 'wei',
      localeString: true,
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
  getERC20ApproveTOS,
  getERC20ApproveTON,
  distributeTOS,
  distributeTON,
  claimToken,
  claimMultipleTokens,
  addStarter,
  editStarter,
  addPool,
  editPool,
  deletePool,
  checkApprove,
  checkApproveTON,
};

export default actions;
