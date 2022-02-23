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
}
interface ProjectStep2 {
  tokenName: String;
  tokenSymbol: String;
  totalSupply: String;
  ownerAddress: String;
}
interface ProjectStep3 {
  vaults: [VaultPublic | VaultC | VaultDao];
}

interface ProjectStep5 {
  isTokenDeployed: boolean;
  isAllDeployed: boolean;
}

type Project = ProjectStep1 & ProjectStep2 & ProjectStep3 & ProjectStep5;

type Projects = {
  CreateProject: Project;
};

type ChainNumber = 1 | 4;

type StepNumber = 1 | 2 | 3 | 4;

export type {
  Projects,
  ProjectStep1,
  ProjectStep2,
  ProjectStep3,
  ProjectStep5,
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
