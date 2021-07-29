import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';

type IncreaseAmount = {
  account: string;
  library: any;
  lockId: string;
  amount: string;
};

export const increaseAmount = async (args: IncreaseAmount) => {
  const {account, library, lockId, amount} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  const signer = getSigner(library, account);
  const res = await LockTOSContract.connect(signer).increaseAmount(
    lockId,
    amount,
  );

  return await res.wait().then((receipt: any) => {
    store.dispatch(
      setTransaction({
        transactionType: 'Dao',
        blockNumber: receipt.blockNumber,
      }),
    );
  });
};
