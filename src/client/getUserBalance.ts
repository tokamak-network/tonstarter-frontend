import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {getContract, getRPC} from 'utils/contract';
import store from 'store';
import {convertNumber} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import * as ERC20 from 'services/abis/ERC20.json';
import {BigNumber} from 'ethers';

const rpc = getRPC();

export const getUserBalance = async (contractAddress: any) => {
  const user = store.getState().user.data;
  const {address: account, library} = user;
  if (account === undefined || null) {
    return;
  }
  const {userStaked, myClaimed, userRewardTOS} = await fetchUserData(
    library,
    account,
    contractAddress,
  );
  const result = {
    rewardTosBalance: convertNumber({amount: userRewardTOS}),
    rewardTonBalance: undefined,
    totalStakedBalance: convertNumber({amount: userStaked}),
    claimedBalance: convertNumber({amount: myClaimed}),
  };
  return result;
};

export const getUserTonBalance = async ({account, library}: any) => {
  const contract = getContract(DEPLOYED.TON, ERC20.abi, library);
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
  const {userStaked, myClaimed, userRewardTOS} = res;
  return {
    userStaked,
    myClaimed,
    userRewardTOS,
  };
};

const getUserInfo = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const currentBlock = await getRPC().getBlockNumber();
  return Promise.all([
    StakeTONContract.userStaked(account),
    StakeTONContract.canRewardAmount(account, currentBlock),
  ]).then((result) => {
    return {
      userStaked: result[0].amount,
      myClaimed: result[0].claimedAmount,
      userRewardTOS: result[1],
    };
  });
};

export const getTotalStakers = async (contractAddress: string) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  const result = await StakeTONContract.totalStakers();
  return String(BigNumber.from(result).toNumber());
};
