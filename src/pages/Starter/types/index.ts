export interface I_StarterProject {
  name: string;
  saleStart: string;
  saleEnd: string;
  saleContractAddress: string;
}

export type ActiveProjectType = I_StarterProject & {
  isExclusive: boolean;
  tokenFundRaisingTargetAmount: string;
  projectTokenRatio: number;
  projectFundingTokenRatio: number;
  timeStamps: {
    checkStep: string;
    endDepositTime: number;
    endExclusiveTime: number;
    endOpenSaleTime: number;
    endWhiteListTime: number;
    startAddWhiteTime: number;
    startDepositTime: number;
    startExclusiveTime: number;
    startOpenSaleTime: number;
  };
};

export type UpcomingProjectType = I_StarterProject & {
  tokenFundRaisingTargetAmount: number;
};

export type PastProjectType = I_StarterProject;

export type MyProject = {
  name: string;
  saleContractAddress: string;
  nextClaimableDate: number;
};

export type SaleStatus = 'whitelist' | 'exclusive' | 'deposit';

export type ProjectStatus = 'active' | 'upcoming' | 'past';
export type Tier = 0 | 1 | 2 | 3 | 4;

export type DetailTierData = {
  userTier?: boolean;
  title: string;
  data: {key: string; value: string}[];
}[];

type tierTotalExpectSaleAmount = {
  1: string;
  2: string;
  3: string;
  4: string;
};

type TierAccounts = {
  1: string;
  2: string;
  3: string;
  4: string;
};

type TierCriteria = {
  1: string;
  2: string;
  3: string;
  4: string;
};

type TierAllocation = {
  1: string;
  2: string;
  3: string;
  4: string;
};

export type DetailInfo = {
  userTier: Tier;
  totalExpectSaleAmount: tierTotalExpectSaleAmount;
  tierAccounts: TierAccounts;
  tierCriteria: TierCriteria;
  tierAllocation: TierAllocation;
  tierOfMembers: TierCriteria;
};
