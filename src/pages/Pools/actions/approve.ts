import { getSigner } from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED} from 'constants/index';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';

type Approve = {
  tokenId: string;
  userAddress: string | null | undefined;
  library: any;
}
const {NPM_Address, UniswapStaking_Address} = DEPLOYED;

export const approve = async (args: Approve) => {
  const { userAddress, tokenId, library } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const NPM = new Contract(NPM_Address, NPMABI.abi, library);
  const signer = getSigner(library, userAddress);

  try {
    const receipt = await NPM.connect(signer)?.approve(UniswapStaking_Address, tokenId)
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending);
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
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
}