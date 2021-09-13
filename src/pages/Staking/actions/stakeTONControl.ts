import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import StakeTONControl from 'services/abis/StakeTONControl.json';

export async function stakeTonControl(account: string, library: any) {
  const {StakeTonControl_ADDRESS} = DEPLOYED;
  const StakeTonControl_CONTRACT = new Contract(
    StakeTonControl_ADDRESS,
    StakeTONControl.abi,
    library,
  );
  const res = await StakeTonControl_CONTRACT.canWithdrawLayer2All();
  if (!res.can || res.can === false) {
    return;
  }
  const signer = getSigner(library, account);
  return await setTx(
    StakeTonControl_CONTRACT.connect(signer).withdrawLayer2AllAndSwapAll([
      0, 0, 0, 0,
    ]),
  );
}

export async function checkCanWithdrawLayr2All(library: any) {
  const {StakeTonControl_ADDRESS} = DEPLOYED;
  const StakeTonControl_CONTRACT = new Contract(
    StakeTonControl_ADDRESS,
    StakeTONControl.abi,
    library,
  );
  const res = await StakeTonControl_CONTRACT.canWithdrawLayer2All();
  return res.can;
}
