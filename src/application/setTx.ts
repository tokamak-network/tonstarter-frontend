import {setTxPending} from '../store/tx.reducer';
import store from '../store';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

export async function setTx<T>(contract: Promise<T>) {
  try {
    const receipt = await contract;
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending);
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
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
}
