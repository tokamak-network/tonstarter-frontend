type VaultName =
  | 'Public'
  | 'LP'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | string;

type VaultType =
  | 'Public'
  | 'LP'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | 'DAO'
  | 'C';

interface Vault {
  vaultName: VaultName;
  vaultType: VaultType;
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
  snapshot: number;
  whitelist: number;
  whitelistEnd: number;
  publicRound1: number;
  publicRound1End: number;
  publicRound2: number;
  publicRound2End: number;
  publicRound1Allocation: number;
  publicRound2Allocation: number;
  claimStart: number;
  tokenAllocationForLiquidity: number;
  hardCap: number;
  addressForReceiving: string;
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

type PublicTokenColData = {
  firstColData: [
    {
      title: 'Public Round 1';
      content: string;
      percent: number;
      formikName: string;
    },
    {
      title: 'Public Round 2';
      content: string;
      percent: number;
      formikName: string;
    },
    {
      title: 'Token Allocation for Liquidity Pool';
      content: string;
      percent: number;
      formikName: string;
    },
    {
      title: 'Hard Cap';
      content: string;
      formikName: string;
    },
    {
      title: 'Address for receiving funds';
      content: string;
      formikName: string;
    },
  ];
  secondColData: [
    {
      title: 'Snapshot';
      content: string;
      formikName: string;
    },
    {
      title: 'Whitelist';
      content: string;
      formikName: string;
    },
    {
      title: 'Public Round 1';
      content: string;
      formikName: string;
    },
    {
      title: 'Public Round 2';
      content: string;
      formikName: string;
    },
  ];
  thirdColData: [
    {
      tier: '1';
      requiredTos: number;
      allocatedToken: number;
      formikName: string;
    },
    {
      tier: '2';
      requiredTos: number;
      allocatedToken: number;
      formikName: string;
    },
    {
      tier: '3';
      requiredTos: number;
      allocatedToken: number;
      formikName: string;
    },
    {
      tier: '4';
      requiredTos: number;
      allocatedToken: number;
      formikName: string;
    },
  ];
};

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
  PublicTokenColData,
};
