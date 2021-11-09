import { DEPLOYED } from 'constants/index';
import { getSigner } from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import store from 'store';
import { setTxPending } from 'store/tx.reducer';
import { toastWithReceipt } from 'utils';
import { openToast } from 'store/app/toast.reducer';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';

type Withdraw = {
    library: any;
    userAddress: string | null | undefined;
   tokenID: number
}
const { UniswapStaker_Address } = DEPLOYED;

export const withdraw = async (args: Withdraw) => {
    const { library, userAddress,tokenID} = args;
    if (userAddress === null || userAddress === undefined) {
        return;
    }

    const signer = getSigner(library, userAddress);


    const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
    );
   
    try {
        const receipt = await uniswapStakerContract.connect(signer).withdrawToken(tokenID, userAddress, '0x');
        store.dispatch(setTxPending({ tx: true }));
        if (receipt) {
            toastWithReceipt(receipt, setTxPending, 'Reward');

        }
    }
    catch (err) {
        store.dispatch(setTxPending({ tx: false }));
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