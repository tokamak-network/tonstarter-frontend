import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import {convertToWei} from 'utils/number';
import {finalPermit, tosPermit} from 'utils/permit';

type StkaeTOS = {
  account: string;
  amount: string;
  period: number;
  library: any;
  handleCloseModal: any;
};

export const stakeTOS = async (args: StkaeTOS) => {
  const {account, library, amount, period} = args;
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  const permit = await tosPermit(account, library, 10000);
  console.log(permit);
  //@ts-ignore
  const {method, params} = permit;
  const fPermit = await finalPermit(method, params, account);
  console.log(fPermit);
  const {_v, _r, _s} = fPermit;
  const weiAmount = convertToWei(amount);
  // const unlockTime = moment().subtract(-Math.abs(period), 'weeks').format('ss');
  const unlockTime = Number(period) * 7 * 24 * 60 * 60;

  const signer = getSigner(library, account);

  console.log({weiAmount, unlockTime, _v, _r, _s});

  const res = await LockTOSContract.connect(signer).createLockPermit(
    weiAmount,
    unlockTime,
    _v,
    _r,
    _s,
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
