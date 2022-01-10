import {LibraryType} from 'types/index';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import * as StakeTON from 'services/abis/StakeTON.json';
import {fetchWithdrawPayload} from '../StakeOptionModal/utils/fetchWithdrawPayload';
import {getTokamakContract} from 'utils/contract';
import {L2Status} from '../types';
import {convertNumber} from 'utils/number';

const {TokamakLayer2_ADDRESS} = DEPLOYED;

async function checkL2Unstake(
  CONTRACT_ADDRESS: string,
  library: LibraryType,
): Promise<boolean | undefined> {
  const STAKETON_CONTRACT = new Contract(
    CONTRACT_ADDRESS,
    StakeTON.abi,
    library,
  );
  const isUnstakeL2All = await STAKETON_CONTRACT.canTokamakRequestUnStakingAll(
    TokamakLayer2_ADDRESS,
  );
  if (isUnstakeL2All) {
    return true;
  }
  const canReqeustUnstaking =
    await STAKETON_CONTRACT.canTokamakRequestUnStaking(TokamakLayer2_ADDRESS);

  const convertedUnstakeNum = convertNumber({
    amount: canReqeustUnstaking,
    type: 'ray',
  });

  if (canReqeustUnstaking) {
    return Number(convertedUnstakeNum) > 0 ? true : false;
  }
  return undefined;
}

async function checkL2Withdraw(
  CONTRACT_ADDRESS: string,
  library: LibraryType,
): Promise<boolean | undefined> {
  const res_CanWithdralAmount = await fetchWithdrawPayload(
    library,
    CONTRACT_ADDRESS,
  );
  if (res_CanWithdralAmount) {
    return Number(res_CanWithdralAmount.toString()) > 0 ? true : false;
  }
  return undefined;
}

async function checkL2Swap(
  CONTRACT_ADDRESS: string,
  library: LibraryType,
): Promise<boolean | undefined> {
  const TON = getTokamakContract('TON', library);
  const availableSwapBalance = await TON.balanceOf(CONTRACT_ADDRESS);
  if (availableSwapBalance) {
    return Number(availableSwapBalance.toString()) > 0 ? true : false;
  }
  return undefined;
}

export async function checkL2Status(
  CONTRACT_ADDRESS: string,
  library: LibraryType,
): Promise<L2Status> {
  //check library
  if (!library) {
    return {
      canUnstake: false,
      canWithdraw: false,
      canSwap: false,
    };
  }
  return Promise.all([
    checkL2Unstake(CONTRACT_ADDRESS, library),
    checkL2Withdraw(CONTRACT_ADDRESS, library),
    checkL2Swap(CONTRACT_ADDRESS, library),
  ])
    .then((res) => {
      return {
        canUnstake: res[0] || false,
        canWithdraw: res[1] || false,
        canSwap: res[2] || false,
      };
    })
    .catch((e) => {
      return {
        canUnstake: false,
        canWithdraw: false,
        canSwap: false,
      };
    });
}
