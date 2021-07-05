import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getTokamakContract, getSigner, getRPC} from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import {BigNumber, utils, ethers} from 'ethers';
import {padLeft, toWei} from 'web3-utils';
import * as StakeVault from 'services/abis/Stake1Logic.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import {formatEther} from '@ethersproject/units';
import {period} from 'utils/timeStamp';
import {toBN} from 'web3-utils';
import {
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
  DEPLOYED,
  REACT_APP_STAKE1_LOGIC,
  REACT_APP_STAKE1_PROXY,
  REACT_APP_WTON,
} from 'constants/index';
import {TokenType} from 'types/index';
import {convertNumber} from 'utils/number';
import store from 'store';

const rpc = getRPC();

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  defiAddr: string;
  stakeContract: string[];
  balance: Number | string;
  totalRewardAmount: Number | string;
  claimRewardAmount: Number | string;
  totalStakers: number | string;
  token: TokenType;
  mystaked: Number | string;
  myearned: Number | string;
  mywithdraw: Number | string;
  myStakedL2: string;
  totalStakedAmountInL2: string;
  totalPendingUnstakedAmountInL2: string;
  stakeContractBalanceWTON: string;
  stakeContractBalanceTON: string;
  stakeBalanceTON: string;
  staketype: string;
  period: string;
  status: string;
  library: any;
  account: any;
  fetchBlock: number | undefined;
  saleStartTime: string | undefined;
  saleEndTime: string | undefined;
  miningStartTime: string | undefined;
  miningEndTime: string | undefined;
  vault: string;
};

interface StakeState {
  data: Stake[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

type StakeProps = {
  userAddress: string | null | undefined;
  amount: string;
  payToken: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
  startTime: string | Number;
  handleCloseModal: any;
};
type StakeTon = {
  userAddress: string | null | undefined;
  amount: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
  startTime: string | Number;
  handleCloseModal: any;
};

type unstake = {
  userAddress: string | null | undefined;
  endTime: string | Number;
  library: any;
  stakeContractAddress: string;
  mystaked: string;
  handleCloseModal: any;
};

type claim = {
  userAddress: string | null | undefined;
  stakeContractAddress: string;
  startTime: string | Number;
  library: any;
  myClaimed: string;
  myEarned: string;
  handleCloseModal: any;
};

type endsale = {
  userAddress: string | null | undefined;
  vaultContractAddress: string;
  stakeStartBlock: string | Number;
  library: any;
  handleCloseModal: any;
};

type stakeToLayer2Args = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  stakeEndBlock: string | Number;
  vaultClosed: boolean;
  library: any;
  handleCloseModal: any;
};

type unstakeFromLayer2Args = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  vaultClosed: boolean;
  library: any;
  handleCloseModal: any;
};

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

const convertToWei = (num: string) => toWei(num, 'ether');

const getUnmarshalString = (str: string) => {
  if (str.slice(0, 2) === '0x') {
    return str.slice(2);
  }
  return str;
};
const getMarshalString = (str: string) => {
  if (str.slice(0, 2) === '0x') {
    return str;
  }
  return '0x'.concat(str);
};
const getData = (operatorLayer2: string) => {
  const depositManager = getMarshalString(REACT_APP_DEPOSIT_MANAGER);
  const operator = getUnmarshalString(operatorLayer2);
  const padDepositManager = padLeft(depositManager, 64);
  const padOperator = padLeft(operator, 64);
  return `${padDepositManager}${padOperator}`;
};

export const stakePaytoken = async (args: StakeProps) => {
  const {
    userAddress,
    amount,
    payToken,
    saleStartBlock,
    library,
    stakeContractAddress,
    startTime,
    handleCloseModal,
  } = args;

  if (payToken === DEPLOYED.TON) {
    await stakeTon({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      startTime: startTime,
      handleCloseModal: handleCloseModal
    });
  } else {
    await stakeEth({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      startTime: startTime,
      handleCloseModal: handleCloseModal,
    });
  }
};

const stakeTon = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartBlock,
    library,
    stakeContractAddress,
    startTime,
    handleCloseModal,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();

  if (currentBlock > saleStartBlock && currentBlock < startTime) {
    const tonContract = getTokamakContract('TON');
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = convertToWei(amount);
    const abicoder = ethers.utils.defaultAbiCoder;
    const data = abicoder.encode(
      ['address', 'uint256'],
      [stakeContractAddress, tonAmount],
    );
    const signer = getSigner(library, userAddress);

    try {
      await tonContract
        .connect(signer)
        ?.approveAndCall(stakeContractAddress, tonAmount, data);
    } catch (err) {
      console.log(err)
    }
  } else {
    return alert('Not staking period');
  }
};

const stakeEth = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartBlock,
    library,
    stakeContractAddress,
    startTime,
    handleCloseModal,
  } = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();

  if (currentBlock > saleStartBlock && currentBlock < startTime) {
    const transactionRequest: any = {
      to: stakeContractAddress,
      value: utils.parseEther(amount),
    };

    const signer = getSigner(library, userAddress);
    try {
      await signer.sendTransaction(transactionRequest);
    } catch (err) {
      console.log(err)
    }
    
  } else {
    
    return alert('staking period has ended');
  }
};

export const unstake = async (args: unstake) => {
  const {userAddress, endTime, library, stakeContractAddress, mystaked, handleCloseModal} = args;
  const currentBlock = await getRPC().getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock < endTime) {
    return alert('sale has not ended yet');
  } else if (mystaked === "0.0") {
    return alert('You have no staked balance in this vault.')
  } else {
    const StakeTONContract = await new Contract(
      stakeContractAddress,
      StakeTON.abi,
      rpc,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    try {
      await StakeTONContract.connect(signer)?.withdraw();
    } catch (err) {
      console.log(err)
    }
    
  }
};

export const claimReward = async (args: claim) => {
  const {userAddress, stakeContractAddress, startTime, library, myClaimed, myEarned} = args;
  const currentBlock = await getRPC().getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock < startTime) {
    return alert('Sale is not ended!');
  // } else if (myClaimed === '0.0') {
  //   return alert('unsufficient reward');
  } else {
    const StakeTONContract = await new Contract(
      stakeContractAddress,
      StakeTON.abi,
      rpc,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    try {
      await StakeTONContract.connect(signer)?.claim();
    } catch (err) {
      console.log(err);
    }
  }
};

export const closeSale = async (args: endsale) => {
  const {userAddress, vaultContractAddress, stakeStartBlock, library, handleCloseModal} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const stakeVault = await new Contract(
    REACT_APP_STAKE1_PROXY,
    StakeVault.abi,
    rpc,
  );
  const currentBlock = await getRPC().getBlockNumber();
  // if (currentBlock > stakeStartBlock) {
    const signer = getSigner(library, userAddress);
    try {
      await stakeVault.connect(signer)?.closeSale(vaultContractAddress);
    } catch (err) {
      console.log(err)
    }
    
  // } else {
  //   return alert('Staking has not ended yet');
  // }
};

export const stakeToLayer2 = async (args: stakeToLayer2Args) => {
  const {userAddress, amount, stakeEndBlock, contractAddress, vaultClosed, library, handleCloseModal} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const depositManager = getTokamakContract('DepositManager');
  const globalWithdrawalDelay = await depositManager?.globalWithdrawalDelay();
  const currentBlock = await getRPC().getBlockNumber();
  const endBlock = Number(stakeEndBlock);
  // if (currentBlock < endBlock - globalWithdrawalDelay && vaultClosed) {
    const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = convertToWei(amount);
    const signer = getSigner(library, userAddress);
    try {
      await StakeTONContract
        .connect(signer)
        .tokamakStaking(REACT_APP_TOKAMAK_LAYER2, tonAmount);
    } catch (err) {
      console.log(err)
    }
    
  // } else {
  //   return alert('staking period has ended'); // ToDo: comment check
  // }
};

export const unstakeL2 = async (args: unstakeFromLayer2Args) => {
  const {userAddress, amount, contractAddress, vaultClosed, library, handleCloseModal} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const signer = getSigner(library, userAddress);
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  // const depositManager = new Contract(REACT_APP_DEPOSIT_MANAGER, DepositManagerABI.abi, rpc);
  const tonAmount = convertToWei(amount);
  
  try {
    await StakeTONContract
    .connect(signer).tokamakRequestUnStakingAll(REACT_APP_TOKAMAK_LAYER2);
  } catch (err) {
    console.log(err);
  }
  ;
}

export const swapWTONtoTOS = async (args: unstakeFromLayer2Args) => {
  const {userAddress, amount, contractAddress, vaultClosed, library, handleCloseModal} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const ray = '1' + '0'.repeat(27);
  
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const amountRay = toBN(amount).mul(toBN(ray));
  console.log(amountRay);
  console.log(amountRay.toString());
  const signer = getSigner(library, userAddress);
  const deadline = Date.now()/1000 + 900;
  let amountOutMinimum = toBN('0');
  try {
    await StakeTONContract.connect(signer).exchangeWTONtoTOS(ray, ray, parseInt(deadline.toString()), toBN('0'), toBN('0'))
  } catch (err) {
    console.log(err)
  }
}

export const withdraw = async (args: unstakeFromLayer2Args) => {
  const {userAddress, amount, contractAddress, vaultClosed, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const signer = getSigner(library, userAddress);

  try {
    await StakeTONContract.connect(signer).withdraw();
  } catch(err) {
    console.log(err);
  }
}

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async (
    {contract, library, account, chainId, reFetch}: any,
    {requestId, getState},
  ) => {
    //result to dispatch data for Stakes store
    let projects: any[] = [];

    const chainIdforFetch = chainId === undefined ? '4' : chainId;
    const fetchValutUrl = `http://3.36.66.138:4000/v1/vaults?chainId=${chainIdforFetch}`;
    const fetchStakeUrl = `http://3.36.66.138:4000/v1/stakecontracts?chainId=${chainIdforFetch}`;
    // let iERC20: any;

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      console.log('peding || requestId && currentRequestId');
      console.log(`${loading} || ${requestId} || ${currentRequestId}`);
      return;
    }

    const vaultReq = await fetch(fetchValutUrl)
      .then((res) => res.json())
      .then((result) => result);

    const stakeReq = await fetch(fetchStakeUrl)
      .then((res) => res.json())
      .then((result) => result);

    const stakeList = stakeReq.datas;

    console.log('-----------api-----------');
    // console.log(vaultReq);
    // console.log(stakeList);

    const currentBlock = await rpc.getBlockNumber();

    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        // let info = await stake.stakeVault.stakeInfos(item)
        // console.log('-------info--------')
        // console.log(stake);

        let mystaked: string = '';
        let myearned: string = '';
        let myStakedL2: string = '';
        let mywithdraw: string = '';
        let totalStakedAmountInL2: string = '';
        let totalPendingUnstakedAmountInL2: string = '';
        let stakeContractBalanceWTON: string = '';
        let stakeContractBalanceTON: string = '';

        if (account) {
          const {
            userStaked, 
            userRewardTOS,
            userWithdraw,
            userStakedAmount, 
            totalStakedAmount,
            totalPendingUnstakedAmount,
            stakeContractBalanceWton,
            stakeContractBalanceTon,
          } = await fetchUserData(
            library,
            account,
            stake.stakeContract,
          );
          mystaked = userStaked;
          // myearned = `${userRewardTOS} TOS`;
          myearned = userRewardTOS;
          mywithdraw = userWithdraw;
          myStakedL2 = userStakedAmount;
          totalStakedAmountInL2 = totalStakedAmount;
          totalPendingUnstakedAmountInL2 = totalPendingUnstakedAmount;
          stakeContractBalanceWTON = stakeContractBalanceWton;
          stakeContractBalanceTON = stakeContractBalanceTon;
        }
        const status = await getStatus(stake, currentBlock);
        // const miningStartTime = await formatStartTime(
        //   stake.startBlock,
        //   currentBlockNumber,
        // );

        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          totalStakers: stake.totalStakers,
          mystaked,
          myearned: convertNumber({
            amount: myearned
          }),
          mywithdraw,
          myStakedL2: convertNumber({
            amount: myStakedL2,
            type: 'ray',
          }),
          totalStakedAmountInL2: convertNumber({
            amount: totalStakedAmountInL2
          }),
          totalPendingUnstakedAmountInL2: convertNumber({
            amount: totalPendingUnstakedAmountInL2,
            type: 'ray',
          }),
          stakeContractBalanceWTON: convertNumber({
            amount: stakeContractBalanceWTON
          }),
          stakeContractBalanceTON: convertNumber({
            amount: stakeContractBalanceTON
          }),
          // tokamakStaked: formatEther(0),
          // tokamakPendingUnstaked: formatEther(0),
          stakeBalanceTON: convertNumber({
            amount: stake.totalStakedAmountString,
          }),
          token: stake.paytoken,
          stakeType: stake.stakeType,
          period: period(stake.startBlock, stake.endBlock),
          saleStartTime: stake.saleStartBlock,
          saleEndTime: stake.startBlock,
          miningStartTime: stake.startBlock,
          miningEndTime: stake.endBlock,
          fetchBlock: currentBlock,
          status,
          library,
          account,
          vault: stake.vault,
        };
        // const test = await getUserInfo(library, account);
        // console.log(test);
        // await infoTokamak(stakeInfo, stake, index, library, account);
        projects.push(stakeInfo);
      }),
    );

    const finalStakeList: any = [];

    //sort by api data
    stakeList.map((stake: any) => {
      projects.map((project, index) => {
        if (stake.name === project.name) {
          return finalStakeList.push(project);
        }
        return null;
      });
      return null;
    });

    return finalStakeList;
  },
);

const fetchUserData = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const res = await getUserInfo(library, account, contractAddress);
  const {
    userStaked, 
    userRewardTOS,
    userWithdraw, 
    userStakedAmount, 
    totalStakedAmount,
    totalPendingUnstakedAmount,
    stakeContractBalanceWton,
    stakeContractBalanceTon,
  } = res;

  return {
    userStaked, 
    userRewardTOS,
    userWithdraw,
    userStakedAmount, 
    totalStakedAmount,
    totalPendingUnstakedAmount,
    stakeContractBalanceWton,
    stakeContractBalanceTon,
  };
};

const getUserInfo = async (
  // stakeInfo: Partial<Stake>,
  // stakeContractAddress: string,
  library: any,
  account: string,
  contractAddress: string,
) => {
  // const currentBlock = await getRPC().getBlockNumber();
  const L2Contract = getTokamakContract('TokamakLayer2');
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const staked = await StakeTONContract?.userStaked(account);
  const TON = getTokamakContract('TON');
  const WTON = getTokamakContract('WTON');
  const depositManager = getTokamakContract('DepositManager');
  // const seigManager = getTokamakContract('SeigManager');

  let totalStakedAmount = await StakeTONContract.totalStakedAmount();

  let pendingUnstaked = await depositManager.pendingUnstaked(REACT_APP_TOKAMAK_LAYER2, contractAddress);
  // let stakeOf = await seigManager.stakeOf(REACT_APP_TOKAMAK_LAYER2, contractAddress);
  let stakeContractBalanceWTON = await WTON.balanceOf(contractAddress);
  let stakeContractBalanceTON = await TON.balanceOf(contractAddress);
  let stakedAmountInL2;
  try {
    stakedAmountInL2 = await L2Contract?.stakedOf(account);
  } catch (err) {
    console.log(err);
  }

  // const TOS = new Contract(REACT_APP_TOS, TosABI.abi, rpc);
  // const myTOS = await TOS?.balanceOf(account);

  // console.log(TOS);

  return {
    userStaked: formatEther(staked.amount),
    // userRewardTOS: formatEther(staked.claimedAmount),
    userRewardTOS: staked.claimedAmount,
    userWithdraw: formatEther(staked.releasedAmount),
    userStakedAmount: stakedAmountInL2,
    totalStakedAmount: totalStakedAmount,
    totalPendingUnstakedAmount: pendingUnstaked,
    stakeContractBalanceWton: stakeContractBalanceWTON,
    stakeContractBalanceTon: stakeContractBalanceTON,
  };
  // stakeInfo.myfld = formatEther(myTOS);

  // const saleBlock = await StakeTONContract?.saleStartBlock();
  // stakeInfo.saleStartBlock = Number(saleBlock);

  // stakeInfo.mystaked = formatEther(staked.amount);
  // stakeInfo.myclaimed = formatEther(staked.claimedAmount);
  // stakeInfo.mywithdraw = formatEther(staked.releasedAmount);
};

// const getTimes = async (startTime: any, endTime: any) => {
//   const fetchedStartTime = await formatStartTime(startTime);
//   const fetchedEndTime = await formatEndTime(startTime, endTime);
//   return {fetchedStartTime, fetchedEndTime};
// };

export const getStatus = async (args: any, blockNumber: number) => {
  if (blockNumber === 0) {
    return 'loading';
  }
  const {startBlock, endBlock} = args;
  const currentBlock = blockNumber;
  if (currentBlock < startBlock) {
    return 'sale';
  }
  if (currentBlock >= startBlock && currentBlock <= endBlock) {
    return 'start';
  }
  return 'end';
};

// const total = await StakeTONContract?.totalStakers();
// stakeInfo.totalStakers = total.toString();

//   if (Number(stakeInfo.mystaked) > 0) {
//     try {
//       let canRewardAmount = await StakeTONContract?.canRewardAmount(
//         account,
//         currentBlock,
//       );
//       stakeInfo.canRewardAmount = utils.formatUnits(canRewardAmount, 18);
//     } catch (err) {}
//   }
//   const stakeContractBalanceFLD = await FLD?.balanceOf(stakeContractAddress);
//   const stakeContractBalanceTON = await TON?.balanceOf(stakeContractAddress);
//   const stakeContractBalanceETH = await getRPC().getBalance(
//     stakeContractAddress,
//   );
//   stakeInfo.stakeBalanceFLD = formatEther(stakeContractBalanceFLD);
//   stakeInfo.stakeBalanceTON = formatEther(stakeContractBalanceTON);
//   stakeInfo.stakeBalanceETH = formatEther(stakeContractBalanceETH);
// };

// const infoTokamak = async (
//   stakeInfo: Partial<Stake>,
//   stakeContractAddress: string,
//   index: number,
//   library: any,
//   account: string,
// ) => {
//   if (index < stakeInfos.length) {
//     try {
//       const seigManager = new Contract(
//         REACT_APP_SEIG_MANAGER,
//         SeigManagerABI.abi,
//         rpc,
//       );
//       const depositManager = new Contract(
//         REACT_APP_DEPOSIT_MANAGER,
//         DepositManagerABI.abi,
//         rpc,
//       );
//       const staked = await seigManager?.stakeOf(
//         REACT_APP_TOKAMAK_LAYER2,
//         stakeContractAddress,
//       );
//       stakeInfo.tokamakStaked = utils.formatUnits(staked, 27);

//       const pendingUnstaked = await depositManager?.pendingUnstaked(
//         REACT_APP_TOKAMAK_LAYER2,
//         stakeContractAddress,
//       );
//       stakeInfo.tokamakPendingUnstaked = utils.formatUnits(pendingUnstaked, 27);
//     } catch (err) {
//       console.log('infoTokamak err', err);
//     }
//   }
// };

export const stakeReducer = createSlice({
  name: 'stakes',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStakes.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchStakes.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStakes.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});
// @ts-ignore
export const selectStakes = (state: RootState) => state.stakes;
