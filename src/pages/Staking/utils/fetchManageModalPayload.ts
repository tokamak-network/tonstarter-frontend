import {getTokamakContract} from 'utils/contract';
import {DEPLOYED} from 'constants/index';
import {formatEther} from '@ethersproject/units';
import * as StakeTON from 'services/abis/StakeTON.json';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';
import {BASE_PROVIDER} from 'constants/index'
import * as CoinageABI from 'services/abis/AutoRefactorCoinage.json';
import { ethers } from 'ethers';

export const fetchManageModalPayload = async (
  library: any,
  account: string,
  contractAddress: string,
  vaultAddress: string,
) => {
  const res = await getUserInfoForManage(
    library,
    account,
    contractAddress,
    vaultAddress,
  );
  return res;
};

const {TokamakLayer2_ADDRESS} = DEPLOYED;

const getUserInfoForManage = async (
  library: any,
  account: string,
  contractAddress: string,
  vaultAddress: string,
) => {
  const currentBlock = await BASE_PROVIDER.getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const L2Contract = getTokamakContract('TokamakLayer2', library);
  const TON = getTokamakContract('TON', library);
  const WTON = getTokamakContract('WTON', library);
  const depositManager = getTokamakContract('DepositManager', library);
  const seigManager = getTokamakContract('SeigManager', library);
  const coinageAddress = await seigManager.coinages(TokamakLayer2_ADDRESS)
  const Coinage = new Contract(coinageAddress, CoinageABI.abi, library)
  const balance = await Coinage.balanceOf(contractAddress, {blockNumber: currentBlock})
  console.log(balance);

  return Promise.all([
    StakeTONContract?.userStaked(account),
    L2Contract?.stakedOf(account),
    StakeTONContract.totalStakedAmount(),
    seigManager.stakeOf(TokamakLayer2_ADDRESS, contractAddress),
    depositManager.pendingUnstaked(TokamakLayer2_ADDRESS, contractAddress),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
    StakeTONContract.canRewardAmount(account, currentBlock),
    depositManager.globalWithdrawalDelay(),
    Coinage.balanceOf(contractAddress),
    // Coinage.balanceOf(contractAddress, {blockNumber: currentBlock}),
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
          type: 'ray',
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
        maxBalance: convertNumber({
          amount: result[9],
        }),
        // maxBalances: convertNumber({
        //   amount: result[10],
        // })
      };
    })
    .catch((e) => console.log(e));
};
