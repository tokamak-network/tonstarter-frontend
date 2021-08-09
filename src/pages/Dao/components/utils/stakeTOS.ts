import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import * as TOSABI from 'services/abis/TOS.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTransaction} from 'store/refetch.reducer';
import {convertToWei} from 'utils/number';
import {permitForCreateLock} from 'utils/permit';

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

  // const permit = await tosPermit(account, library, 10000);
  // //@ts-ignore
  // const {method, params} = permit;
  // const fPermit = await finalPermit(method, params, account);
  // const {_v, _r, _s} = fPermit;
  const weiAmount = convertToWei(amount);
  // const unlockTime = moment().subtract(-Math.abs(period), 'weeks').format('ss');
  // const unlockTime = Number(period) * 7 * 24 * 60 * 60;

  const signer = getSigner(library, account);

  // permitForCreateLock(account, library, weiAmount, unlockTime);

  const firstRes = await TOSContract.connect(signer).approve(
    LockTOS_ADDRESS,
    weiAmount,
  );

  await firstRes.wait().then((receipt: any) => {
    if (receipt) {
      LockTOSContract.connect(signer).createLock(
        weiAmount,
        period,
        // _v,
        // _r,
        // _s,
      );
    }
  });

  // return await finalRes.wait().then((receipt: any) => {
  //   if (receipt) {
  //     store.dispatch(
  //       setTransaction({
  //         transactionType: 'Dao',
  //         blockNumber: receipt.blockNumber,
  //       }),
  //     );
  //   }
  // });
};
