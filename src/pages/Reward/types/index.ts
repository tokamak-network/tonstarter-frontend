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

  export type incentiveKey = {
    rewardToken: string,
    pool: string,
    startTime: Number,
    endTime: Number,
    refundee: string
  }
  export type Reward = {
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

  export type UpdatedRedward = Reward & {
    token0Address: string,
    token1Address: string; 
    token0Image: string;
  token1Image: string
  }