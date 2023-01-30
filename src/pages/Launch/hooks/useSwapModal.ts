import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useEffect, useState} from 'react';
import * as WTONABI from 'services/abis/WTON.json';
import * as QuoterAbi from 'services/abis/Quoter.json';

import {convertNumber, convertToRay, convertToWei} from 'utils/number';

export const useSwapModal = (vaultAddress: string, amountIn: number) => {
  const {WTON_ADDRESS, Quoter, TOS_ADDRESS} = DEPLOYED;
  const WTON_CONTRACT = useContract(WTON_ADDRESS, WTONABI.abi);
  const QUOTER_CONTRACT = useContract(Quoter, QuoterAbi.abi);

  const [WTON_BALANCE, setWTON_BALANCE] = useState<string>('-');
  const [tosAmountOut, setTosAmountOut] = useState<string>('-');

  useEffect(() => {
    async function callData() {
      if (WTON_CONTRACT) {
        const balance_BN = await WTON_CONTRACT.balanceOf(vaultAddress);
        const result = convertNumber({
          amount: balance_BN.toString(),
          localeString: true,
        });
        return setWTON_BALANCE(result ?? '-');
      }
      return setWTON_BALANCE('-');
    }
    callData().catch((e) => {
      console.log('**fetchErr on useSwapModal**');
      console.log(e);
    });
  }, [WTON_CONTRACT, vaultAddress]);

  // https://www.notion.so/onther/TonSwapperV2-function-1fd359f6d30f4410b99906ce79b1bd16#e865346050c94aacb7dfe99e249246ed
  useEffect(() => {
    async function callData() {
      if (QUOTER_CONTRACT) {
        //  const amountOut = await quoteContract.callStatic.quoteExactInputSingle(
        //    tokenIn,
        //    tokenOut,
        //    fee,
        //    amountIn,
        //    0,
        //  );

        const amountOut_BN =
          await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
            WTON_ADDRESS,
            TOS_ADDRESS,
            3000,
            convertToRay(String(amountIn)),
            0,
          );

        const result = convertNumber({
          amount: amountOut_BN.toString(),
          localeString: true,
        });
        return setTosAmountOut(result ?? '-');
      }
      return setTosAmountOut('-');
    }
    callData().catch((e) => {
      console.log('**fetchErr2 on useSwapModal**');
      console.log(e);
    });
  }, [QUOTER_CONTRACT, vaultAddress, amountIn, TOS_ADDRESS, WTON_ADDRESS]);

  return {WTON_BALANCE, tosAmountOut};
};
