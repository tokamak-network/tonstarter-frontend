import * as StakeTONUnstaking from 'services/abis/StakeTONUnstaking.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from 'constants/index';

export const isUnstakeL2All = async (library: LibraryType) => {
  const {unstakeLayer2All} = DEPLOYED;

  const STAKE_CONTROL_CONTRACT = new Contract(
    unstakeLayer2All,
    StakeTONUnstaking.abi,
    library,
  );
  const res = await STAKE_CONTROL_CONTRACT.canRequestUnstakingLayer2All();
  console.log('testtesttest');
  console.log(res);
  return res;
};

export const requestUnstakingLayer2All = async () => {
  try {
    const {account, library} = store.getState().user.data;
    if (!account || !library) {
      return console.error('no account or library');
    }
    const {unstakeLayer2All} = DEPLOYED;

    const STAKE_CONTROL_CONTRACT = new Contract(
      unstakeLayer2All,
      StakeTONUnstaking.abi,
      library,
    );
    const signer = getSigner(library, account);
    const res = await STAKE_CONTROL_CONTRACT.connect(
      signer,
    ).requestUnstakingLayer2All();

    return setTx(res);
  } catch (e) {
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          status: 'error',
          title: 'Tx fail to send',
          description: `something went wrong`,
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  }
};
