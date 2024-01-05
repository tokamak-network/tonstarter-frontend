import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {getContract, getTokamakContract} from 'utils/contract';
import {convertNumber} from 'utils/number';
import {BASE_PROVIDER, DEPLOYED} from 'constants/index';
import * as ERC20 from 'services/abis/ERC20.json';
import * as TOSABI from 'services/abis/TOS.json';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import * as WTONABI from 'services/abis/WTON.json';
import * as StakingV2ProxyABI from 'services/abis/StakingV2Proxy.json';

import {ethers} from 'ethers';
import {BigNumber} from 'ethers';
import {UserContract} from 'types/index';

const {TON_ADDRESS, TOS_ADDRESS} = DEPLOYED;

export const getUserBalance = async (
  account: string,
  library: any,
  contractAddress: any,
) => {
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

export const getUserTonBalance = async ({
  account,
  library,
  localeString,
}: any) => {
  const contract = new Contract(TON_ADDRESS, ERC20.abi, library);
  const contractIserBalance = await contract.balanceOf(account);
  const balance = convertNumber({
    amount: String(contractIserBalance),
    localeString: localeString || false,
  });
  return balance;
};

export const getUserStakedTonBalance = async ({account, library}: any) => {
  const seigManager = getTokamakContract('SeigManager', library);  
const userStaked = await seigManager['stakeOf(address)'](account);

  // const totalSupply = await contract.balanceOf(account);
  const formattedNumber = Number(
    ethers.utils.formatUnits(userStaked, 27),
  ).toFixed(2);
  
  return formattedNumber;
  // const balance = convertNumber({amount: String(contractIserBalance)});
  // return {ton: balance || '0', tonOrigin: contractIserBalance.toString()};
};

export const getUserTonOriginBalance = async ({account, library}: any) => {
  const contract = new Contract(TON_ADDRESS, ERC20.abi, library);
  const contractIserBalance = await contract.balanceOf(account);
  const balance = convertNumber({amount: String(contractIserBalance)});
  return {ton: balance || '0', tonOrigin: contractIserBalance.toString()};
};

export const getUserWTONBalance = async ({account, library}: UserContract) => {
  const {WTON_ADDRESS} = DEPLOYED;
  const WTON_CONTRACT = new Contract(WTON_ADDRESS, WTONABI.abi, library);
  const wtonBalance = await WTON_CONTRACT.balanceOf(account);
  const convertedRes = convertNumber({amount: wtonBalance, type: 'ray'});
  return {wton: convertedRes || '0', wtonOrigin: wtonBalance.toString()};
};

export const getUserTOSStaked = async ({account, library}: any) => {
  try {
    const {StakingV2Proxy} = DEPLOYED;
    const StakingV2Prox_CONTRACT = new Contract(
      StakingV2Proxy,
      StakingV2ProxyABI.abi,
      library,
    );
    const ltosAmount = await StakingV2Prox_CONTRACT.balanceOf(account);
    const tosAmount = await StakingV2Prox_CONTRACT.getLtosToTosPossibleIndex(
      ltosAmount,
    );

    return convertNumber({amount: tosAmount.toString(), localeString: true});
  } catch (e) {
    return '-';
  }
};

export const getUserSTOSBalance = async ({account, library}: any) => {
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const res = await LockTOSContract.balanceOf(account);
  return convertNumber({amount: res, localeString: true});
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

export const getUserTosBalance = async (account: string, library: any) => {
  const contract = getContract(TOS_ADDRESS, TOSABI.abi, library);
  const userTosBalance = await contract.balanceOf(account);
  const balance = convertNumber({
    amount: String(userTosBalance),
    localeString: true,
  });
  return balance;
};

export const getUserTossBalance = async ({account, library}: UserContract) => {
  const contract = getContract(TOS_ADDRESS, TOSABI.abi, library);
  const userTosBalance = await contract.balanceOf(account);
  const convertedRes = convertNumber({
    amount: String(userTosBalance),
  });
  return {tos: convertedRes || '0', tosOrigin: userTosBalance.toString()};
};

const getUserInfo = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const currentBlock = await BASE_PROVIDER.getBlockNumber();
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

export const getTotalStakers = async (
  contractAddress: string,
  library: any,
) => {
  try {
    const StakeTONContract = new Contract(
      contractAddress,
      StakeTON.abi,
      library,
    );
    const result = await StakeTONContract.totalStakers();
    return String(BigNumber.from(result).toNumber());
  } catch (e) {
    console.log(e);
  }
};
