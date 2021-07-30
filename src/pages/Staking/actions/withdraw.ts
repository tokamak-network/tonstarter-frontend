import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED} from 'constants/index';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

type Withdraw = {
  userAddress: string | null | undefined;
  contractAddress: string;
  library: any;
  handleCloseModal: any;
};

const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const withdraw = async (args: Withdraw) => {
  const {userAddress, contractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const signer = getSigner(library, userAddress);
  try {
    const receipt = await StakeTONContract.connect(
      signer,
    ).tokamakProcessUnStaking(TokamakLayer2_ADDRESS);
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Staking');
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
};
