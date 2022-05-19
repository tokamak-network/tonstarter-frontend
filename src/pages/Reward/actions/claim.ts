import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';

type Claim = {
  library: any;
  userAddress: string | null | undefined;
  rewardToken: any;
};
const {UniswapStaker_Address} = DEPLOYED;

export const claim = async (args: Claim) => {
  const {library, userAddress, rewardToken} = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const signer = getSigner(library, userAddress);

  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );
  // const claimAmount = ethers.utils.parseEther(amount.toString())
  try {
    const receipt = await uniswapStakerContract
      .connect(signer)
      .claimReward(rewardToken.token, userAddress, rewardToken.claimable);
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Reward');
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
};
