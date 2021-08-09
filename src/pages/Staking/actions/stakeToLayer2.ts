import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import {convertToWei} from 'utils/number';

type StakeToLayer2 = {
  account: string;
  library: any;
  amount: string;
  contractAddress: string;
};

const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const stakeL2 = async (args: StakeToLayer2) => {
  const {account, library, amount, contractAddress} = args;

  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  if (!StakeTONContract) {
    throw new Error(`Can't find the contract for staking actions`);
  }
  const signer = getSigner(library, account);
  const weiAmount = convertToWei(amount);

  try {
    const receipt = await StakeTONContract.connect(signer).tokamakStaking(
      TokamakLayer2_ADDRESS,
      weiAmount,
    );
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
