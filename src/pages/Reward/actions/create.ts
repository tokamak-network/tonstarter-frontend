import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {createReward, getRandomKey} from '../components/api';
import {ethers} from 'ethers';
import moment from 'moment';

type Create = {
  library: any;
  amount: string;
  userAddress: string | null | undefined;
  poolAddress: string;
  startTime: number;
  endTime: number;
  name: string;
  setAlllowed: any;
  setEnd: any;
  setEndArr: any;
  setStart: any;
  setStartArr: any;
  setRewardAddress: any;
  rewardToken: string;
  setCreated: any;
  setTokeninfo: any;
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
const {WTON_ADDRESS, DOC_ADDRESS, TON_ADDRESS, UniswapStaker_Address} =
  DEPLOYED;

const generateSig = async (account: string, key: any) => {
  const randomvalue = await getRandomKey(account);
  // const pool = '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf';

  //@ts-ignore
  const web3 = new Web3(window.ethereum);
  if (randomvalue != null) {
    const randomBn = new BigNumber(randomvalue).toFixed(0);
    const soliditySha3 = await web3.utils.soliditySha3(
      {type: 'string', value: account},
      {type: 'uint256', value: randomBn},
      {type: 'string', value: key.rewardToken},
      {type: 'string', value: key.pool},
      {type: 'uint256', value: key.startTime},
      {type: 'uint256', value: key.endTime},
    );
    //@ts-ignore
    const sig = await web3.eth.personal.sign(soliditySha3, account, '');

    return sig;
  } else {
    return '';
  }
};

export const create = async (args: Create) => {
  const {
    library,
    amount,
    userAddress,
    poolAddress,
    startTime,
    endTime,
    name,
    setAlllowed,
    setEnd,
    setEndArr,
    setStart,
    setStartArr,
    rewardToken,
    setRewardAddress,
    setCreated,
    setTokeninfo,
  } = args;
  if (
    userAddress === null ||
    userAddress === undefined ||
    library === undefined
  ) {
    return;
  }
  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );
  // let amountFotmatted = ethers.utils.parseEther(amount);
  let amountFotmatted;
  if (
    ethers.utils.getAddress(rewardToken) ===
    ethers.utils.getAddress(WTON_ADDRESS)
  ) {
    const rayAllocated = ethers.utils.parseUnits(amount, '27');
    amountFotmatted = rayAllocated;
  } else {
    const weiAllocated = ethers.utils.parseEther(amount);
    amountFotmatted = weiAllocated;
  }

  const signer = getSigner(library, userAddress);
  const key = {
    rewardToken: rewardToken,
    pool: poolAddress,
    startTime: startTime,
    endTime: endTime,
    refundee: userAddress,
  };
  try {
    const receipt = await uniswapStakerContract
      .connect(signer)
      .createIncentive(key, amountFotmatted);
    store.dispatch(setTxPending({tx: true}));
    await receipt.wait();

    if (receipt) {
      // const nowTimeStamp = moment().unix();

      toastWithReceipt(receipt, setTxPending, 'Reward', 'Reward');
      const sig = await generateSig(userAddress.toLowerCase(), key);
      const arg: CreateReward = {
        poolName: name,
        poolAddress: poolAddress,
        rewardToken: rewardToken,
        account: userAddress,
        incentiveKey: key,
        startTime: startTime,
        endTime: endTime,
        allocatedReward: amountFotmatted.toString(),
        numStakers: 0,
        status: 'open',
        verified: true,
        tx: receipt,
        sig: sig,
      };
      setAlllowed(0);
      setEnd(0);
      setStart(0);
      setEndArr([0, 0, 0]);
      setStartArr([0, 0, 0]);
      setRewardAddress('');
      setCreated(receipt);
      setTokeninfo([]);
      const create = await createReward(arg);
    }
  } catch (err) {
    store.dispatch(setTxPending({tx: false}));
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
};