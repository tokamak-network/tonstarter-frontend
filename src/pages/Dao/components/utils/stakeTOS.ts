import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {BigNumber} from 'ethers';
import moment from 'moment';

type StkaeTOS = {
  account: string;
  amount: string;
  period: number;
  library: any;
};

export const stakeTOS = (args: StkaeTOS) => {
  const {account, library, amount, period} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const unlockTime = moment().subtract(-Math.abs(period), 'weeks').unix();
  const signer = getSigner(library, account);
  // const BNamount = BigNumber.from(amount);

  console.log(amount);
  console.log(LockTOSContract);

  return LockTOSContract.connect(signer).createLock(amount, unlockTime);
};
