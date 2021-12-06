export type Tab = 'Search' | 'Custom';

export type PoolData = {
    chainId: number;
    poolName: string;
    poolAddress: string;
    token0Address: string;
    token1Address: string;
    token0Image: string;
    token1Image: string;
    feeTier: number;
  };
  
  export type FetchPoolData = PoolData & {
    numRewardPrograms: number;
  };

  export type Token = {
    id: string;
  symbol: string;
  }

  export type incentiveKey = {
    rewardToken: string,
    pool: string,
    startTime: Number,
    endTime: Number,
    refundee: string
  }
  export type interfaceReward = {
      chainId: Number, 
      poolName: string,
      poolAddress: string,
      rewardToken: string,
      incentiveKey: incentiveKey,
      startTime: Number,
      endTime: Number,
      allocatedReward: string,
      numStakers: Number,
      status: string
  }

  export type UpdatedRedward = interfaceReward & {
    token0Address: string,
    token1Address: string; 
    token0Image: string;
  token1Image: string
  }

  export type LPToken = {
    id: string;
    owner:string;
    pool: {
      id: string
    }
  }