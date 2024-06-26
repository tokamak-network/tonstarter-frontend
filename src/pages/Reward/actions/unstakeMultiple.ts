import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {utils, ethers} from 'ethers';

const {UniswapStaker_Address} = DEPLOYED;

export const unstakeMultiple = async (args: any) => {
  const {library, tokenid, userAddress, stakeKeyList} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  if (stakeKeyList.length === 0) {
    return alert(`Please select rewards to unstake`);
  }
  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );
  const signer = getSigner(library, userAddress);

  const arrayData = await Promise.all(
    stakeKeyList.map((key: any) => {
      const keyGenerated = {
        pool: key.pool,
        startTime: key.startTime,
        endTime: key.endTime,
        rewardToken: key.rewardToken,
        refundee: key.refundee,
      };
      const data = uniswapStakerContract.interface.encodeFunctionData(
        'unstakeToken',
        [keyGenerated, tokenid],
      );
      return data;
    }),
  );

  // const incentiveKeyAbi = 'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)'
  // const abicoder = ethers.utils.defaultAbiCoder;

  // const data = abicoder.encode([`${incentiveKeyAbi}[]`], [arrayData]);
  try {
    const receipt = await uniswapStakerContract
      .connect(signer)
      .multicall(arrayData);
    store.dispatch(setTxPending({tx: true}));
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Reward');
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
    console.log(err);
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