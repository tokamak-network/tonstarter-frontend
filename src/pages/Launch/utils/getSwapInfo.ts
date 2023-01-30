import {DEPLOYED} from 'constants/index';
import {BigNumber, Contract, ethers} from 'ethers';
import * as QuoterABI from 'services/abis/Quoter.json';
import {LibraryType} from 'types';

//https://www.notion.so/onther/TonSwapperV2-function-1fd359f6d30f4410b99906ce79b1bd16#e865346050c94aacb7dfe99e249246ed
//https://www.notion.so/onther/TonSwapperV2-function-1fd359f6d30f4410b99906ce79b1bd16#ee80fbbd08024454a11c2cbeddabdce8
export default async function getSwapInfo(
  amountIn: BigNumber,
  library: ethers.Signer | ethers.providers.Provider,
) {
  const {WTON_ADDRESS, TOS_ADDRESS} = DEPLOYED;
  const quoteContract = new Contract(
    '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    QuoterABI.abi,
    library,
  );
  const amountOut = await quoteContract.callStatic.quoteExactInputSingle(
    WTON_ADDRESS,
    TOS_ADDRESS,
    //fee
    3000,
    amountIn,
    0,
  );
  return amountOut;
}
