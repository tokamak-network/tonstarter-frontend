import {DEPLOYED} from '../../../constants/index';
import {useContract} from '../../../hooks/useContract';
import {useEffect, useState} from 'react';
import * as QuoterAbi from '../../../services/abis/Quoter.json';
import * as LibPublicSale from '../../../services/abis/LibPublicSale.json';
import * as TonStakeUpgrade6ABI from '../../../services/abis/TokamakStakeUpgrade6.json';
import {ethers} from 'ethers';
import {convertToRay, convertToWei} from '../../../utils/number';
import * as UniswapV3PoolABI from '../../../services/abis/UniswapV3Pool.json';

export const useSwapStake = (amountIn: number) => {
  const {
    WTON_ADDRESS,
    Quoter,
    TOS_ADDRESS,
    pools,
    StakeTONAddress,
  } = DEPLOYED;
  const QUOTER_CONTRACT = useContract(Quoter, QuoterAbi.abi);
  const tonStakeUpgrade6 = useContract(
    StakeTONAddress,
    TonStakeUpgrade6ABI.abi,
  );

  const UniswapV3Pool = useContract(
    pools.TOS_WTON_Address,
    UniswapV3PoolABI.abi,
  );
  const [maxAmount, setMaxAmount] = useState<string>('0');

  useEffect(() => {
    async function callData() {
      if (QUOTER_CONTRACT && tonStakeUpgrade6 && UniswapV3Pool) {
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
        console.log('slot0', slot0);

        const averageTick = await tonStakeUpgrade6.consult(
          pools.TOS_WTON_Address,
          120,
        );
        console.log('averageTick', averageTick);

        const acceptTickIntervalInOracle =
          await tonStakeUpgrade6.acceptTickIntervalInOracle();
        console.log('acceptTickIntervalInOracle', acceptTickIntervalInOracle);

        const acceptMaxTick = await tonStakeUpgrade6.acceptMaxTick(
          averageTick,
          60,
          acceptTickIntervalInOracle,
        );
        console.log('acceptMaxTick', acceptMaxTick);

        let changeTick = await tonStakeUpgrade6.changeTick();
        console.log('changeTick', changeTick);

        if (changeTick === 0) {
          changeTick = 18;
        }

        if (slot0.tick > acceptMaxTick) {
          console.log(
            'The current price is greater than the average price over the last 2 minutes. Swap is not supported in this environment.',
          );

          return;
        } else {
          const _quoteExactInput =
            await QUOTER_CONTRACT.callStatic.quoteExactInput(
              path,
              convertToRay(String(amountIn)),
            );

          console.log(
            'The amount of TOS swapped when you actually swap in Uniswap : _quoteExactInput  ',
            ethers.utils.formatUnits(_quoteExactInput, 18),
            'TOS',
          );

          const limitPrameters = await tonStakeUpgrade6.limitPrameters(
            convertToRay(String(amountIn)),
            pools.TOS_WTON_POOL,
            WTON_ADDRESS,
            TOS_ADDRESS,
            changeTick,
          );

          console.log(
            'Minimum swap amount allowed : limitPrameters',
            ethers.utils.formatUnits(limitPrameters[0], 18),
            'TOS',
          );

          const _quoteExactInput1 =
            await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
              WTON_ADDRESS,
              TOS_ADDRESS,
              3000,
              convertToRay(String(amountIn)),
              limitPrameters[2],
            );

          console.log(
            '_quoteExactInput1  ',
            ethers.utils.formatUnits(_quoteExactInput1, 18),
            'TOS',
          );
          if (limitPrameters[0].gt(_quoteExactInput)) {
            const _quoteExactOut =
              await QUOTER_CONTRACT.callStatic.quoteExactOutput(
                outputPath,
                _quoteExactInput1
                  .mul(ethers.BigNumber.from('10005'))
                  .div(ethers.BigNumber.from('10000')),
              );
            console.log(
              're-calculate the input amount of WTON to swap ',
              ethers.utils.formatUnits(_quoteExactOut, 27),
              'WTON',
            );
            const exactOutFormatted = Number(
              ethers.utils.formatUnits(_quoteExactOut, 27),
            );
            return setMaxAmount(exactOutFormatted.toString());
          } else {
            return setMaxAmount(amountIn.toString());
          }
        }
      }
    }
    callData().catch((e) => {
      console.log('**fetchErr3 on useSwapModal**');
      console.log(e);
    });
  }, [
    QUOTER_CONTRACT,
    TOS_ADDRESS,
    UniswapV3Pool,
    WTON_ADDRESS,
    amountIn,
    pools.TOS_WTON_Address,
    pools.TOS_WTON_POOL,
    tonStakeUpgrade6,
  ]);
  return maxAmount;
};
