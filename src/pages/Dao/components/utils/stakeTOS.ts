import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import * as TOSABI from 'services/abis/TOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import {convertToWei} from 'utils/number';

type StkaeTOS = {
  account: string;
  amount: string;
  period: number;
  library: any;
  handleCloseModal: any;
};

export const stakeTOS = async (args: StkaeTOS) => {
  const {account, library, amount, period} = args;
  const {LockTOS_ADDRESS, TOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const TOSContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const weiAmount = convertToWei(amount);
  const signer = getSigner(library, account);

  return await LockTOSContract.connect(signer).createLock(weiAmount, period);
};
