import {getSigner, getRPC} from 'utils/contract';
import {setTxPending} from 'store/tx.reducer';
import store from 'store';
import {Contract} from '@ethersproject/contracts';

import {toWei, toBN} from 'web3-utils';
import * as StakeTON from 'services/abis/StakeTON.json';

type UnstakeFromLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  status: string;
  library: any;
  handleCloseModal: any;
};

const rpc = getRPC();

export const swapWTONtoTOS = async (args: UnstakeFromLayer2) => {
  const {userAddress, amount, contractAddress, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const amountRay = toWei(amount, 'gether');
  const signer = getSigner(library, userAddress);
  let deadline = Date.now() / 1000 + 900;
  console.log(deadline)
  deadline = parseInt(deadline.toString());
  console.log(deadline)
  try {
    const receipt = await StakeTONContract.connect(signer).exchangeWTONtoTOS(
      amountRay,
      toBN('0'),
      deadline,
      toBN('0'),
      toBN('1'),
    );
    store.dispatch(setTxPending({tx: true}));
    alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    if (receipt) {
      store.dispatch(setTxPending({tx: false}));
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
