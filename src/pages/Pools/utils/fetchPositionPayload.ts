import {BASE_PROVIDER} from 'constants/index'
import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';

export const fetchPositionPayload = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const res = await getPositionInfo(library, account, contractAddress);
  return res;
}

const getPositionInfo = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  if (library) {
    const StakeUniswap = new Contract('0x55eC1F59477f00a3Fb00B466AbCA19CE0233D66F', StakeUniswapABI.abi, library);
    const positionIds = await StakeUniswap.getUserStakedTokenIds(account);
    return positionIds
  }
}