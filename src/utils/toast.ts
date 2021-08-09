// import {fetchStakes} from 'pages/Staking/staking.reducer';
import {openToast} from 'store/app/toast.reducer';
import {setTransaction} from 'store/refetch.reducer';
import store from '../store';
import {fetchUserInfo} from '../store/app/user.reducer';

type SendToast = {
  type: 'success' | 'error';
  msg: string;
};

export const sendToast = (args: SendToast) => {
  const {type, msg} = args;
  if (type === 'success') {
    return store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: 'Success',
          description: msg,
          status: 'success',
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  }
  if (type === 'error') {
    return store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: 'Success',
          description: msg,
          status: 'success',
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  }
};

export const toastWithReceipt = async (
  recepit: any,
  setTxPending: any,
  from?: string,
  actionType?: string,
) => {
  try {
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: 'Success',
          description: `Tx is being successfully pending!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        },
      }),
    );

    await recepit
      .wait()
      .then((receipt: any) => {
        if (receipt) {
          const {address, library} = store.getState().user.data;
          store.dispatch(setTxPending({tx: false}));

          //@ts-ignore
          store.dispatch(fetchUserInfo({address, library}));
          if (from === 'Staking') {
            return store.dispatch(
              setTransaction({
                transactionType: 'Staking',
                blockNumber: receipt.blockNumber,
                data: {
                  actionType,
                },
              }),
            );
          }
          if (from === 'Dao') {
            return store.dispatch(
              setTransaction({
                transactionType: 'Dao',
                blockNumber: receipt.blockNumber,
              }),
            );
          }
          if (from === 'Pool') {
            return store.dispatch(
              setTransaction({
                transactionType: 'Pool',
                blockNumber: receipt.blockNumber,
              }),
            );
          }
        }
      })
      .catch((e: any) => console.log(e));
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
