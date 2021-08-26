import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import moment from 'moment';
import {setTx} from 'application';

type ExtendPeriod = {
  account: string;
  library: any;
  lockId: string;
  lockupTime: number;
};

export const extendPeriod = async (args: ExtendPeriod) => {
  const {account, library, lockId, lockupTime} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  const signer = getSigner(library, account);
  const res = await LockTOSContract.connect(signer).increaseUnlockTime(
    lockId,
    lockupTime,
  );
  return setTx(res);
};
