import { DEPLOYED, fetchTosPriceURL } from '../../../constants/index';

const { TOS_ADDRESS } = DEPLOYED

export const getLiquidity = (pool: any, tosPrice: number) => {
  const {
    token0Price,
    token1Price,
    totalValueLockedToken0,
    totalValueLockedToken1,
    token0,
    token1,
  } = pool
  let liquidity = 0;
  if (token0.id === TOS_ADDRESS.toLowerCase() || token1.id === TOS_ADDRESS.toLowerCase()) { // check TOS related pool
    const tosId = token0.id == TOS_ADDRESS.toLowerCase() ? 0 : 1
    
    const lockedTOSValue = tosId == 0 ? Number(totalValueLockedToken0) * tosPrice : Number(totalValueLockedToken1) * tosPrice
    const lockedTokenPrice = tosId == 0 ?  Number(token0Price) * tosPrice : Number(token1Price) * tosPrice
    
    const lockedTokenValue = tosId == 0 ? Number(totalValueLockedToken1) * lockedTokenPrice : Number(totalValueLockedToken0) * lockedTokenPrice
    liquidity = lockedTokenValue + lockedTOSValue
    return liquidity
  } else {
    return Number(pool.hourData[0].tvlUSD)
  }
}