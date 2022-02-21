import {DEPLOYED, fetchEthPriceURL} from '../../../constants/index';

const {TOS_ADDRESS} = DEPLOYED;

export const getLiquidity = (pool: any, tosPrice: number, ethPrice: number) => {
  const {
    token0Price,
    token1Price,
    totalValueLockedToken0,
    totalValueLockedToken1,
    token0,
    token1,
  } = pool;
  let liquidity = 0;
  if (
    token0.id === TOS_ADDRESS.toLowerCase() ||
    token1.id === TOS_ADDRESS.toLowerCase()
  ) {
    // check TOS related pool
    if (token1.id === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
      const lockedTosValue = Number(totalValueLockedToken0) * tosPrice
      const lockedEthValue = Number(totalValueLockedToken1) * ethPrice
      if (lockedEthValue) liquidity = lockedEthValue + lockedTosValue;
      return liquidity > 100000000000 ? 0 : liquidity;
    } else {
      const tosId = token0.id == TOS_ADDRESS.toLowerCase() ? 0 : 1;

      const lockedTOSValue =
        tosId == 0
          ? Number(totalValueLockedToken0) * tosPrice
          : Number(totalValueLockedToken1) * tosPrice;
      const lockedTokenPrice =
        tosId == 0
          ? Number(token0Price) * tosPrice
          : Number(token1Price) * tosPrice;

      const lockedTokenValue =
        tosId == 0
          ? Number(totalValueLockedToken1) * lockedTokenPrice
          : Number(totalValueLockedToken0) * lockedTokenPrice;
      if (lockedTokenValue) liquidity = lockedTokenValue + lockedTOSValue;
      return liquidity > 100000000000 ? 0 : liquidity;
    }
  } else {
    return Number(pool.hourData[0].tvlUSD);
  }
};
