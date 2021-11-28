import * as PowerTONSwapperABI from 'services/abis/PowerTONSwapper.json';
import * as WTONABI from 'services/abis/WTON.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from 'constants/index';
import {convertNumber} from 'utils/number';

export const isAblePowerTONSwap = async (library: LibraryType) => {
  try {
    if (!library) {
      return console.error('no account or library');
    }
    const {WTON_ADDRESS, PowerTONSwapper_ADDRESS} = DEPLOYED;

    const STAKE_CONTROL_CONTRACT = new Contract(
      WTON_ADDRESS,
      WTONABI.abi,
      library,
    );
    const res = await STAKE_CONTROL_CONTRACT.balanceOf(PowerTONSwapper_ADDRESS);
    const convertedNum = convertNumber({amount: res.toString()});
    return Number(convertedNum) > 0;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const powerTONSwapper = async () => {
  try {
    const {account, library} = store.getState().user.data;
    if (!account || !library) {
      return console.error('no account or library');
    }

    const {PowerTONSwapper_ADDRESS} = DEPLOYED;

    const POWERTONSWAP_CONTRACT = new Contract(
      PowerTONSwapper_ADDRESS,
      PowerTONSwapperABI.abi,
      library,
    );
    const signer = getSigner(library, account);
    const res = await POWERTONSWAP_CONTRACT.connect(signer).swap(
      3000,
      1000,
      0,
      0,
    );

    return setTx(res);
  } catch (e) {
    console.log(e);
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
