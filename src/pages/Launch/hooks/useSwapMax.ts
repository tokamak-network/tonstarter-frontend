import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useEffect, useState} from 'react';
import * as QuoterAbi from 'services/abis/Quoter.json';
import * as LibPublicSale from 'services/abis/LibPublicSale.json';
import {ethers} from 'ethers';
import {convertToRay, convertToWei} from 'utils/number';

export const useSwapMax = (amountIn: number) => {
  const {WTON_ADDRESS, Quoter, TOS_ADDRESS, pools, LibPublicSaleLogic} =
    DEPLOYED;
  const QUOTER_CONTRACT = useContract(Quoter, QuoterAbi.abi);
  const LibraryContract = useContract(LibPublicSaleLogic, LibPublicSale.abi);
  const [maxAmount, setMaxAmount] = useState<string>('0');

  useEffect(() => {
    async function callData() {
      if (QUOTER_CONTRACT && LibraryContract) {
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

        // console.log('amountIn', amountIn);

        const path = encodePath([WTON_ADDRESS, TOS_ADDRESS], [3000]);
        const outputPath = encodePath([TOS_ADDRESS, WTON_ADDRESS], [3000]);
        const amountOut_BN = await QUOTER_CONTRACT.callStatic.quoteExactInput(
          path,
          convertToRay(String(amountIn)),
        );

        // console.log('amountOut_BN', amountOut_BN);

        const limitParameters = await LibraryContract?.limitPrameters(
          convertToRay(String(amountIn)),
          pools.TOS_WTON_POOL,
          WTON_ADDRESS,
          TOS_ADDRESS,
          18,
        );

        // console.log('limitParameters', limitParameters);

        const amountOutMinimum2 = amountOut_BN;
        const amountOutMinimum = Number(
          ethers.utils.formatUnits(
            limitParameters.amountOutMinimum.toString(),
            18,
          ),
        );

        // console.log('amountOutMinimum', amountOutMinimum);

        const amountOutMinimum3 =
          Number(ethers.utils.formatUnits(amountOutMinimum2.toString(), 18)) *
          0.995;
        // console.log('amountOutMinimum3', amountOutMinimum3);

        const isMax = amountOutMinimum3 > amountOutMinimum;
        // console.log('isMax', isMax);

        const afterAmountIn = await QUOTER_CONTRACT.callStatic.quoteExactOutput(
          outputPath,
          convertToWei(String(amountOutMinimum3)), //wei
        ); //ray

        // console.log('afterAmountIn', afterAmountIn);

        const afterAmountIn2 =
          Number(ethers.utils.formatUnits(afterAmountIn, 27)) * 1.005;
        // console.log('afterAmountIn2', afterAmountIn2);

        const result =
          isMax === true ? amountIn.toString() : afterAmountIn2.toString();

        return setMaxAmount(result ?? '-');
      }
      return setMaxAmount('-');
    }

    callData().catch((e) => {
      console.log('**fetchErr3 on useSwapModal**');
      console.log(e);
    });
  }, [
    amountIn,
    LibraryContract,
    QUOTER_CONTRACT,
    WTON_ADDRESS,
    TOS_ADDRESS,
    pools.TOS_WTON_POOL,
  ]);

  return maxAmount;
};
