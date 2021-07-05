import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract, getSigner} from 'utils/contract';
import {utils, ethers} from 'ethers';
import {padLeft, toWei} from 'web3-utils';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as TonABI from 'services/abis/TON.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import {formatEther} from '@ethersproject/units';
import {period} from 'utils/timeStamp';
import {
  REACT_APP_TON,
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
  DEPLOYED,
  REACT_APP_WTON,
} from 'constants/index';
import {TokenType} from 'types/index';
import {convertNumber} from 'utils/number';
import store from 'store';

const provider = ethers.getDefaultProvider('rinkeby');

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
  stakeStartBlock: string | Number;
};
type StakeTon = {
  userAddress: string | null | undefined;
  amount: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
  stakeStartBlock: string | Number;
};

type unstake = {
  userAddress: string | null | undefined;
  stakeEndBlock: string | Number;
  library: any;
  stakeContractAddress: string;
};

type claim = {
  userAddress: string | null | undefined;
  stakeContractAddress: string;
  stakeStartBlock: string | Number;
  library: any;
};

type endsale = {
  userAddress: string | null | undefined;
  vaultContractAddress: string;
  stakeStartBlock: string | Number;
  library: any;
};

type stakeToLayer2Args = {
  userAddress: string | null | undefined;
  amount: string;
  stakeEndBlock: string | Number;
  vaultClosed: boolean;
  library: any;
};

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

const converToWei = (num: string) => toWei(num, 'ether');

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
    stakeStartBlock,
  } = args;

  if (payToken === DEPLOYED.TON) {
    await stakeTon({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      stakeStartBlock: stakeStartBlock,
    });
  } else {
    await stakeEth({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      stakeStartBlock: stakeStartBlock,
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
    stakeStartBlock,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await provider.getBlockNumber();
  if (currentBlock > saleStartBlock && currentBlock < stakeStartBlock) {
    const tonContract = getContract(REACT_APP_TON, TonABI.abi, library);
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = converToWei(amount);
    const abicoder = ethers.utils.defaultAbiCoder;
    const data = abicoder.encode(
      ['address', 'uint256'],
      [stakeContractAddress, tonAmount],
    );

    const signer = getSigner(library, userAddress);

    await tonContract
      .connect(signer)
      ?.approveAndCall(stakeContractAddress, tonAmount, data);
  } else {
    return alert('staking period has ended');
  }
};
const stakeEth = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartBlock,
    library,
    stakeContractAddress,
    stakeStartBlock,
  } = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await provider.getBlockNumber();

  if (currentBlock > saleStartBlock && currentBlock < stakeStartBlock) {
    const transactionRequest: any = {
      to: stakeContractAddress,
      value: utils.parseEther(amount),
    };

    const signer = getSigner(library, userAddress);
    await signer.sendTransaction(transactionRequest);
  } else {
    return alert('staking period has ended');
  }
};

export const withdraw = async (args: unstake) => {
  const {userAddress, stakeEndBlock, library, stakeContractAddress} = args;
  const currentBlock = await provider.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock > stakeEndBlock) {
    const StakeTONContract = await getContract(
      stakeContractAddress,
      StakeTON.abi,
      library,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);

    await StakeTONContract.connect(signer)?.withdraw();
  } else {
    return alert('sale has not ended yet');
  }
};

export const claimReward = async (args: claim) => {
  const {userAddress, stakeContractAddress, stakeStartBlock, library} = args;
  const currentBlock = await provider.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock > stakeStartBlock) {
    const StakeTONContract = await getContract(
      stakeContractAddress,
      StakeTON.abi,
      library,
    );

    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    await StakeTONContract.connect(signer)?.claim();
  }
};

export const closeSale = async (args: endsale) => {
  const {userAddress, vaultContractAddress, stakeStartBlock, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const stakeVault = await getContract(
    vaultContractAddress,
    StakeVault.abi,
    library,
  );
  const currentBlock = await provider.getBlockNumber();
  if (currentBlock > stakeStartBlock) {
    const signer = getSigner(library, userAddress);
    await stakeVault.connect(signer)?.closeSale();
  } else {
    return alert('Staking has not ended yet');
  }
};

export const stakeToLayer2 = async (args: stakeToLayer2Args) => {
  const {userAddress, amount, stakeEndBlock, vaultClosed, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const depositManager = getContract(
    REACT_APP_DEPOSIT_MANAGER,
    DepositManagerABI.abi,
    library,
  );
  const globalWithdrawalDelay = await depositManager?.globalWithdrawalDelay();
  const currentBlock = await provider.getBlockNumber();
  const endBlock = Number(stakeEndBlock);
  if (currentBlock < endBlock - globalWithdrawalDelay && vaultClosed) {
    const tonContract = getContract(REACT_APP_TON, TonABI.abi, library);
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = converToWei(amount);
    const data = getData(REACT_APP_TOKAMAK_LAYER2);
    const signer = getSigner(library, userAddress);
    await tonContract
      .connect(signer)
      .approveAndCall(REACT_APP_WTON, tonAmount, data);
  }
};

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
    console.log(vaultReq);
    console.log(stakeList);

    const currentBlock = await provider.getBlockNumber();

    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        // let info = await stake.stakeVault.stakeInfos(item)

        let mystaked: string = '';
        let myearned: string = '';

        if (account) {
          const {userStaked, userRewardTOS} = await fetchUserData(
            library,
            account,
            stake.stakeContract,
          );
          mystaked = userStaked;
          myearned = `${userRewardTOS}TOS`;
        }
        const status = await getStatus(stake, currentBlock);
        // const miningStartTime = await formatStartTime(
        //   stake.startBlock,
        //   currentBlockNumber,
        // );

        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          // balance: formatEther(info[3]),
          // totalRewardAmount: formatEther(info[4]),
          // claimRewardAmount: formatEther(info[5]),
          totalStakers: stake.totalStakers,
          mystaked,
          myearned,
          stakeBalanceTON: convertNumber({
            amount: stake.totalStakedAmountString,
          }),
          token: stake.paytoken,
          stakeType: stake.stakeType,
          period: period(stake.startBlock, stake.endBlock),
          saleStartTime: stake.slaeStartBlock,
          saleEndTime: stake.startBlock,
          miningStartTime: stake.startBlock,
          miningEndTime: stake.endBlock,
          fetchBlock: currentBlock,
          status,
          library,
          account,
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
  const {userStaked, userRewardTOS} = res;
  return {userStaked, userRewardTOS};
};

const getUserInfo = async (
  // stakeInfo: Partial<Stake>,
  // stakeContractAddress: string,
  library: any,
  account: string,
  contractAddress: string,
) => {
  // const currentBlock = await provider.getBlockNumber();

  const StakeTONContract = getContract(contractAddress, StakeTON.abi, library);
  const staked = await StakeTONContract?.userStaked(account);

  // const TOS = getContract(REACT_APP_TOS, TosABI.abi, library);
  // const myTOS = await TOS?.balanceOf(account);

  // console.log(TOS);

  return {
    userStaked: formatEther(staked.amount),
    userRewardTOS: formatEther(staked.claimedAmount),
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
//   const stakeContractBalanceETH = await provider.getBalance(
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
//       const seigManager = getContract(
//         REACT_APP_SEIG_MANAGER,
//         SeigManagerABI.abi,
//         library,
//       );
//       const depositManager = getContract(
//         REACT_APP_DEPOSIT_MANAGER,
//         DepositManagerABI.abi,
//         library,
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
