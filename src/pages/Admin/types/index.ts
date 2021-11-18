export type StepOne = {
  name: string;
  description: string;
  adminAddress: string;
  website: string;
  telegram: string;
  medium: string;
  twitter: string;
  discord: string;
  image: any;
};

export type StepTwo = {
  tokenName: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenSymbolImage: any;
  tokenAllocationAmount: string;
  tokenFundRaisingTargetAmount: string;
  fundingTokenType: 'TON';
  tokenFundingRecipient: string;
  projectTokenRatio: number;
  projectFundingTokenRatio: number;
};

export type StepThree = {
  saleContractAddress: string;
  snapshot: number;
  startAddWhiteTime: number;
  endAddWhiteTime: number;
  startExclusiveTime: number;
  endExclusiveTime: number;
  startDepositTime: number;
  endDepositTime: number;
  startClaimTime: number;
  claimInterval: number;
  claimPeriod: number;
  claimFirst: number;
};

export type StepFour = {
  position: 'active' | 'upcoming' | '';
  production: 'dev' | 'production' | '';
  topSlideExposure: boolean;
};

export type AdminObject = StepOne & StepTwo & StepThree & StepFour;

export type StepOneNameArr = Extract<keyof StepOne, keyof AdminObject>[];
export type StepTwoNameArr = Extract<keyof StepTwo, keyof AdminObject>[];
export type StepThreeNameArr = Extract<keyof StepThree, keyof AdminObject>[];
export type StepFourNameArr = Extract<keyof StepFour, keyof AdminObject>[];

export type StepNameArrOneOf =
  | StepOneNameArr
  | StepTwoNameArr
  | StepThreeNameArr
  | StepFourNameArr;

export type StepOneName = {
  stepOne: StepOneNameArr;
};

export type StepTwoName = {
  stepTwo: StepTwoNameArr;
};
export type StepThreeName = {
  stepThree: StepThreeNameArr;
};
export type StepFourName = {
  stepFour: StepFourNameArr;
};
export type StepsName = StepOneName &
  StepTwoName &
  StepThreeName &
  StepFourName;

export type StepComponent = {
  stepName: string[];
  currentStep: number;
};

export type ListingTableData = {
  contractAddress: string;
  adminAddress: string;
  name: string;
  token: string;
  saleStart: string;
  saleEnd: string;
  saleAmount: string;
  fundingRaised: string;
  status: string;
  btn: any;
};

export type ListingPoolsTableData = {
  name: string;
  address: string;
  rewardPrograms: number;
};

export type ListingRewardTableData = {
  pool: string;
  rewardToken: string;
  incentiveKey: {
    rewardToken: string;
    pool: string;
    startTime: number;
    endTime: number;
    refundee: string;
  };
  start: string;
  end: string;
  allocatedReward: string;
  stakers: string;
  status: 'Waiting' | 'On progress' | 'Closed';
};

export type FetchReward = {
  allocatedReward: string;
  chainId: number;
  endTime: number;
  incentiveKey: {
    endTime: number;
    pool: string;
    refundee: string;
    rewardToken: string;
    startTime: number;
  };
  numStakers: number;
  poolAddress: string;
  poolName: string;
  rewardToken: string;
  startTime: number;
  status: string;
};

export type PoolData = {
  chainId: number;
  poolName: string;
  poolAddress: String;
  token0Address: String;
  token1Address: String;
  token0Image: String;
  token1Image: String;
  feeTier: number;
};
