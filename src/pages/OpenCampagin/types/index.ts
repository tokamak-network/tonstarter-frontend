interface Vault {
  vaultName: String;
  vaultTokenAllocation: Number;
  firstClaimTime: Date;
  claimInterval: Date;
  claimRound: Number;
  adminAddress: string;
}

type VaultCommon = Vault & {};

type VaultDao = Vault;

interface ProjectStep1 {
  projectName: string;
  description: string;
}
interface ProjectStep2 {
  tokenName: String;
  tokenSymbol: String;
  totalSupply: String;
  ownerAddress: String;
}
interface ProjectStep3 {}

interface ProjectStep5 {
  isTokenDeployed: boolean;
  isAllDeployed: boolean;
}

type Project = ProjectStep1 & ProjectStep2 & ProjectStep3 & ProjectStep5;

type Projects = {
  CreateProject: Project;
};

type ChainNumber = 1 | 4;

type StepNumber = 1 | 2 | 3 | 4 | 5;

export type {
  Projects,
  ProjectStep1,
  ProjectStep2,
  ProjectStep3,
  ProjectStep5,
  ChainNumber,
  StepNumber,
};
