import { DEPLOYED } from 'constants/index';
import { getSigner } from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import store from 'store';
import { setTxPending } from 'store/tx.reducer';
import { toastWithReceipt } from 'utils';
import { openToast } from 'store/app/toast.reducer';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import { utils, ethers } from 'ethers';

type Refund = {
    library: any;
    userAddress: string | null | undefined;
    key: Key
}

type Key = {
    rewardToken: string,
    pool: string,
    startTime: number,
    endTime: number,
    refundee: string
}
const { UniswapStaker_Address } = DEPLOYED;

export const refund = async (args: Refund) => {
    const { library, userAddress, key } = args;
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
        
        const receipt = await uniswapStakerContract.connect(signer).endIncentive(key);
        store.dispatch(setTxPending({ tx: true }));
        if (receipt) {
            toastWithReceipt(receipt, setTxPending, 'Reward');

        }
    }
    catch (err) {
        console.log(err);
        
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