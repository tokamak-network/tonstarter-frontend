import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {BigNumber} from 'ethers';
import moment from 'moment';

type UnstkaeTOS = {
  account: string;
  amount: string;
  period: number;
  library: any;
};

export const unstakeTOS = (args: UnstkaeTOS) => {
  const {account, library} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const signer = getSigner(library, account);

  return LockTOSContract.connect(signer).withdraw();
};
