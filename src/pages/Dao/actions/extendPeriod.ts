import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
// import store from 'store';
import {setTx} from 'application';

type ExtendPeriod = {
  account: string;
  library: any;
  lockId: string;
  lockupTime: number;
  handleCloseModal: any;
};

export const extendPeriod = async (args: ExtendPeriod) => {
  try {
    const {account, library, lockId, lockupTime, handleCloseModal} = args;
    const {LockTOS_ADDRESS} = DEPLOYED;
    const LockTOSContract = new Contract(
      LockTOS_ADDRESS,
      LockTOSABI.abi,
      library,
    );

    const signer = getSigner(library, account);
    handleCloseModal();
    const res = await LockTOSContract.connect(signer).increaseUnlockTime(
      lockId,
      lockupTime,
    );
    return setTx(res);
  } catch (e) {
    console.log(e);
  }
};
