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
import {soliditySha3} from 'web3-utils';

const {UniswapStaker_Address} = DEPLOYED;

export const unstakeLP = async (args: any) => {
  const {library, userAddress, key, stakedPools} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );
  const signer = getSigner(library, userAddress);

  const incentiveABI =
    'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
  const abicoder = ethers.utils.defaultAbiCoder;
  const incentiveId = soliditySha3(abicoder.encode([incentiveABI], [key]));

  let stakerIds: any[] = [];

  // Need to wait for the loops to finish before unstaking otherwise stakerIds will be empty.
  await Promise.all(
    stakedPools.map(async (pool: any) => {
      const incentiveInfo = await uniswapStakerContract
        .connect(signer)
        .stakes(Number(pool.id), incentiveId);

      if (incentiveInfo.liquidity._hex !== '0x00') {
        console.log(incentiveInfo.liquidity);
        stakerIds.push(pool.id);
      }
    }),
  );

  const arrayData = stakerIds.map((tokenid: any) => {
    const data = uniswapStakerContract.interface.encodeFunctionData(
      'unstakeToken',
      [key, tokenid],
    );
    return data;
  });

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
