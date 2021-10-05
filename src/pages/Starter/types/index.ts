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
};

export type UpcomingProjectType = I_StarterProject & {
  tokenFundRaisingTargetAmount: number;
};

export type PastProjectType = I_StarterProject;

export type SaleStatus = 'whitelist' | 'exclusive' | 'deposit' | 'openSale';

export type ProjectStatus = 'active' | 'upcoming' | 'past';
export type Tier = 1 | 2 | 3 | 4 | undefined;

export type DetailTierData = {
  userTier?: boolean;
  title: string;
  data: {key: string; value: string}[];
}[];
