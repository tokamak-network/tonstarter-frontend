import {Contract} from '@ethersproject/contracts';
import {convertNumber, convertFromRayToWei} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {ethers} from 'ethers';
import {REACT_APP_MODE} from 'constants/index';
import store from 'store';
import {Token} from '@uniswap/sdk-core';
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

export const getTOSContract = async () => {
  if (!store.getState().user.data) {
    return;
  }
  const {library} = store.getState().user.data;
  if (!library) {
    return;
  }
  const StakeUniswap = new Contract(
    UniswapStaking_Address,
    StakeUniswapABI.abi,
    library,
  );

  const totalSupply = await StakeUniswap.totalSupplyCoinage();
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

interface GetLiquidity {
  liquidity: () => number;
  reward: () => number;
}
export class UserLiquidity implements GetLiquidity {
  constructor(
    private token_0: number,
    private token_1: number,
    private cPrice: number,
    private lower: number,
    private upper: number,
  ) {}

  liquidity(): number {
    if (this.cPrice <= this.lower) {
      const lq =
        (this.token_0 * (Math.sqrt(this.upper) * Math.sqrt(this.lower))) /
        (Math.sqrt(this.upper) - Math.sqrt(this.lower));
      return lq;
    } else if (this.lower < this.cPrice && this.cPrice <= this.upper) {
      const token0 =
        (this.token_0 * (Math.sqrt(this.upper) * Math.sqrt(this.cPrice))) /
        (Math.sqrt(this.upper) - Math.sqrt(this.cPrice));
      const token1 =
        this.token_1 / (Math.sqrt(this.cPrice) - Math.sqrt(this.lower));
      const lq = token0 > token1 ? token0 : token1;
      return lq;
    } else if (this.upper < this.cPrice) {
      const lq = this.token_1 / Math.sqrt(this.upper) - Math.sqrt(this.lower);
      return lq;
    }

    return 0;
  }
  reward(): number {
    return 0;
  }
}

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
