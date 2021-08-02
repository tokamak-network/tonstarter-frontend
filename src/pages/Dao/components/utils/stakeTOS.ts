import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getContract, getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as TOSABI from 'services/abis/TOS.json';
import moment from 'moment';
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

  const tosContract = getContract(TOS_ADDRESS, TOSABI.abi, library);
  const weiAmount = convertToWei(amount);
  // const unlockTime = moment().subtract(-Math.abs(period), 'weeks').format('ss');
  const unlockTime = Number(period) * 7 * 24 * 60 * 60;

  const signer = getSigner(library, account);
  const res = await tosContract
    .connect(signer)
    .approve(LockTOSContract.address, weiAmount);

  const fres = await res.wait().then(() => {
    return LockTOSContract.connect(signer).createLock(weiAmount, unlockTime);
  });

  return await fres.wait().then((receipt: any) => {
    store.dispatch(
      setTransaction({
        transactionType: 'Dao',
        blockNumber: receipt.blockNumber,
      }),
    );
  });
};
