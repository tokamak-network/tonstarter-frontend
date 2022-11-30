import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import moment from 'moment';

type ExtendPeriod = {
  account: string;
  library: any;
  lockId: string;
  period: number;
};

export const extendPeriod = async (args: ExtendPeriod) => {
  const {account, library, lockId, period} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  console.log('**EXTEND PERIOD**');
  console.log(lockId, period);

  const signer = getSigner(library, account);
  const unlockTime = moment().subtract(-Math.abs(period), 'weeks').unix();
  const res = await LockTOSContract.connect(signer).increaseUnlockTime(
    lockId,
    unlockTime,
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
