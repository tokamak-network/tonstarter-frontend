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

type Stake = {
  library: any;
  tokenid: number;
  userAddress: string | null | undefined;
  startTime: Number,
  endTime: Number,
  rewardToken: string;
  poolAddress: string;
  refundee: string;
};

const { NPM_Address, UniswapStaker_Address } = DEPLOYED;

export const stake = async (args: Stake) => {
  const { library, tokenid, userAddress, startTime, endTime, rewardToken, poolAddress, refundee } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const NPM = new Contract(NPM_Address, NPMABI.abi, library);

  const signer = getSigner(library, userAddress);
  const key = {
    rewardToken: rewardToken,
    pool: poolAddress,
    startTime: startTime,
    endTime: endTime,
    refundee: refundee
  }
  console.log(key);
  
  const incentiveKeyAbi = 'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)'
  const abicoder = ethers.utils.defaultAbiCoder;
  const data = abicoder.encode([incentiveKeyAbi], [key],);
  console.log(data);

  try {
    const receipt = await NPM.connect(signer).safeTransferFrom(userAddress, UniswapStaker_Address, tokenid, data);
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