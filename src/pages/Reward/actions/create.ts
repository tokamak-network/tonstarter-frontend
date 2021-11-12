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
import * as TOSABI from 'services/abis/TOS.json';
import { createReward, getRandomKey } from '../components/api';
import {utils, ethers} from 'ethers';
type Create = {
  library: any;
  amount: number;
  userAddress: string | null | undefined;
  poolAddress: string;
  startTime: number,
  endTime: number,
  name: string,
  setAlllowed: any,
  rewardToken: string
};
type CreateReward = {
  poolName: string;
  poolAddress: string;
  rewardToken: string;
  incentiveKey: object;
  startTime: number;
  endTime: number;
  allocatedReward: string;
  numStakers: number;
  status: string;
  account: string;
  verified: boolean;
  tx: string;
  sig: string;
};
const { TOS_ADDRESS,DOC_ADDRESS, TON_ADDRESS, UniswapStaker_Address } = DEPLOYED;

const generateSig = async (account: string, key: any) => {
  const randomvalue = await getRandomKey(account);
  // const pool = '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf';

  //@ts-ignore
  const web3 = new Web3(window.ethereum);
  if (randomvalue != null) {
    const randomBn = new BigNumber(randomvalue).toFixed(0);
    const soliditySha3 = await web3.utils.soliditySha3(
      { type: 'string', value: account },
      { type: 'uint256', value: randomBn },
      { type: 'string', value: key.rewardToken },
      { type: 'string', value: key.pool },
      { type: 'uint256', value: key.startTime },
      { type: 'uint256', value: key.endTime },
    );
    //@ts-ignore
    const sig = await web3.eth.personal.sign(soliditySha3, account, '');

    return sig;
  } else {
    return '';
  }
};


export const create = async (args: Create) => {
  
  const { library, amount, userAddress, poolAddress, startTime, endTime, name, setAlllowed, rewardToken } = args;
  if (userAddress === null || userAddress === undefined || library === undefined) {
    return;
  }
  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );

  const weiAllocated = ethers.utils.parseEther(amount.toString())

  const tosContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const signer = getSigner(library, userAddress);

  const key = {
    rewardToken:rewardToken,
    pool: poolAddress,
    startTime: startTime,
    endTime: endTime,
    refundee: userAddress,
  };
  console.log('key', key);
  console.log(weiAllocated);
  
  try {
    
    const receipt = await uniswapStakerContract
      .connect(signer)
      .createIncentive(key, weiAllocated);
    store.dispatch(setTxPending({ tx: true }));
    await receipt.wait();
    
    if (receipt) {
      toastWithReceipt(receipt, setTxPending, 'Reward');
      const sig = await generateSig(userAddress.toLowerCase(), key);
      const arg: CreateReward = {
        poolName: name,
        poolAddress: poolAddress,
        rewardToken: rewardToken,
        account: userAddress,
        incentiveKey: key,
        startTime: startTime,
        endTime: endTime,
        allocatedReward: weiAllocated.toString(),
        numStakers: 0,
        status: 'open',
        verified: true,
        tx: receipt,
        sig: sig,
      };
      setAlllowed(0);
      const create = await createReward(arg);
      console.log('create', create);
     
    }
  } catch (err) {
    store.dispatch(setTxPending({ tx: false }));
    console.log('err', err);
    
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


