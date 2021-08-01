import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';

type Claim = {
  account: string;
  stakeContractAddress: string;
  library: any;
};

export const claimReward = async (args: Claim) => {
  const {account, library, stakeContractAddress} = args;

  if (account === null || account === undefined) {
    return;
  }

  const StakeTONContract = await new Contract(
    stakeContractAddress,
    StakeTON.abi,
    library,
  );

  if (!StakeTONContract) {
    throw new Error(`Can't find the contract for staking actions`);
  }
  const signer = getSigner(library, account);
  try {
    const receipt = await StakeTONContract.connect(signer)?.claim();
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Staking');
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
  }
};
