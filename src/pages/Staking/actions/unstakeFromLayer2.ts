import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED} from 'constants/index';
import {utils} from 'ethers';
import * as StakeTON from 'services/abis/StakeTON.json';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

type UnstakeFromLayer2 = {
  type: boolean;
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  library: any;
};
const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const unstakeL2 = async (args: UnstakeFromLayer2) => {
  const {type, userAddress, amount, contractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const signer = getSigner(library, userAddress);
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  
  const wtonAmount = utils.parseUnits(amount, '27');
  let inputValue = (Number(wtonAmount.toString()) > Number(maxBalance.toString())) ? maxBalance : wtonAmount;
  
  try {
    let receipt = undefined;
    if (type === false) {
      receipt = await StakeTONContract.connect(signer).tokamakRequestUnStaking(
        TokamakLayer2_ADDRESS,
        wtonAmount,
      );
    } else {
      receipt = await StakeTONContract.connect(
        signer,
      ).tokamakRequestUnStakingAll(TokamakLayer2_ADDRESS);
    }

    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Staking');
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    return store.dispatch(
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
