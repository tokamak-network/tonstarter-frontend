import {getTokamakContract, getRPC} from 'utils/contract';
import {REACT_APP_TOKAMAK_LAYER2} from 'constants/index';
import {formatEther} from '@ethersproject/units';
import * as StakeTON from 'services/abis/StakeTON.json';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';

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

const rpc = getRPC();

const getUserInfoForManage = async (
  library: any,
  account: string,
  contractAddress: string,
  vaultAddress: string,
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
      };
    })
    .catch((e) => console.log(e));
};
