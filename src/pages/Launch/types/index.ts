type VaultName =
  | 'Public'
  | 'LP'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | string;

interface Vault {
  vaultName: VaultName;
  vaultTokenAllocation: number;
  firstClaimTime: number;
  claimInterval: number;
  claimRound: number;
  adminAddress: string;
  isMandatory: boolean;
  vaultAddress: string | undefined;
}

interface VaultSchedule {
  claimRound: number;
  claimTime: number;
  claimTokenAllocation: number;
}

type VaultCommon = Vault & {claim: VaultSchedule[]};

type VaultDao = VaultCommon & {};

type VaultLiquidity = VaultCommon & {};

type VaultTON = VaultCommon & {};

type VaultTOS = VaultCommon & {};

type VaultPublic = VaultCommon & {
  stosTier: {
    oneTier: {
      requiredStos: number;
      allocatedToken: number;
    };
    twoTier: {
      requiredStos: number;
      allocatedToken: number;
    };
    threeTier: {
      requiredStos: number;
      allocatedToken: number;
    };
    fourTier: {
      requiredStos: number;
      allocatedToken: number;
    };
  };
  whitelist: number;
  publicRound1: number;
  publicRound2: number;
  claimStart: number;
};

type VaultC = VaultCommon & {};

type VaultAny = VaultDao | VaultPublic | VaultC;

interface ProjectStep1 {
  projectName: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number | undefined;
  ownerAddress: string;
  owner: string;
}
interface ProjectStep2 {
  vaults: VaultAny[];
  projectTokenPrice: number;
  totalTokenAllocation: number;
}

interface ProjectStep3 {
  isTokenDeployed: boolean;
  isAllDeployed: boolean;
  tokenAddress: string;
  isTokenDeployedErr: boolean;
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
  VaultSchedule,
};
