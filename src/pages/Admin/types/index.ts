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
  tokenAllowcationAmount: string;
  tokenFundRaisingTargetAmount: string;
  tokenFundingRecipient: string;
  projectTokenRatio: number;
  projectFundingTokenRatio: number;
};

export type StepThree = {
  saleContractAddress: string;
  vestingContractAddress: string;
  snapshotTimestamp: number;
  exclusiveStartTime: number;
  addWhitelistEndTime: number;
  participationEndTime: number;
  subscriptionStartTime: number;
  saleStartTime: number;
  saleEndTime: number;
  claimStartTime: number;
  //sec
  claimIntervals: number;
  claimCount: number;
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
