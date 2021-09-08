import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
// import store from 'store';
import {convertToWei} from 'utils/number';
import {setTx} from 'application';

type IncreaseAmount = {
  account: string;
  library: any;
  lockId: string;
  amount: string;
  allBalance: boolean;
};

export const increaseAmount = async (args: IncreaseAmount) => {
  const {account, library, lockId, amount, allBalance} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const weiAmount = allBalance ? amount : convertToWei(amount);
  const signer = getSigner(library, account);

  const res = await LockTOSContract.connect(signer).increaseAmount(
    lockId,
    weiAmount,
  );
  return setTx(res);
};
