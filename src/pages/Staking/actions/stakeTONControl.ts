import {DEPLOYED} from 'constants/index';
import {getTokamakContract, getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTx} from 'application';
import StakeTONControl from 'services/abis/StakeTONControl.json';

export async function stakeTonControl() {
  const {account, library} = store.getState().user.data;
  if (!account || !library) {
    return console.error('no account or library');
  }
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
  return await StakeTonControl_CONTRACT.connect(
    signer,
  ).withdrawLayer2AllAndSwapAll([0, 0, 0, 0, 0]);
}

export async function checkCanWithdrawLayr2All() {
  if (!store.getState().user.data) {
    return;
  }
  const {account, library} = store.getState().user.data;
  if (!account || !library) {
    return console.error('no account or library');
  }
  const {StakeTonControl_ADDRESS} = DEPLOYED;
  const StakeTonControl_CONTRACT = new Contract(
    StakeTonControl_ADDRESS,
    StakeTONControl.abi,
    library,
  );
  const res = await StakeTonControl_CONTRACT.canWithdrawLayer2All();
  return res.can;
  //   return LockTOSContract.connect(signer).withdrawLayer2AllAndSwapAll();
}
