import {DEPLOYED} from '../../../constants/index';
import {useContract} from '../../../hooks/useContract';
import {useEffect, useState} from 'react';
import * as QuoterAbi from '../../../services/abis/Quoter.json';
import * as LibPublicSale from '../../../services/abis/LibPublicSale.json';
import * as TonStakeUpgrade6ABI from '../../../services/abis/TokamakStakeUpgrade6.json';
import {ethers} from 'ethers';
import {convertToRay, convertToWei} from '../../../utils/number';
import * as UniswapV3PoolABI from '../../../services/abis/UniswapV3Pool.json';
const univ3prices = require('@thanpolas/univ3prices');

const encodePath = (path: any, fees: any) => {
  if (path.length !== fees.length + 1) {
    throw new Error('path/fee lengths do not match');
  }
  let encoded = '0x';
  for (let i = 0; i < fees.length; i++) {
    encoded += path[i].slice(2);
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
  }
  encoded += path[path.length - 1].slice(2);
  return encoded.toLowerCase();
};

export const useStable = () => {
  const {WTON_ADDRESS, Quoter, TOS_ADDRESS, pools, StakeTONAddress} = DEPLOYED;
  const QUOTER_CONTRACT = useContract(Quoter, QuoterAbi.abi);
  const UniswapV3Pool = useContract(
    pools.TOS_WTON_Address,
    UniswapV3PoolABI.abi,
  );

  const [stableAmount, setStableAmount] = useState<string>('0');

  useEffect(() => {
    async function callData() {
      if (QUOTER_CONTRACT && UniswapV3Pool) {
        const FEE_SIZE = 3;

        const path = encodePath([WTON_ADDRESS, TOS_ADDRESS], [3000]);
        const outputPath = encodePath([TOS_ADDRESS, WTON_ADDRESS], [3000]);

        const slot0 = await UniswapV3Pool.slot0();
        const currentLiquidity = await UniswapV3Pool.liquidity();
        const sqrtRatioAX96 = univ3prices.tickMath.getSqrtRatioAtTick(
          slot0.tick,
        );
        const sqrtRatioBX96 = univ3prices.tickMath.getSqrtRatioAtTick(
          slot0.tick + 60,
        );
        const reserves = univ3prices.getAmountsForLiquidityRange(
          slot0.sqrtPriceX96.toString(),
          sqrtRatioAX96,
          sqrtRatioBX96,
          currentLiquidity.toString(),
        );

        const reserve0 = ethers.BigNumber.from(reserves[0].toString());
        const _quoteExactOut =
          await QUOTER_CONTRACT.callStatic.quoteExactOutput(
            outputPath,
            reserve0,
          );

        return setStableAmount(ethers.utils.formatUnits(_quoteExactOut, 27));
      }
    }
    callData().catch((e) => {
      console.log('**fetchErr3 on useSwapModal stable**');
      console.log(e);
    });
  }, [QUOTER_CONTRACT, TOS_ADDRESS, UniswapV3Pool, WTON_ADDRESS]);
  return stableAmount;
};
