import {AdminObject, FundingTokenTypes} from '@Admin/types';

export interface I_StarterProject {
  name: string;
  saleStart: string;
  saleEnd: string;
  saleContractAddress: string;
  tokenSymbolImage: string;
  tokenFundRaisingTargetAmount: string;
  fundingTokenType: FundingTokenTypes;
}

export type ActiveProjectType = I_StarterProject & {
  isExclusive: boolean;
  projectTokenRatio: number;
  projectFundingTokenRatio: number;
  step: 'whitelist' | 'exclusive' | 'deposit' | 'past';
  timeStamps: {
    checkStep: 'whitelist' | 'exclusive' | 'deposit' | 'past';
    endDepositTime: number;
    endExclusiveTime: number;
    endOpenSaleTime: number;
    endAddWhiteTime: number;
    startAddWhiteTime: number;
    startDepositTime: number;
    startExclusiveTime: number;
    startOpenSaleTime: number;
    snapshot: number;
  };
  tokenName: string;
  tokenSymbolImage: string;
};

export type UpcomingProjectType = I_StarterProject & {
  website: string;
};

export type PastProjectType = I_StarterProject & {
  tokenCalRatio: number;
};

export type SaleInfo = AdminObject & {tokenExRatio: number};

export type MyProject = {
  name: string;
  saleContractAddress: string;
  nextClaimableDate: number;
};

export type SaleStatus =
  | 'snapshot'
  | 'whitelist'
  | 'exclusive'
  | 'deposit'
  | 'claim';

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
  snapshot: number;
};
