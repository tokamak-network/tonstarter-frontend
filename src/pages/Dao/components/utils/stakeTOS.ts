import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getContract, getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as TOSABI from 'services/abis/TOS.json';
import moment from 'moment';

type StkaeTOS = {
  account: string;
  amount: string;
  period: number;
  library: any;
};

export const stakeTOS = async (args: StkaeTOS) => {
  const {account, library, amount, period} = args;
  const {LockTOS_ADDRESS, TOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const tosContract = getContract(TOS_ADDRESS, TOSABI.abi, library);

  const unlockTime = moment().subtract(-Math.abs(period), 'weeks').unix();
  const signer = getSigner(library, account);

  console.log(amount);

  const res = await tosContract
    .connect(signer)
    .approve(LockTOSContract.address, amount);

  await res.wait(3).then(() => {
    return LockTOSContract.connect(signer).createLock(amount, unlockTime);
  });
};
