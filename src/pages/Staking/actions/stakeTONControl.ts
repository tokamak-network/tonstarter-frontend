import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTx} from 'application';
import StakeTONControl from 'services/abis/StakeTONControl.json';
import {LibraryType} from 'types';

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
  const tx = await StakeTonControl_CONTRACT.connect(
    signer,
  ).withdrawLayer2AllAndSwapAll([0, 0, 0, 0]);
  return setTx(tx);
}

export async function checkCanWithdrawLayr2All(library: LibraryType) {
  try {
    if (!library) {
      return console.error('no library for view function');
    }
    const {StakeTonControl_ADDRESS} = DEPLOYED;
    const StakeTonControl_CONTRACT = new Contract(
      StakeTonControl_ADDRESS,
      StakeTONControl.abi,
      library,
    );
    const res = await StakeTonControl_CONTRACT.canWithdrawLayer2All();
    return res.can;
  } catch (e) {
    return false;
  }
  //   return LockTOSContract.connect(signer).withdrawLayer2AllAndSwapAll();
}
