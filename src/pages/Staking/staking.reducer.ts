import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract} from 'utils/contract';
import {BigNumber, utils, ethers} from 'ethers';
import {padLeft} from 'web3-utils';
import moment from 'moment';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as TonABI from 'services/abis/TON.json';
import * as FldABI from 'services/abis/FLD.json';
import * as SeigManagerABI from 'services/abis/SeigManager.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import {formatEther} from '@ethersproject/units';
import {period, formatStartTime, formatEndTime} from 'utils/timeStamp';
import {
  REACT_APP_TON,
  REACT_APP_WTON,
  REACT_APP_FLD,
  REACT_APP_SEIG_MANAGER,
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
} from 'constants/index';
import {useWeb3React} from '@web3-react/core';

const provider = ethers.getDefaultProvider('rinkeby');
const stakeInfos: Array<any> = [];
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
  balance: BigNumber | string;
  totalRewardAmount: BigNumber | string;
  claimRewardAmount: BigNumber | string;
  totalStakers: number | string;
  myton: BigNumber | string;
  myfld: BigNumber | string;
  mystaked: BigNumber | string;
  mywithdraw: BigNumber | string;
  myclaimed: BigNumber | string;
  canRewardAmount: BigNumber | string;
  stakeBalanceTON: BigNumber | string;
  stakeBalanceETH: BigNumber | string;
  stakeBalanceFLD: BigNumber | string;
  tokamakStaked: BigNumber | string;
  tokamakPendingUnstaked: BigNumber | string;
  token: string;
  staketype: string;
  period: string | number;
  startTime: string;
  endTime: string;
};

interface StakeState {
  data: Stake[];
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

type StakeTon = {
  userAddress: string | null | undefined;
  tonAmount: string;
  library: any;
};

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

const converToWei = (num: string) => utils.formatUnits(num, 18);

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

export const stakeTon = async (args: StakeTon) => {
  const {userAddress, tonAmount, library} = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  console.log(userAddress);
  const contract = getContract(REACT_APP_TON, TonABI.abi, library);
  if (!contract) {
    throw new Error(`Can't find the contract for staking actions`);
  }
  const amount = converToWei(tonAmount);
  const data = getData(REACT_APP_TOKAMAK_LAYER2);
  console.log(userAddress);
  console.log(data);
  await contract
    .approveAndCall(REACT_APP_WTON, amount, data)
    .send({from: userAddress})
    .on('transactionHash', async (transactionHash: any) => {
      console.log(typeof transactionHash);
      // const transaction = {
      //   from: userAddress,
      //   type: 'Delegated',
      //   amount,
      //   transactionHash,
      //   target: operatorLayer2,
      //   timestamp: moment().unix(),
      // };
    })
    .on('receipt', (receipt: any) => {
      //success to make a transaction
      console.log(receipt);
    });
  // .on('confirmation', async (confirmationNumber: number) => {
  //   if (confirmationNumber === 0) {
  //     console.log(confirmationNumber);
  //     //be confirmed to stake
  //   }
  // });

  // const result = contract.approveAndCall()
};

export const unStakeTon = async () => {};

export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({contract, library, account}: any, {requestId, getState}) => {
    let stakeVaults: any[] = [];
    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    if (contract) {
      const vaults = await contract.vaultsOfPahse(1);
      console.log(vaults);

      await Promise.all(
        vaults.map(async (vault: any) => {
          const stakeVault = await getContract(vault, StakeVault.abi, library);
          const stakeType = await stakeVault?.stakeType();
          const token = await stakeVault.paytoken();
          const stakeList: string[] = await stakeVault?.stakeAddressesAll();

          console.log(stakeList);

          stakeVaults = await Promise.all(
            stakeList.map(async (item, index) => {
              let info = await stakeVault.stakeInfos(item);

              // console.log(info);
              // console.log(item);

              const startTime = await formatStartTime(info[1]);
              const endTime = await formatEndTime(info[1], info[2]);

              const stakeInfo: Partial<Stake> = {
                stakeContract: stakeList,
                name: info.name,
                saleStartBlock: 0,
                stakeStartBlock: info[1],
                stakeEndBlock: info[2],
                balance: formatEther(info[3]),
                totalRewardAmount: formatEther(info[4]),
                claimRewardAmount: formatEther(info[5]),
                totalStakers: 0,
                myton: formatEther(0),
                myfld: formatEther(0),
                mystaked: formatEther(0),
                mywithdraw: formatEther(0),
                myclaimed: formatEther(0),
                canRewardAmount: formatEther(0),
                stakeBalanceTON: formatEther(0),
                stakeBalanceETH: formatEther(0),
                stakeBalanceFLD: formatEther(0),
                tokamakStaked: formatEther(0),
                tokamakPendingUnstaked: formatEther(0),
                token,
                stakeType,
                period: period(info[1], info[2]),
                startTime: startTime,
                endTime: endTime,
              };
              stakeInfos.push(stakeInfo);
              await getMy(stakeInfo, stakeList[0], library, account);
              await infoTokamak(
                stakeInfo,
                stakeList[0],
                index,
                library,
                account,
              );
              return stakeInfo;
            }),
          );
        }),
      );
    }
    return stakeVaults;
  },
);

const getMy = async (
  stakeInfo: Partial<Stake>,
  stakeContractAddress: string,
  library: any,
  account: string,
) => {
  const currentBlock = await provider.getBlockNumber();
  const TON = await getContract(REACT_APP_TON, TonABI.abi, library);
  const myTON = await TON?.balanceOf(account);
  stakeInfo.myton = formatEther(myTON);
  const FLD = await getContract(REACT_APP_FLD, FldABI.abi, library);
  const myFLD = await FLD?.balanceOf(account);
  stakeInfo.myfld = formatEther(myFLD);

  const StakeTONContract = await getContract(
    stakeContractAddress,
    StakeTON.abi,
    library,
  );
  stakeInfo.saleStartBlock = await StakeTONContract?.saleStartBlock();
  const staked = await StakeTONContract?.userStaked(account);

  stakeInfo.mystaked = formatEther(staked.amount);
  stakeInfo.myclaimed = formatEther(staked.claimedAmount);
  stakeInfo.mywithdraw = formatEther(staked.releasedAmount);
  const total = await StakeTONContract?.totalStakers();
  stakeInfo.totalStakers = total.toString();

  if (Number(stakeInfo.mystaked) > 0) {
    try {
      let canRewardAmount = await StakeTONContract?.canRewardAmount(
        account,
        currentBlock,
      );
      stakeInfo.canRewardAmount = utils.formatUnits(canRewardAmount, 18);
    } catch (err) {}
  }
  const stakeContractBalanceFLD = await FLD?.balanceOf(stakeContractAddress);
  const stakeContractBalanceTON = await TON?.balanceOf(stakeContractAddress);
  const stakeContractBalanceETH = await provider.getBalance(
    stakeContractAddress,
  );
  stakeInfo.stakeBalanceFLD = formatEther(stakeContractBalanceFLD);
  stakeInfo.stakeBalanceTON = formatEther(stakeContractBalanceTON);
  stakeInfo.stakeBalanceETH = formatEther(stakeContractBalanceETH);
};

const infoTokamak = async (
  stakeInfo: Partial<Stake>,
  stakeContractAddress: string,
  index: number,
  library: any,
  account: string,
) => {
  if (index < stakeInfos.length) {
    try {
      const seigManager = getContract(
        REACT_APP_SEIG_MANAGER,
        SeigManagerABI.abi,
        library,
      );
      const depositManager = getContract(
        REACT_APP_DEPOSIT_MANAGER,
        DepositManagerABI.abi,
        library,
      );
      const staked = await seigManager?.stakeOf(
        REACT_APP_TOKAMAK_LAYER2,
        stakeContractAddress,
      );
      stakeInfo.tokamakStaked = utils.formatUnits(staked, 27);

      const pendingUnstaked = await depositManager?.pendingUnstaked(
        REACT_APP_TOKAMAK_LAYER2,
        stakeContractAddress,
      );
      stakeInfo.tokamakPendingUnstaked = utils.formatUnits(pendingUnstaked, 27);
    } catch (err) {
      console.log('infoTokamak err', err);
    }
  }
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

export const selectStakes = (state: RootState) => state.stakes;
