import {Contract} from '@ethersproject/contracts';
import {convertNumber, convertFromRayToWei} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {ethers} from 'ethers';
import {REACT_APP_MODE} from 'constants/index';
import store from 'store';
import {Token} from '@uniswap/sdk-core';
import {BigNumber} from 'ethers';

//use MEDIUM for simulator
export declare enum FeeAmount {
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

const {TOS_ADDRESS, UniswapStaking_Address} = DEPLOYED;

export const getToken = (
  chaindId: number,
  address: string,
  decimals: number,
) => {
  const token = new Token(chaindId, address, decimals);
  return token;
};

export const fetchSwapPayload = async () => {
  if (!store.getState().user.data) {
    return;
  }
  const {library} = store.getState().user.data;
  if (!library) {
    return;
  }
  const tosBalance = await getSwapInfo(library);
  if (REACT_APP_MODE === 'DEV') {
    return convertNumber({amount: tosBalance});
  } else {
    const wei = ethers.utils.formatUnits(tosBalance, 18);
    const invert = 1 / Number(wei);
    return invert.toFixed(6);
  }
};

const getSwapInfo = async (library: any) => {
  if (library) {
    // const TOS = getTokamakContract('TOS', library);
    const StakeUniswap = new Contract(
      UniswapStaking_Address,
      StakeUniswapABI.abi,
      library,
    );
    const basePrice =
      REACT_APP_MODE === 'DEV' ? '1000000000000000000000000000' : '1000000000';

    let price;
    try {
      price = await StakeUniswap.getPrice(basePrice);
    } catch (e) {
      console.log(e);
    }
    return price;
  }
};

const getTotalSupply = async (): Promise<number> => {
  if (!store.getState().user.data || !store.getState().user.data.library) {
    return 0;
  }
  const {library} = store.getState().user.data;
  const StakeUniswap = new Contract(
    UniswapStaking_Address,
    StakeUniswapABI.abi,
    library,
  );

  const totalSupply = await StakeUniswap.totalStakedAmount();
  const res = Number(convertNumber({amount: totalSupply.toString()}));
  return res || 0;
};

async function getReward(lp: number, unit: number): Promise<number> {
  const totalSupply = await getTotalSupply();

  if (!totalSupply || totalSupply === 0) {
    console.error(
      'Something wrong to call total supply from StakeUniswap.totalStakedAmount()',
    );
    return 0;
  }
  const seig = 0.845594452900389; //seig per sec
  const daySec = 86400;
  const lpRatio = Number(lp.toFixed(0)) / Number(totalSupply.toFixed(0));

  const lpRatioNum = Number(
    String(lpRatio).split('.')[0] +
      '.' +
      String(lpRatio).split('.')[1][0] +
      String(lpRatio).split('.')[1][1],
  );

  console.log('--reward--');
  console.log(lpRatioNum);
  console.log(seig);
  console.log(daySec);
  console.log(unit);
  console.log(lpRatioNum / 100);

  const reward = (lpRatioNum / 100) * seig * daySec * unit;
  console.log(reward);
  return reward;
}

type GetEstimatedReward = {
  token_0: number;
  token_1: number;
  cPrice: number;
  lower: number;
  upper: number;
  unit: number;
};

function getLiquidity(args: GetEstimatedReward) {
  const {token_0, token_1, cPrice, lower, upper} = args;

  if (cPrice <= lower) {
    const lq =
      (token_0 * (Math.sqrt(upper) * Math.sqrt(lower))) /
      (Math.sqrt(upper) - Math.sqrt(lower));
    return lq;
  } else if (lower < cPrice && cPrice <= upper) {
    const token0 =
      (token_0 * (Math.sqrt(upper) * Math.sqrt(cPrice))) /
      (Math.sqrt(upper) - Math.sqrt(cPrice));
    const token1 = token_1 / (Math.sqrt(cPrice) - Math.sqrt(lower));
    const lq = token0 > token1 ? token0 : token1;
    return lq;
  } else if (upper < cPrice) {
    const lq = token_1 / Math.sqrt(upper) - Math.sqrt(lower);
    return lq;
  }

  return 0;
}

export async function getEstimatedReward(
  args: GetEstimatedReward,
): Promise<number> {
  const {unit} = args;
  const lp = getLiquidity(args);
  if (lp === 0) {
    return 0;
  }
  const expectedReward = getReward(lp, unit);
  return expectedReward;
}

// export class UserLiquidity {
//   private lp: number;
//   readonly estimatedReward: number;
//   constructor(
//     private token_0: number,
//     private token_1: number,
//     private cPrice: number,
//     private lower: number,
//     private upper: number,
//   ) {
//      lp =  liquidity();
//      estimatedReward =  reward();
//   }
//   liquidity(): number {
//     if ( cPrice <=  lower) {
//       const lq =
//         ( token_0 * (Math.sqrt( upper) * Math.sqrt( lower))) /
//         (Math.sqrt( upper) - Math.sqrt( lower));
//       return lq;
//     } else if ( lower <  cPrice &&  cPrice <=  upper) {
//       const token0 =
//         ( token_0 * (Math.sqrt( upper) * Math.sqrt( cPrice))) /
//         (Math.sqrt( upper) - Math.sqrt( cPrice));
//       const token1 =
//          token_1 / (Math.sqrt( cPrice) - Math.sqrt( lower));
//       const lq = token0 > token1 ? token0 : token1;
//       return lq;
//     } else if ( upper <  cPrice) {
//       const lq =  token_1 / Math.sqrt( upper) - Math.sqrt( lower);
//       return lq;
//     }

//     return 0;
//   }

//   reward(): number {
//     const totalSupply = await getTOSContract();
//     return 0;
//   }
// }

// Formula for this
// https://uniswapv3.flipsidecrypto.com/
// Case 1: cprice <= lower
// liquidity = amt0 * (sqrt(upper) * sqrt(lower)) / (sqrt(upper) - sqrt(lower))
// Case 2: lower < cprice <= upper
// liquidity is the min of the following two calculations:
// amt0 * (sqrt(upper) * sqrt(cprice)) / (sqrt(upper) - sqrt(cprice))
// amt1 / (sqrt(cprice) - sqrt(lower))
// Case 3: upper < cprice
// liquidity = amt1 / (sqrt(upper) - sqrt(lower))
