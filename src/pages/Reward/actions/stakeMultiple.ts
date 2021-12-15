import { DEPLOYED } from 'constants/index';
import { getSigner } from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import store from 'store';
import { setTxPending } from 'store/tx.reducer';
import { toastWithReceipt } from 'utils';
import { openToast } from 'store/app/toast.reducer';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import { utils, ethers } from 'ethers';

const { NPM_Address, UniswapStaker_Address } = DEPLOYED;

export const stakeMultiple = async (args: any) => {
  const { library, tokenid, userAddress, stakeKeyList, unstakeKeyList } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const NPM = new Contract(NPM_Address, NPMABI.abi, library);
  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );
  
  const signer = getSigner(library, userAddress);
  const depositInfo = await uniswapStakerContract
  .connect(signer)
  .deposits(tokenid);


  if (stakeKeyList.length === 0) {
    const arrayData = unstakeKeyList.map((key: any) => {
      const keyGenereated = {
        pool: key.pool,
        startTime: key.startTime,
        endTime: key.endTime,
        rewardToken: key.rewardToken,
        refundee: key.refundee
      }
      const data = uniswapStakerContract.interface.encodeFunctionData('unstakeToken', [keyGenereated, tokenid])
      return data;
    })
    try {
      const receipt = await uniswapStakerContract.connect(signer).multicall(arrayData);
      store.dispatch(setTxPending({ tx: true }));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Reward');

      }
    }
    catch (err) {
      store.dispatch(setTxPending({ tx: false }));
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

  }

  else if (unstakeKeyList.length === 0) {
    
    try {

      if (depositInfo.owner.toLowerCase() !== userAddress.toLowerCase()) {
        // const arrayData = stakeKeyList.map((key: any) => {
        //   const keyGenereated = {
        //     pool: key.pool,
        //     startTime: key.startTime,
        //     endTime: key.endTime,
        //     rewardToken: key.rewardToken,
        //     refundee: key.refundee
        //   }
        //   const data = uniswapStakerContract.interface.encodeFunctionData('safeTransferFrom', [keyGenereated, tokenid])
        //   return data;
        // })
        const arrayData = stakeKeyList.map((key: any) => {
          return {
              pool: key.pool,
              startTime: key.startTime,
              endTime: key.endTime,
              rewardToken: key.rewardToken,
              refundee: key.refundee,
          }
             
          })
      const incentiveKeyAbi = 'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)'
      const abicoder = ethers.utils.defaultAbiCoder;
  
        const data = abicoder.encode([`${incentiveKeyAbi}[]`], [arrayData]);

        const receipt = await NPM.connect(signer).safeTransferFrom(userAddress, UniswapStaker_Address, tokenid, data);
        store.dispatch(setTxPending({ tx: true }));
        if (receipt) {
          toastWithReceipt(receipt, setTxPending, 'Reward');
  
        }
      }
      else {
        const arrayData = stakeKeyList.map((key: any) => {
          const keyGenereated = {
            pool: key.pool,
            startTime: key.startTime,
            endTime: key.endTime,
            rewardToken: key.rewardToken,
            refundee: key.refundee
          }
          const data = uniswapStakerContract.interface.encodeFunctionData('stakeToken', [keyGenereated, tokenid])
          return data;
        })
        const receipt = await uniswapStakerContract.connect(signer).multicall(arrayData);
        store.dispatch(setTxPending({ tx: true }));
        if (receipt) {
          toastWithReceipt(receipt, setTxPending, 'Reward');
  
        }
      }
     
    }
    catch (err) {
      store.dispatch(setTxPending({ tx: false }));
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

  }

  else {
    const arrayDataUnstake = unstakeKeyList.map((key: any) => {
      const keyGenereated = {
        pool: key.pool,
        startTime: key.startTime,
        endTime: key.endTime,
        rewardToken: key.rewardToken,
        refundee: key.refundee
      }
      const dataUnstake = uniswapStakerContract.interface.encodeFunctionData('unstakeToken', [keyGenereated, tokenid])
      return dataUnstake;
    })
    const arrayDataStake = stakeKeyList.map((key: any) => {
      const keyGenereated = {
        pool: key.pool,
        startTime: key.startTime,
        endTime: key.endTime,
        rewardToken: key.rewardToken,
        refundee: key.refundee
      }
      const dataStake = uniswapStakerContract.interface.encodeFunctionData('stakeToken', [keyGenereated, tokenid])
      return dataStake;
    })
    try {
      const receipt = await uniswapStakerContract.connect(signer).multicall(arrayDataUnstake.concat(arrayDataStake));
      store.dispatch(setTxPending({ tx: true }));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Reward');

      }
    }
    catch (err) {
      store.dispatch(setTxPending({ tx: false }));
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
  }
}