import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract, getSigner} from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import {BigNumber, utils, ethers} from 'ethers';
import {padLeft, toWei, toBN} from 'web3-utils';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as TonABI from 'services/abis/TON.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import * as TosABI from 'services/abis/ITOS.json';
import {formatEther} from '@ethersproject/units';
import {period, formatStartTime, formatEndTime} from 'utils/timeStamp';
import {
  REACT_APP_TON,
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
  DEPLOYED,
  REACT_APP_WTON,
  REACT_APP_TOS,
} from 'constants/index';
import {TokenType} from 'types/index';
import {convertNumber} from 'utils/number';

// const provider = ethers.getDefaultProvider('rinkeby');
// const rpc = new JsonRpcProvider('https://rinkeby.rpc.tokamak.network');
const rpc = new JsonRpcProvider('https://rinkeby.infura.io/v3/34448178b25e4fbda6d80f4da62afba2');
// const rpc = new JsonRpcProvider('http://183.98.80.217:8545')

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  cap: string;
  saleStartBlock: string | number;
  stakeStartBlock: string | number;
  stakeEndBlock: string | number;
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
  myton: Number | string;
  myfld: Number | string;
  mystaked: Number | string;
  myearned: Number | string;
  mywithdraw: Number | string;
  myclaimed: Number | string;
  canRewardAmount: Number | string;
  stakeBalanceTON: string;
  stakeBalanceETH: Number | string;
  stakeBalanceFLD: Number | string;
  tokamakStaked: Number | string;
  tokamakPendingUnstaked: Number | string;
  staketype: string;
  period: string;
  startTime: string;
  endTime: string;
  status: string;
  library: any;
  account: any;
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
};
type StakeTon = {
  userAddress: string | null | undefined;
  amount: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
  startTime: string | Number;
};

type unstake = {
  userAddress: string | null | undefined;
  endTime: string | Number;
  library: any;
  stakeContractAddress: string;
};

type claim = {
  userAddress: string | null | undefined;
  stakeContractAddress: string;
  startTime: string | Number;
  library: any;
  myClaimed: string;
  myEarned: string;
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
    startTime,
  } = args;

  if (payToken === DEPLOYED.TON) {
    await stakeTon({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      startTime: startTime,
    });
  } else {
    await stakeEth({
      userAddress: userAddress,
      amount: amount,
      saleStartBlock: saleStartBlock,
      library: library,
      stakeContractAddress: stakeContractAddress,
      startTime: startTime,
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
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await rpc.getBlockNumber();

  if (currentBlock > saleStartBlock && currentBlock < startTime) {
    const tonContract = new Contract(REACT_APP_TON, TonABI.abi, rpc);
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
  } = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await rpc.getBlockNumber();

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
  const {userAddress, endTime, library, stakeContractAddress} = args;
  const currentBlock = await rpc.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock > endTime) {
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
      await StakeTONContract.connect(signer)?.unstake();
    } catch (err) {
      console.log(err)
    }
  } else {
    return alert('sale has not ended yet');
  }
};

export const claimReward = async (args: claim) => {
  const {userAddress, stakeContractAddress, startTime, library, myClaimed, myEarned} = args;
  const currentBlock = await rpc.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock < startTime) {
    return alert('Sale is not ended!');
  } else if (myClaimed === '0.0') {
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
      await StakeTONContract.connect(signer)?.claim();
    } catch (err) {
      console.log(err);
    }
  }
};

export const closeSale = async (args: endsale) => {
  const {userAddress, vaultContractAddress, stakeStartBlock, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const stakeVault = await new Contract(
    vaultContractAddress,
    StakeVault.abi,
    rpc,
  );
  const currentBlock = await rpc.getBlockNumber();
  if (currentBlock > stakeStartBlock) {
    const signer = getSigner(library, userAddress);
    try {
      await stakeVault.connect(signer)?.closeSale();
    } catch (err) {
      console.log(err)
    }
  } else {
    return alert('Staking has not ended yet');
  }
};

export const stakeToLayer2 = async (args: stakeToLayer2Args) => {
  const {userAddress, amount, stakeEndBlock, vaultClosed, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const depositManager = new Contract(
    REACT_APP_DEPOSIT_MANAGER,
    DepositManagerABI.abi,
    rpc,
  );
  const globalWithdrawalDelay = await depositManager?.globalWithdrawalDelay();
  const currentBlock = await rpc.getBlockNumber();
  const endBlock = Number(stakeEndBlock);
  if (currentBlock < endBlock - globalWithdrawalDelay && vaultClosed) {
    const tonContract = new Contract(REACT_APP_TON, TonABI.abi, rpc);
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = converToWei(amount);
    const data = getData(REACT_APP_TOKAMAK_LAYER2);
    const signer = getSigner(library, userAddress);
    try {
      await tonContract
        .connect(signer)
        .approveAndCall(REACT_APP_WTON, tonAmount, data);
    } catch (err) {
      console.log(err)
    }
  } else {
    return alert('staking period has ended'); // ToDo: comment check
  }
};

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({contract, library, account, chainId}: any, {requestId, getState}) => {
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

    console.log(stakeReq);

    // console.log(vaultReq);
    // console.log(stakeList);

    console.log('-----------');

    await Promise.all(
      stakeList.map(async (stake: any, index: number) => {
        // let info = await stake.stakeVault.stakeInfos(item)

        let mystaked: string = '';
        let myearned: string = '';
        let status = 'loading';

        if (account) {
          console.log('--acount--');
          const {userStaked, userRewardTOS} = await fetchUserData(
            library,
            account,
            stake.stakeContract,
          );
          mystaked = userStaked;
          myearned = `${userRewardTOS}TOS`;
        }

        setTimeout(async () => {
          status = await getStatus(stake);
        }, 10);


        const stakeInfo: Partial<Stake> = {
          contractAddress: stake.stakeContract,
          name: stake.name,
          saleStartBlock: 0,
          stakeStartBlock: 0,
          stakeEndBlock: 0,
          // balance: formatEther(info[3]),
          // totalRewardAmount: formatEther(info[4]),
          // claimRewardAmount: formatEther(info[5]),
          totalStakers: stake.totalStakers,
          myton: formatEther(0),
          myfld: formatEther(0),
          mystaked,
          myearned,
          mywithdraw: formatEther(0),
          myclaimed: formatEther(0),
          canRewardAmount: formatEther(0),
          // stakeBalanceTON: convertNumber({
          //   amount: String(stake.totalStakedAmount),
          // }),
          stakeBalanceTON: convertNumber({
            amount: stake.totalStakedAmountString,
          }),
          stakeBalanceETH: formatEther(0),
          stakeBalanceFLD: formatEther(0),
          tokamakStaked: formatEther(0),
          tokamakPendingUnstaked: formatEther(0),
          token: stake.paytoken,
          stakeType: stake.stakeType,
          period: period(stake.startBlock, stake.endBlock),
          startTime: stake.startBlock,
          endTime: stake.endBlock,
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

    return projects;
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
  // const currentBlock = await rpc.getBlockNumber();

  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const staked = await StakeTONContract?.userStaked(account);

  // const TOS = new Contract(REACT_APP_TOS, TosABI.abi, rpc);
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

const getTimes = async (startTime: any, endTime: any) => {
  const fetchedStartTime = await formatStartTime(startTime);
  const fetchedEndTime = await formatEndTime(startTime, endTime);
  return {fetchedStartTime, fetchedEndTime};
};

export const getStatus = async (args: any) => {
  const {blockNumber, saleStartBlock, saleClosed} = args;
  const currentBlock = await rpc.getBlockNumber();
  // if (saleClosed) {
  //   return 'sale';
  // }
  // if (blockNumber >= saleStartBlock) {
  //   // return 'sale';
  // }
  return 'start';
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
//   const stakeContractBalanceETH = await rpc.getBalance(
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
