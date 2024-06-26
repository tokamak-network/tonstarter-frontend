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

const {NPM_Address, UniswapStaker_Address} = DEPLOYED;

export const refundMultiple = async (args: any) => {
  const {library, userAddress, refundKeyList, stakedPools} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  if (refundKeyList.length === 0) {
    return alert(`Please select rewards to refund`);
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

  const arrayData = await Promise.all(
    refundKeyList.map(async (key: any) => {
      const keyGenerated = {
        pool: key.pool,
        startTime: key.startTime,
        endTime: key.endTime,
        rewardToken: key.rewardToken,
        refundee: key.refundee,
      };

      let stakerIds: any[] = [];

      const incentiveId = soliditySha3(abicoder.encode([incentiveABI], [key]));

      await Promise.all(
        stakedPools.map(async (pool: any) => {
          const incentiveInfo = await uniswapStakerContract
            .connect(signer)
            .stakes(Number(pool.id), incentiveId);

          if (incentiveInfo.liquidity._hex !== '0x00') {
            stakerIds.push(pool.id);
          }
        }),
      );

      if (stakerIds.length > 0) {
        let data = await Promise.all(
          stakerIds.map(async (tokenid: any) => {
            const data =
              await uniswapStakerContract.interface.encodeFunctionData(
                'unstakeToken',
                [keyGenerated, tokenid],
              );
            return data;
          }),
        );

        const refundData = uniswapStakerContract.interface.encodeFunctionData(
          'endIncentive',
          [keyGenerated],
        );

        data.push(refundData);
        return data;
      } else {
        const refundData = uniswapStakerContract.interface.encodeFunctionData(
          'endIncentive',
          [keyGenerated],
        );

        return refundData;
      }
    }),
  );

  const flattenedArrayData = arrayData.flat();

  try {
    const receipt = await uniswapStakerContract
      .connect(signer)
      .multicall(flattenedArrayData);
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