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

type Claim = {
    library: any;
    userAddress: string | null | undefined;
    amount: string;
    rewardToken: string;
}
const { NPM_Address, UniswapStaker_Address } = DEPLOYED;

export const claim = async (args: Claim) => {
    const { library, userAddress, amount, rewardToken } = args;
    if (userAddress === null || userAddress === undefined) {
        return;
    }

    const signer = getSigner(library, userAddress);


    const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
    );

    const claimAmount = ethers.utils.parseEther(amount.toString())
    try {
        const receipt = await uniswapStakerContract.connect(signer).claimReward(rewardToken, userAddress, claimAmount);
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