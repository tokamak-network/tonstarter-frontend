export interface I_StarterProject {
  name: string;
  saleStart: string;
  saleEnd: string;
  status: StarterStatus;
}

export type StarterProject = I_StarterProject & {
  isExclusive: boolean;
};

export type StarterStatus = 'active' | 'upcoming' | 'past';
export type SaleStatus = 'whitelist' | 'exclusive' | 'open';

export type Tier = 1 | 2 | 3 | 4 | undefined;

export type DetailTierData = {
  userTier?: boolean;
  title: string;
  data: {key: string; value: string}[];
}[];
