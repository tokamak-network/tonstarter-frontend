import {getTokamakContract} from 'utils/contract';
import {DEPLOYED} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {Contract} from '@ethersproject/contracts';
import {convertFromWeiToRay, convertNumber} from 'utils/number';

export const fetchStakedBalancePayload = async (
  account: string,
  contractAddress: string,
  library: any,
) => {
  const res = await getStakedBalance(account, contractAddress, library);
  return res;
};

const getSwapBalance = (args: any) => {
  const totalStakedAmount = args[0];
  //ray
  const totalStakedAmountL2 = args[1];
  //ray
  const totalPendingUnstakedAmountL2 = args[2];
  //ray
  const stakeContractBalanceWton = args[3];
  const stakeContractBalanceTon = args[4];

  const ray_TotalStakedAmount = convertFromWeiToRay(totalStakedAmount);
  const ray_StakeContractBalanceTon = convertFromWeiToRay(
    stakeContractBalanceTon,
  );

  const availableBalance = totalStakedAmountL2
    .add(totalPendingUnstakedAmountL2)
    .add(stakeContractBalanceWton)
    .add(ray_StakeContractBalanceTon)
    .sub(ray_TotalStakedAmount);

  const tonsBalance = stakeContractBalanceWton.add(ray_StakeContractBalanceTon);

  // console.log('--');
  // console.log(availableBalance);
  // console.log(tonsBalance);

  if (availableBalance.gt(tonsBalance)) {
    console.log('--gt--');
    console.log(availableBalance);
    console.log(tonsBalance);

    return availableBalance
      .sub(tonsBalance)
      .sub(totalPendingUnstakedAmountL2)
      .toString();
  }

  if (availableBalance.lte(tonsBalance)) {
    console.log('----lte---');
    console.log(availableBalance);
    console.log(tonsBalance);
    return availableBalance;
  }
};

const getStakedBalance = async (
  account: string,
  contractAddress: string,
  library: any,
) => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const TON = getTokamakContract('TON', library);
  const WTON = getTokamakContract('WTON', library);
  const depositManager = getTokamakContract('DepositManager', library);
  const seigManager = getTokamakContract('SeigManager', library);

  return Promise.all([
    StakeTONContract.totalStakedAmount(),
    //should convert to ray from wei for seigManager
    seigManager.stakeOf(DEPLOYED.TokamakLayer2_ADDRESS, contractAddress),
    depositManager.pendingUnstaked(
      DEPLOYED.TokamakLayer2_ADDRESS,
      contractAddress,
    ),
    WTON.balanceOf(contractAddress),
    TON.balanceOf(contractAddress),
  ]).then((result) => {
    return {
      totalStakedAmount: convertNumber({
        amount: result[0],
        round: true,
      }),
      totalStakedAmountL2: convertNumber({
        amount: result[1],
        type: 'ray',
        round: true,
      }),
      totalPendingUnstakedAmountL2: convertNumber({
        amount: result[2],
        type: 'ray',
        round: true,
      }),
      stakeContractBalanceWton: convertNumber({
        amount: result[3],
        type: 'ray',
        round: true,
      }),
      stakeContractBalanceTon: convertNumber({
        amount: result[4],
        round: true,
      }),
      seig: '',
      swapBalance: convertNumber({amount: getSwapBalance(result), type: 'ray'}),
    };
  });
};
