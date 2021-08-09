import { getSigner } from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {DEPLOYED} from 'constants/index';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';

type Stake = {
  tokenId: string;
  userAddress: string | null | undefined;
  library: any;
  // handleCloseModal: any;
}
const {UniswapStaking_Address, NPM_Address} = DEPLOYED;

export const stake = async (args: Stake) => {
  const { userAddress, tokenId, library } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  
  const StakeUniswap = new Contract(UniswapStaking_Address, StakeUniswapABI.abi, library);
  const signer = getSigner(library, userAddress);
  
  try {
    const receipt = await StakeUniswap.connect(signer)?.stake(tokenId)
  
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Pool');
    }
  } catch (err) {
    console.log(err);
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