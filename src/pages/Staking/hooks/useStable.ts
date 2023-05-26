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

        const path = encodePath([WTON_ADDRESS, TOS_ADDRESS], [3000]);
        const outputPath = encodePath([TOS_ADDRESS, WTON_ADDRESS], [3000]);

        const slot0 = await UniswapV3Pool.slot0();
        console.log('slot0',slot0);
        
        const currentLiquidity = await UniswapV3Pool.liquidity();
        console.log('currentLiquidity',currentLiquidity);
        
        const sqrtRatioAX96 = univ3prices.tickMath.getSqrtRatioAtTick(
          slot0.tick,
        );
        console.log('sqrtRatioAX96',sqrtRatioAX96);
        
        const sqrtRatioBX96 = univ3prices.tickMath.getSqrtRatioAtTick(
          slot0.tick + 60,
        );
        console.log('sqrtRatioBX96',sqrtRatioBX96);
        
        const reserves = univ3prices.getAmountsForLiquidityRange(
          slot0.sqrtPriceX96.toString(),
          sqrtRatioAX96,
          sqrtRatioBX96,
          currentLiquidity.toString(),
        );

        console.log('reserves',reserves);
        

        const reserve0 = ethers.BigNumber.from(reserves[0].toString());
        console.log('reserve0',reserve0);
        
        console.log(
          'expected TOS amount ',
          ethers.utils.formatUnits(reserve0, 18),
          'TOS',
        );
        const _quoteExactOut =
          await QUOTER_CONTRACT.callStatic.quoteExactOutput(
            outputPath,
            reserve0,
          );
        console.log(
          '_quoteExactOut',
          ethers.utils.formatUnits(_quoteExactOut, 27),
          'WTON',
        );

        return setStableAmount(ethers.utils.formatUnits(_quoteExactOut, 27))
      }
    }
    callData().catch((e) => {
        console.log('**fetchErr3 on useSwapModal stable**');
        console.log(e);
      });
  },[QUOTER_CONTRACT, TOS_ADDRESS, UniswapV3Pool, WTON_ADDRESS]);
  return stableAmount;
};
