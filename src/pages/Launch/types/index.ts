type VaultName = 'Public' | string;

interface Vault {
  vaultName: VaultName;
  vaultTokenAllocation: Number;
  firstClaimTime: Date;
  claimInterval: Date;
  claimRound: Number;
  adminAddress: string;
  isMandatory: boolean;
}

interface VaultCommon {
  claimRound: number;
  claimTime: number;
  claimTokenAllocation: number;
}

type VaultDao = Vault & {params: VaultCommon[]};

type VaultPublic = Vault & {params: VaultCommon[]};

type VaultC = Vault & {params: VaultCommon[]};

type VaultAny = VaultDao | VaultPublic | VaultC;

interface ProjectStep1 {
  projectName: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  ownerAddress: string;
}
interface ProjectStep2 {
  vaults: VaultAny[];
}

interface ProjectStep3 {
  isTokenDeployed: boolean;
  isAllDeployed: boolean;
}

type Project = ProjectStep1 & ProjectStep2 & ProjectStep3;

type Projects = {
  CreateProject: Project;
};

type ChainNumber = 1 | 4;

type StepNumber = 1 | 2 | 3;

export type {
  Projects,
  ProjectStep1,
  ProjectStep2,
  ProjectStep3,
  ChainNumber,
  StepNumber,
  Vault,
  VaultDao,
  VaultPublic,
  VaultC,
  VaultCommon,
  VaultName,
  VaultAny,
};
