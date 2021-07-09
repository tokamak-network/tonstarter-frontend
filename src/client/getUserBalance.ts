import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {getContract, getRPC} from 'utils/contract';
import store from 'store';
import {convertNumber} from 'utils/number';
import {REACT_APP_TON} from 'constants/index';
import * as ERC20 from 'services/abis/ERC20.json';

const rpc = getRPC();

export const getUserBalance = async (contractAddress: any) => {
  const user = store.getState().user.data;
  const {address: account, library} = user;
  if (account === undefined || null) {
    return;
  }
  const {userStaked, userRewardTOS} = await fetchUserData(
    library,
    account,
    contractAddress,
  );
  const result = {
    rewardTosBalance: convertNumber({amount: userRewardTOS}),
    rewardTonBalance: undefined,
    totalStakedBalance: convertNumber({amount: userStaked}),
  };
  return result;
};

export const getUserTonBalance = async ({account, library}: any) => {
  const contract = getContract(REACT_APP_TON, ERC20.abi, library);
  const contractIserBalance = await contract.balanceOf(account);
  const balance = convertNumber({amount: String(contractIserBalance)});
  return balance;
};

const fetchUserData = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const res = await getUserInfo(library, account, contractAddress);
  const {userStaked, userRewardTOS} = res;
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
