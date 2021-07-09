import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {getRPC} from 'utils/contract';
import store from 'store';
import {convertNumber} from 'utils/number';

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
  //   return store.dispatch(
  //     //@ts-ignore
  //     openTable({
  //       data: {
  //         rewardTosBalance: convertNumber({amount: userRewardTOS}),
  //         rewardTonBalance: undefined,
  //         totalStakedBalance: convertNumber({amount: userStaked}),
  //       },
  //     }),
  //   );
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
