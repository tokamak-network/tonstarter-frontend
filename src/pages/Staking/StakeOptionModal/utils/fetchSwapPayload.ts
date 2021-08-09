// import {getTokamakContract} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {DEPLOYED} from 'constants/index';
// import { convertToWei } from '../../../../utils/number';
const {UniswapStaking_Address} = DEPLOYED;

export const fetchSwapPayload = async (
  library: any,
) => {
  const tosBalance = await getSwapInfo(library);
  return convertNumber({
    amount: tosBalance,
  });
};

const getSwapInfo = async (
  library: any,
) => {
  if (library) {
    // const TOS = getTokamakContract('TOS', library);
    const StakeUniswap = new Contract(UniswapStaking_Address, StakeUniswapABI.abi, library);
    const basePrice = '1000000000000000000000000000'
    
    let price
    try {
      price = await StakeUniswap.getPrice(basePrice)
    } catch (e) {
      console.log(e);
    }
    return price
  }
};
