import {getSigner} from 'utils/contract';
import {setTxPending} from 'store/tx.reducer';
import store from 'store';
import {Contract} from '@ethersproject/contracts';
import * as TokamakStakeUpgrade from 'services/abis/TokamakStakeUpgrade.json';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

type UnstakeFromLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  library: any;
};

export const swapWTONtoTOS = async (args: UnstakeFromLayer2) => {
  try {
    const {userAddress, amount, contractAddress, library} = args;
    if (userAddress === null || userAddress === undefined) {
      return;
    }
    const StakeTONContract = new Contract(
      contractAddress,
      TokamakStakeUpgrade.abi,
      library,
    );
    const signer = getSigner(library, userAddress);
    const receipt = await StakeTONContract.connect(signer).exchangeWTONtoTOS(
      amount,
    );
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Staking');
    }
    if (receipt) {
      store.dispatch(setTxPending({tx: false}));
    }
  } catch (err) {
    console.log(err);
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
};
