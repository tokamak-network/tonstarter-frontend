import {getTokamakContract, getRPC} from 'utils/contract';
import {REACT_APP_TOKAMAK_LAYER2} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';

export const fetchStakedBalancePayload = async (
  account: string,
  contractAddress: string,
) => {
  const res = await getStakedBalance(account, contractAddress);
  return res;
}

const rpc = getRPC();

const getStakedBalance = async (
  account: string,
  contractAddress: string,
) => {
  // const currentBlock = getRPC().getBlockNumber();
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, rpc);
  // const L2Contract = getTokamakContract('TokamakLayer2');
  const TON = getTokamakContract('TON');
  const WTON = getTokamakContract('WTON');
  const depositManager = getTokamakContract('DepositManager');
  const seigManager = getTokamakContract('SeigManager');

  return Promise.all([
    StakeTONContract.totalStakedAmount(),
    seigManager.stakeOf(REACT_APP_TOKAMAK_LAYER2, contractAddress),
    depositManager.pendingUnstaked(REACT_APP_TOKAMAK_LAYER2, contractAddress),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
  ]).then((result) => {
    return {
      totalStakedAmount: convertNumber({
        amount: result[0],
      }),
      totalStakedAmountL2: convertNumber({
        amount: result[1],
        type: 'ray',
      }),
      totalPendingUnstakedAmountL2: convertNumber({
        amount: result[2],
        type: 'ray',
      }),
      stakeContractBalanceWton: convertNumber({
        amount: result[3],
        type: 'ray',
      }),
      stakeContractBalanceTon: convertNumber({
        amount: result[4],
      }),
    };
  });
};