import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {DEPLOYED} from 'constants/index';

const {UniswapStaking_Address} = DEPLOYED;

export const fetchPositionRangePayload = async (
  library: any,
  id: string,
  account: string,
) => {
  if (library && account && id) {
    const res = await getPositionRange(library, account, id);
    const {tick, tickLower, tickUpper} = res
    const result = (tick > tickLower && tick < tickUpper)
    
    return result;
  }
}

const getPositionRange = async (
  library: any,
  account: string,
  id: string,
) => {
  if (library && id) {
    const StakeUniswap = new Contract(UniswapStaking_Address, StakeUniswapABI.abi, library);
    const currentTime = Date.now() / 1000;
    const blockNumber = await library.getBlock('latest')
    console.log(blockNumber);
    //@ts-ignore
    const now = parseInt(currentTime)
    console.log(now)

    const npmPositions = await StakeUniswap.npmPositions(id)
    const poolSlot0 = await StakeUniswap.poolSlot0()
    let expectedClaimable
    try {
      expectedClaimable = await StakeUniswap.expectedPlusClaimableAmount(id, now)
    } catch (e) {}
    console.log(id, expectedClaimable)
    return {
      ...npmPositions,
      ...poolSlot0,
      ...expectedClaimable
    }
  }

}