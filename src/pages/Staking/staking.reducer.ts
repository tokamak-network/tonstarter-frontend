import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {getContract, getSigner} from 'utils/contract';
import {BigNumber, utils, ethers} from 'ethers';
import { toWei} from 'web3-utils';
import * as StakeVault from 'services/abis/Stake1Vault.json';
import * as StakeTON from 'services/abis/StakeTON.json';
import * as StakeSimple from 'services/abis/StakeSimple.json';
import * as TonABI from 'services/abis/TON.json';
import * as FldABI from 'services/abis/FLD.json';
import * as SeigManagerABI from 'services/abis/SeigManager.json';
import * as DepositManagerABI from 'services/abis/DepositManager.json';
import * as tonABI from 'services/abis/TON.json';
import * as fldABI from 'services/abis/FLD.json';
import {formatEther} from '@ethersproject/units';
import {period, formatStartTime, formatEndTime} from 'utils/timeStamp';
import {
  REACT_APP_TON,
  REACT_APP_WTON,
  REACT_APP_FLD,
  REACT_APP_SEIG_MANAGER,
  REACT_APP_TOKAMAK_LAYER2,
  REACT_APP_DEPOSIT_MANAGER,
  ZERO_ADDRESS,
  DEPLOYED
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
  token: string;
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
  amount: string;
  payToken: string;
  saleStartBlock: string | Number;
  library: any;
  stakeContractAddress: string;
};

type unstake = {
  userAddress: string | null | undefined;
  amount: string;
  stakeEndBlock: string | Number;
  library: any;
  stakeContractAddress: string;
}

const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StakeState;

const converToWei = (num: string) => toWei(num, 'ether');


export const stakePaytoken = async (args: StakeTon)  => {
  const {userAddress, amount, payToken, saleStartBlock, library, stakeContractAddress} = args;

  if (payToken === DEPLOYED.TON) {
    
    await stakeTon(
      {
        userAddress: userAddress,
        amount: amount,
        payToken: payToken,
        saleStartBlock: saleStartBlock,
        library: library,
        stakeContractAddress: stakeContractAddress
      }
    );
  }
  else {
   await stakeEth({
    userAddress: userAddress,
    amount: amount,
    payToken: payToken,
    saleStartBlock: saleStartBlock,
    library: library,
    stakeContractAddress: stakeContractAddress
  } )
  }

}
const stakeTon = async (args: StakeTon) => {
  console.log('staked TON');
  const {userAddress, amount, payToken, saleStartBlock, library, stakeContractAddress} = args;
  // console.log(userAddress);
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await provider.getBlockNumber();
  if(currentBlock > saleStartBlock) {
    
    const tonContract = getContract(REACT_APP_TON, TonABI.abi, library);
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = converToWei(amount);
    const abicoder = ethers.utils.defaultAbiCoder;
    const data = abicoder.encode(["address", "uint256"], [stakeContractAddress, tonAmount]);
  
    const signer = getSigner(library, userAddress);
  
    const tx = await tonContract.connect(signer)?.approveAndCall(stakeContractAddress, tonAmount, data);
    // .send({from: userAddress})
  // .on('transactionHash', async (transactionHash: any) => {
  //   console.log(typeof transactionHash);
  //   // const transaction = {
  //   //   from: userAddress,
  //   //   type: 'Delegated',
  //   //   amount,
  //   //   transactionHash,
  //   //   target: operatorLayer2,
  //   //   timestamp: moment().unix(),
  //   // };
  // })
  // .on('receipt', (receipt: any) => {
  //   //success to make a transaction
  //   console.log(receipt);
  // });
  // .on('confirmation', async (confirmationNumber: number) => {
  //   if (confirmationNumber === 0) {
  //     console.log(confirmationNumber);
  //     //be confirmed to stake
  //   }
  // });
  }
  
};
const stakeEth = async (args: StakeTon) => {
  console.log('staked ETH');
  const {userAddress, amount, payToken, saleStartBlock, library, stakeContractAddress} = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await provider.getBlockNumber();
  
  if(currentBlock > saleStartBlock) {
  const transactionRequest: any = {
    to: stakeContractAddress,
    value: utils.parseEther(amount)
  }
   
    const signer = getSigner(library, userAddress);
    const tx = await signer.sendTransaction(transactionRequest);
  console.log(tx);
  
  }
}
 
export const withdraw = async (args: unstake) => {
  const {userAddress, amount, stakeEndBlock, library, stakeContractAddress} = args;
  const currentBlock = await provider.getBlockNumber();

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  if (currentBlock > stakeEndBlock) {
    console.log('ended')
  }
  else {
    console.log('not ended')
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
  
    const tx = await StakeTONContract.connect(signer)?.withdraw();
  }

}


export const fetchStakes = createAsyncThunk(
  'stakes/all',
  async ({contract, library, account}: any, {requestId, getState}) => {
    let projects: any[] = [];
    let stakeList: any;
    let iERC20: any;

    // @ts-ignore
    const {currentRequestId, loading} = getState().stakes;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }
    if (contract) {
      const vaults = await contract.vaultsOfPahse(1);
      
      stakeList = await Promise.all(
        vaults.map(async (vault: any) => {
          const stakeVault = await getContract(vault, StakeVault.abi, library);
          const stakeType = await stakeVault?.stakeType();
          const token = await stakeVault.paytoken();
          // const stakeList: string[] = await stakeVault?.stakeAddressesAll();
          return {
            iERC20: iERC20,
            stakeType: stakeType,
            projects: await stakeVault?.stakeAddressesAll(),
            stakeVault,
            token,
          };
        }),
      );

      await Promise.all(
        stakeList.map(async (stake: any) => {
          return await Promise.all(
            stake.projects.map(async (item: any) => {
              let info = await stake.stakeVault.stakeInfos(item);
             const name = await stake.iERC20?.name();
            //  console.log(stake);
             
             
              const startTime = await formatStartTime(info[1]);
              const endTime = await formatEndTime(info[1], info[2]);

              const stakeInfo: Partial<Stake> = {
                contractAddress: item,
                name: info[0],
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
                token: stake.token,
                stakeType: stake.stakeType,
                period: period(info[1], info[2]),
                startTime: startTime,
                endTime: endTime,
              };
              
              await getMy(stakeInfo, item, library, account);
              projects.push(stakeInfo);
            }),
          );
        }),
      );
    }
    return projects;
  },
);

const getMy = async (
  stakeInfo: Partial<Stake>,
  stakeContractAddress: string,
  library: any,
  account: string,
) => {
  const currentBlock = await provider.getBlockNumber();

  const TON = await getContract(REACT_APP_TON, tonABI.abi, library);
  const myTON = await TON?.balanceOf(account);
  stakeInfo.myton = formatEther(myTON);
  const FLD = await getContract(REACT_APP_FLD, fldABI.abi, library);
  const myFLD = await FLD?.balanceOf(account);
  stakeInfo.myfld = formatEther(myFLD);

  const StakeTONContract = await getContract(
    stakeContractAddress,
    StakeTON.abi,
    library,
  );
  const saleBlock = await StakeTONContract?.saleStartBlock();
  stakeInfo.saleStartBlock = Number(saleBlock);
  const staked = await StakeTONContract?.userStaked(account);

  stakeInfo.mystaked = formatEther(staked.amount);
  stakeInfo.myclaimed = formatEther(staked.claimedAmount);
  stakeInfo.mywithdraw = formatEther(staked.releasedAmount);
  // const total = await StakeTONContract?.totalStakers();
  // stakeInfo.totalStakers = total.toString();

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
// @ts-ignore
export const selectStakes = (state: RootState) => state.stakes;