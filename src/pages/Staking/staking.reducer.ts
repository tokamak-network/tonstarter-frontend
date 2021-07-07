import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getTokamakContract, getSigner, getRPC} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {BigNumber, utils, ethers} from 'ethers';
import {padLeft, toWei, toBN} from 'web3-utils';
import * as StakeVault from 'services/abis/Stake1Logic.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import {formatEther} from '@ethersproject/units';
import {period} from 'utils/timeStamp';

import {
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
  DEPLOYED,
  REACT_APP_STAKE1_LOGIC,
  REACT_APP_STAKE1_PROXY,
  REACT_APP_WTON,
  REACT_APP_TOS,
} from 'constants/index';
import {TokenType} from 'types/index';
import {convertNumber} from 'utils/number';

const rpc = getRPC();

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  stakeContract: string[];
  balance: Number | string;
  totalRewardAmount: Number | string;
  claimRewardAmount: Number | string;
  totalStakers: number | string;
  token: TokenType;
  withdrawalDelay: string;
  mystaked: Number | string;
  claimableAmount: Number | string;
  myearned: Number | string;
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
  saleStartTime: string | Number;
  library: any;
  stakeContractAddress: string;
  miningStartTime: string | Number;
  handleCloseModal: any;
};
type StakeTon = {
  userAddress: string | null | undefined;
  amount: string;
  saleStartTime: string | Number;
  library: any;
  stakeContractAddress: string;
  miningStartTime: string | Number;
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
  saleEndTime: string | Number;
  library: any;
  canRewardAmount: string;
  myEarned: string;
  handleCloseModal: any;
};

type endsale = {
  userAddress: string | null | undefined;
  vaultContractAddress: string;
  miningEndTime: string | Number;
  library: any;
  handleCloseModal: any;
};

type stakeToLayer2Args = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  miningEndTime: string | Number;
  status: string;
  globalWithdrawalDelay: string;
  library: any;
  handleCloseModal: any;
};

type unstakeFromLayer2Args = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  status: string;
  library: any;
  handleCloseModal: any;
};

type withdraw = {
  userAddress: string | null | undefined;
  contractAddress: string;
  miningEndTime: string
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

// const getUnmarshalString = (str: string) => {
//   if (str.slice(0, 2) === '0x') {
//     return str.slice(2);
//   }
//   return str;
// };
// const getMarshalString = (str: string) => {
//   if (str.slice(0, 2) === '0x') {
//     return str;
//   }
//   return '0x'.concat(str);
// };
// const getData = (operatorLayer2: string) => {
//   const depositManager = getMarshalString(REACT_APP_DEPOSIT_MANAGER);
//   const operator = getUnmarshalString(operatorLayer2);
//   const padDepositManager = padLeft(depositManager, 64);
//   const padOperator = padLeft(operator, 64);
//   return `${padDepositManager}${padOperator}`;
// };

export const stakePaytoken = async (args: StakeProps) => {
  const {
    userAddress,
    amount,
    payToken,
    saleStartTime,
    library,
    stakeContractAddress,
    miningStartTime,
    handleCloseModal,
  } = args;

  if (payToken === DEPLOYED.TON) {
    await stakeTon({
      userAddress: userAddress,
      amount: amount,
      saleStartTime: saleStartTime,
      library: library,
      stakeContractAddress: stakeContractAddress,
      miningStartTime: miningStartTime,
      handleCloseModal: handleCloseModal,
    });
  } else {
    await stakeEth({
      userAddress: userAddress,
      amount: amount,
      saleStartTime: saleStartTime,
      library: library,
      stakeContractAddress: stakeContractAddress,
      miningStartTime: miningStartTime,
      handleCloseModal: handleCloseModal,
    });
  }
};

const stakeTon = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartTime,
    library,
    stakeContractAddress,
    miningStartTime,
    handleCloseModal,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();

  if (currentBlock > saleStartTime && currentBlock < miningStartTime) {
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
      const receipt = await tonContract
        .connect(signer)
        ?.approveAndCall(stakeContractAddress, tonAmount, data);
      alert(`Tx sent successfully! Tx hash is ${receipt.txHash}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    return alert('Not staking period');
  }
};

const stakeEth = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartTime,
    library,
    stakeContractAddress,
    miningStartTime,
    handleCloseModal,
  } = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();

  if (currentBlock > saleStartTime && currentBlock < miningStartTime) {
    const transactionRequest: any = {
      to: stakeContractAddress,
      value: utils.parseEther(amount),
    };

    const signer = getSigner(library, userAddress);
    try {
      const receipt = await signer.sendTransaction(transactionRequest);
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    return alert('staking period has ended');
  }
};

export const unstake = async (args: unstake) => {
  const {
    userAddress,
    endTime,
    library,
    stakeContractAddress,
    mystaked,
    handleCloseModal,
  } = args;
  const currentBlock = await getRPC().getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock < endTime) {
    return alert('sale has not ended yet');
  } else if (mystaked === '0.0') {
    return alert('You have no staked balance in this vault.');
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
      const receipt = await StakeTONContract.connect(signer)?.withdraw();
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    } catch (err) {
      console.log(err);
    }
  }
};

export const claimReward = async (args: claim) => {
  const {
    userAddress,
    stakeContractAddress,
    saleEndTime,
    library,
    canRewardAmount,
    myEarned,
  } = args;
  const currentBlock = await getRPC().getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock < saleEndTime) {
    return alert('Sale is not ended!');
    } else if (canRewardAmount === '0.0') {
      return alert('unsufficient reward');
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
      const receipt = await StakeTONContract.connect(signer)?.claim();
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);;
    } catch (err) {
      console.log(err);
    }
  }
};

export const closeSale = async (args: endsale) => {
  const {
    userAddress,
    vaultContractAddress,
    miningEndTime,
    library,
    handleCloseModal,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const stakeVault = await new Contract(
    REACT_APP_STAKE1_PROXY,
    StakeVault.abi,
    rpc,
  );
  const currentBlock = await getRPC().getBlockNumber();
  if (currentBlock < miningEndTime) {
    const signer = getSigner(library, userAddress);
    try {
      const receipt = await stakeVault.connect(signer)?.closeSale(vaultContractAddress);
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    return alert('Staking has not ended yet');
  }
};

export const stakeToLayer2 = async (args: stakeToLayer2Args) => {
  const {
    userAddress,
    amount,
    miningEndTime,
    contractAddress,
    status,
    globalWithdrawalDelay,
    library,
    handleCloseModal,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const currentBlock = await getRPC().getBlockNumber();
  const endBlock = Number(miningEndTime);
  const TON = getTokamakContract('TON');
  const tonBalance = await TON.balanceOf(userAddress);
  const tonAmount = convertToWei(amount);

  if (currentBlock > endBlock - Number(globalWithdrawalDelay)) {
    return alert('staking period has ended'); // ToDo: comment check
  } else if ( status === 'end') {
    return alert('sale is not closed!') ;
  } else if (tonBalance < tonAmount) {
    return alert('unsufficient balance!');
  } else {
    const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    try {
      const receipt = await StakeTONContract.connect(signer).tokamakStaking(REACT_APP_TOKAMAK_LAYER2, amount);
      console.log(receipt);
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    } catch (err) {
      console.log(err);
    }
  }
};

export const unstakeL2 = async (args: unstakeFromLayer2Args) => {
  const {
    userAddress,
    amount,
    contractAddress,
    status,
    library,
    handleCloseModal,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const signer = getSigner(library, userAddress);
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  // const depositManager = new Contract(REACT_APP_DEPOSIT_MANAGER, DepositManagerABI.abi, rpc);
  const tonAmount = convertToWei(amount);
  if (status === 'end') {
    try {
      const receipt = await StakeTONContract.connect(signer).tokamakRequestUnStakingAll(
        REACT_APP_TOKAMAK_LAYER2,
      );
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    return alert('Sale is not ended yet!')
  }
};

export const swapWTONtoTOS = async (args: unstakeFromLayer2Args) => {
  const {
    userAddress,
    amount,
    contractAddress,
    status,
    library,
    handleCloseModal,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const ray = '1' + '0'.repeat(27);

  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const amountRay = toBN(amount).mul(toBN(ray));
  console.log(amountRay);
  console.log(amountRay.toString());
  const signer = getSigner(library, userAddress);
  const deadline = Date.now() / 1000 + 900;
  let amountOutMinimum = toBN('0');
  try {
    const receipt = await StakeTONContract.connect(signer).exchangeWTONtoTOS(
      amount,
      0,
      parseInt(deadline.toString()),
      0,
      1,
    );
    alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);;
  } catch (err) {
    console.log(err);
  }
};

export const withdraw = async (args: withdraw) => {
  const {userAddress, contractAddress, miningEndTime, library, handleCloseModal} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const signer = getSigner(library, userAddress);
  const endBlock = Number(miningEndTime);
  if (endBlock > currentBlock) {
    try {
      const receipt = await StakeTONContract.connect(signer).withdraw();
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    return alert('not withdrawable time.')
  }
};

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({library, account, chainId, reFetch}: any, {requestId, getState}) => {
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
        let mystaked: string = '';
        let myearned: string = '';

        if (account) {
          const {userStaked, userRewardTOS} = await fetchUserData(
            library,
            account,
            stake.stakeContract,
          );
          mystaked = userStaked;
          myearned = userRewardTOS;
        }
        const status = await getStatus(stake, currentBlock);

        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          totalStakers: stake.totalStakers,
          mystaked: convertNumber({
            amount: mystaked,
          }),
          myearned: convertNumber({
            amount: myearned,
          }),
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

export const fetchManageModalPayload = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const res = await getUserInfoForManage(library, account, contractAddress);
  return res;
};

const getUserInfoForManage = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const currentBlock = getRPC().getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const L2Contract = getTokamakContract('TokamakLayer2');
  const TON = getTokamakContract('TON');
  const WTON = getTokamakContract('WTON');
  const depositManager = getTokamakContract('DepositManager');
  const seigManager = getTokamakContract('SeigManager');

  return Promise.all([
    StakeTONContract?.userStaked(account),
    L2Contract?.stakedOf(account),
    StakeTONContract.totalStakedAmount(),
    seigManager.stakeOf(REACT_APP_TOKAMAK_LAYER2, contractAddress),
    depositManager.pendingUnstaked(REACT_APP_TOKAMAK_LAYER2, contractAddress),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
    StakeTONContract.canRewardAmount(account, currentBlock),
    depositManager.globalWithdrawalDelay(),
  ])
    .then((result) => {
      return {
        userRewardTOS: formatEther(result[0].claimedAmount),
        userWithdraw: formatEther(result[0].releasedAmount),
        userStakedAmount: convertNumber({
          amount: result[1],
          type: 'ray',
        }),
        totalStakedAmount: convertNumber({
          amount: result[2],
        }),
        totalStakedAmountL2: convertNumber({
          amount: result[3],
        }),
        totalPendingUnstakedAmountL2: convertNumber({
          amount: result[4],
          type: 'ray',
        }),
        stakeContractBalanceWton: convertNumber({
          amount: result[5],
          type: 'ray',
        }),
        stakeContractBalanceTon: convertNumber({
          amount: result[6],
        }),
        canRewardAmount: convertNumber({
          amount: result[7],
        }),
        globalWithdrawalDelay: result[8].toString(),
      };
    })
    .catch((e) => console.log(e));
};

const fetchUserData = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const res = await getUserInfo(library, account, contractAddress);
  const {
    userStaked,
    userRewardTOS,
  } = res;
  return {
    userStaked,
    userRewardTOS,
  };
};

const getUserInfo = async (
  // stakeInfo: Partial<Stake>,
  // stakeContractAddress: string,
  library: any,
  account: string,
  contractAddress: string,
) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const staked = await StakeTONContract?.userStaked(account);
  return {
    userStaked: staked.amount,
    userRewardTOS: staked.claimedAmount,
  };
};

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
