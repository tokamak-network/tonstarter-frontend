import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {DEPLOYED} from 'constants/index';

const {UniswapStaking_Address} = DEPLOYED;

export const fetchPositionRangePayload = async (
  library: any,
  id: string,
  account: string,
) => {
  const res = await getPositionRange(library, account, id);
  // {tick, tickLower, tickUpper} = res
  console.log(res)
  return res;
}

const getPositionRange = async (
  library: any,
  account: string,
  id: string,
) => {
  if (library && id) {
    const StakeUniswap = new Contract(UniswapStaking_Address, StakeUniswapABI.abi, library);
    const npmPositions = await StakeUniswap.npmPositions(id)
    const poolSlot0 = await StakeUniswap.poolSlot0()
    return {
      npmPositions: npmPositions,
      poolSlot0: poolSlot0,
    }
    // return Promise.all([
    //   StakeUniswap.npmPositions(id),
    //   StakeUniswap.poolSlot0(),
    // ]).then((result) => {
    //   return {
    //     ...result[0],
    //     ...result[1]
    //   }
    // })
    
  }

}