export type Tab = 'Search' | 'Custom';

export type PoolData = {
  chainId: number;
  poolName: string;
  poolAddress: string;
  token0Address: string;
  token0Price: string;
  token1Address: string;
  token1Price: string;
  token0Image: string;
  token1Image: string;
  feeTier: number;
};

export type FetchPoolData = PoolData & {
  numRewardPrograms: number;
};


export type TokensData = {
  chainId: number;
  tokenAddress: string;
  token: {
    chainId: number;
    decimals: number;
    symbol: string;
    name: string;
    isNative: boolean;
    isToken: boolean;
    address: string;
  }
}

export type Token = {
  id: string;
symbol: string;
}

export type incentiveKey = {
  rewardToken: string,
  pool: string,
  startTime: number,
  endTime: number,
  refundee: string
}
export type interfaceReward = {
    chainId: number, 
    poolName: string,
    poolAddress: string,
    rewardToken: string,
    incentiveKey: incentiveKey,
    startTime: number,
    endTime: number,
    allocatedReward: string,
    numStakers: Number,
    status: string,
    index: number
}

export type interfacePool = {
  chainId: number, 
  poolName: string,
  poolAddress: string
}

export type UpdatedRedward = interfaceReward & {
  token0Address: string,
  token1Address: string; 
  token0Image: string;
token1Image: string;
rewardTokenSymbolImage: string;
}

export type LPToken = {
  id: string;
  owner:string;
  pool: {
    id: string
  };
  liquidity: string;
  range: boolean;
}