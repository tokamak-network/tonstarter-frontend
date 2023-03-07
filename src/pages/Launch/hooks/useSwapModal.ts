import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useEffect, useState} from 'react';
import * as WTONABI from 'services/abis/WTON.json';
import * as QuoterAbi from 'services/abis/Quoter.json';
import * as LibPublicSale from 'services/abis/LibPublicSale.json';
import {ethers} from 'ethers';
import {convertNumber, convertToRay, convertToWei} from 'utils/number';
import {encode} from 'querystring';

export const useSwapModal = (amountIn: number, vaultAddress?: string) => {
  const {
    TON_ADDRESS,
    WTON_ADDRESS,
    Quoter,
    TOS_ADDRESS,
    pools,
    LibPublicSaleLogic,
  } = DEPLOYED;
  const WTON_CONTRACT = useContract(WTON_ADDRESS, WTONABI.abi);
  const QUOTER_CONTRACT = useContract(Quoter, QuoterAbi.abi);
  const LibraryContract = useContract(LibPublicSaleLogic, LibPublicSale.abi);
  const [WTON_BALANCE, setWTON_BALANCE] = useState<string>('-');
  const [tosAmountOut, setTosAmountOut] = useState<string>('-');

  useEffect(() => {
    async function callData() {
      if (WTON_CONTRACT && vaultAddress) {
        const balance_BN = await WTON_CONTRACT.balanceOf(vaultAddress);

        const result = convertNumber({
          amount: balance_BN.toString(),
          localeString: true,
          type: 'ray',
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

        const amountOut_BN = await QUOTER_CONTRACT.callStatic.quoteExactInput(
          path,
          convertToRay(String(amountIn)),
        );

        const result = Number(
          ethers.utils.formatUnits(amountOut_BN.toString(), 18),
        ).toLocaleString();

        return setTosAmountOut(result ?? '-');
      }
      return setTosAmountOut('-');
    }

    callData().catch((e) => {
      console.log('**fetchErr2 on useSwapModal**');
      console.log(e);
    });
  }, [
    QUOTER_CONTRACT,
    Quoter,
    vaultAddress,
    amountIn,
    TOS_ADDRESS,
    WTON_ADDRESS,
  ]);

  return {WTON_BALANCE, tosAmountOut};
};

//ethers.utils.formatUnits(totalSupply, 27),
