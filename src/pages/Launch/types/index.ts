type VaultName =
  | 'Public'
  | 'Initial Liquidity'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | 'Liquidity Incentive'
  | string;

type VaultType =
  | 'Public'
  | 'Initial Liquidity'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | 'Liquidity Incentive'
  | 'DAO'
  | 'C';

interface Vault {
  vaultName: VaultName;
  vaultType: VaultType;
  vaultTokenAllocation: number;
  adminAddress: string;
  isMandatory: boolean;
  vaultAddress: string | undefined;
  index: number;
  isDeployed: boolean;
  isSet: boolean;
  isDeployedErr: boolean;
}

interface VaultSchedule {
  claimRound: number | undefined;
  claimTime: number | undefined;
  claimTokenAllocation: number | undefined;
}

type VaultCommon = Vault & {claim: VaultSchedule[]};

type VaultDao = VaultCommon & {};

type VaultLiquidity = VaultCommon & {};

type VaultTON = VaultCommon & {};

type VaultTOS = VaultCommon & {};

type VaultPublic = VaultCommon & {
  stosTier: {
    oneTier: {
      requiredStos: number | undefined;
      allocatedToken: number | undefined;
    };
    twoTier: {
      requiredStos: number | undefined;
      allocatedToken: number | undefined;
    };
    threeTier: {
      requiredStos: number | undefined;
      allocatedToken: number | undefined;
    };
    fourTier: {
      requiredStos: number | undefined;
      allocatedToken: number | undefined;
    };
  };
  snapshot: number | undefined;
  whitelist: number | undefined;
  whitelistEnd: number | undefined;
  publicRound1: number | undefined;
  publicRound1End: number | undefined;
  publicRound2: number | undefined;
  publicRound2End: number | undefined;
  publicRound1Allocation: number | undefined;
  publicRound2Allocation: number | undefined;
  claimStart: number | undefined;
  tokenAllocationForLiquidity: number | undefined;
  hardCap: number | undefined;
  addressForReceiving: string | undefined;
};

type VaultC = VaultCommon & {};
type VaultLiquidityIncentive = VaultCommon & {
  poolAddress: string | undefined;
  tokenPair: string | undefined;
};

type VaultAny = VaultDao | VaultPublic | VaultC | VaultLiquidityIncentive;

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
  tosPrice: number;
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
      content: string | undefined;
      percent: number | undefined;
      formikName: string;
    },
    {
      title: 'Public Round 2';
      content: string | undefined;
      percent: number | undefined;
      formikName: string;
    },
    {
      title: 'Token Allocation for Liquidity Pool (5~10%)';
      content: string | undefined;
      formikName: string;
    },
    {
      title: 'Hard Cap';
      content: string | undefined;
      formikName: string;
    },
    {
      title: 'Address for receiving funds';
      content: string | undefined;
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
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
    },
    {
      tier: '2';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
    },
    {
      tier: '3';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
    },
    {
      tier: '4';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
    },
  ];
  liquidityColData?: [
    {
      title: 'Select Pair';
      content: string | undefined;
      formikName: string;
    },
    {
      title: 'Pool Address\n(0.3% fee)';
      content: string | undefined;
      formikName: string;
    },
  ];
};

type Step3_InfoList = {
  [Key: string]: {title: string; content: string | number; isHref?: boolean}[];
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
  VaultType,
  Step3_InfoList,
  VaultLiquidityIncentive,
};
