type VaultName =
  | 'Public'
  | 'Initial Liquidity'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | 'Liquidity Incentive'
  | 'Vesting'
  | string;

type VaultType =
  | 'Public'
  | 'Initial Liquidity'
  | 'TON Staker'
  | 'TOS Staker'
  | 'WTON-TOS LP Reward'
  | 'Liquidity Incentive'
  | 'DAO'
  | 'Vesting'
  | 'C';

  type SimplifiedVaultName = 'Public' | 'Ecosystem' | 'Team' | 'Liquidity' | 'TONStarter'
  type SimplifiedVaultType = 'Public'| 'Ecosystem' | 'Team' | 'Liquidity' | 'TONStarter'
  
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

interface VaultSimplified {
  vaultName: SimplifiedVaultName;
  vaultType: SimplifiedVaultType;
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

type VaultCommonSimplified = VaultSimplified & {claim: VaultSchedule[]};

type VaultEco = VaultCommonSimplified & {};
type VaultTeam = VaultCommonSimplified & {};
type VaultTONStarter = VaultCommonSimplified & {};

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
  startTime?: string | number | undefined;
};

type VaultAny = VaultPublic | VaultDao | VaultC | VaultLiquidityIncentive;
type simplifiedVaultsAny = VaultPublic | VaultEco | VaultTeam | VaultTONStarter |VaultLiquidityIncentive
type TokenType = 'A' | 'B' | 'C';

interface ProjectStep1 {
  projectName: string | undefined;
  description: string | undefined;
  tokenName: string | undefined;
  tokenSymbol: string | undefined;
  totalSupply: number | undefined;
  tokenType: TokenType | undefined;
  ownerAddress: string;
  owner: string | undefined;
  sector: string;
  tokenSymbolImage: string;
  website: string;
  medium: string;
  telegram: string;
  twitter: string;
  discord: string;
  tokenOwnerAccount: string | undefined;
}
interface ProjectStep2 {
  vaults: VaultAny[];
  tosPrice: number;
  projectTokenPrice: number;
  totalTokenAllocation: number;
  // salePrice: number;
}

interface ProjectStep3 {
  isTokenDeployed: boolean;
  isAllDeployed: boolean;
  tokenAddress: string;
  isTokenDeployedErr: boolean;
}


interface SimplifiedVault {
  tokenAllocation: number | undefined;
  vaultName: SimplifiedVaultName;
  vaultType: SimplifiedVaultType
}




interface SimplifiedProjectStep1 {
  projectName: string | undefined;
  description: string | undefined;
  tokenName: string | undefined;
  tokenSymbol: string | undefined;
  tokenSymbolImage: string;
  ownerAddress: string;
  // snapshotTime: number | undefined;
  // whitelistStart: number | undefined;
  // whitelistEnd: number | undefined;
  // publicSale1Start: number | undefined;
  // publicSale1End: number | undefined;
  // publicSale2Start: number | undefined;
  // publicSale2End: number | undefined;
  vaults: simplifiedVaultsAny[];
}

interface SimplifiedProjectStep2 {
  hardCap: number | undefined;
  marketCap: number | undefined;
  totalSupply: number | undefined;
  tokenPrice: number | undefined;
  dexPrice: number | undefined;
  growth: number | undefined;
  stablePrice: number | undefined;
  exchangeRate: number|undefined;
  // vaults : simplifiedVaultsAny[];
}
interface SimplifiedProjectStep3 {
  isTokenDeployed: boolean;
  isTokenDeployedErr: boolean;
  tokenAddress: string;
  isAllDeployed: boolean;
}

type Project = ProjectStep1 & ProjectStep2 & ProjectStep3;
type SimplifiedProject = SimplifiedProjectStep1 &
  SimplifiedProjectStep2 &
  SimplifiedProjectStep3;

type Projects = {
  
  CreateSimplifiedProject: SimplifiedProject;
  CreateProject: Project;
};

type SimpleProjects = {
  CreateSimplifiedProject: SimplifiedProject;
};
type ChainNumber = 1 | 4;

type StepNumber = 1 | 2 | 3;

type TEconomyStepNumber = 0 | 1 | 2 | 3;

type PublicTokenColData = {
  firstColData: [
    {
      title: 'Public Round 1';
      content: string | undefined;
      percent: number | undefined;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Public Round 2';
      content: string | undefined;
      percent: number | undefined;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Token Allocation for Liquidity Pool (5~50%)';
      content: string | undefined;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Minimum Fundraising Amount';
      content: string | undefined;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Address for receiving funds';
      content: string | undefined;
      formikName: string;
      err: boolean;
    },
  ];
  secondColData: [
    {
      title: 'Snapshot';
      content: string;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Whitelist';
      content: string;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Public Round 1';
      content: string;
      formikName: string;
      err: boolean;
    },
    {
      title: 'Public Round 2';
      content: string;
      formikName: string;
      err: boolean;
    },
  ];
  thirdColData: [
    {
      tier: '1';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
      err: boolean;
    },
    {
      tier: '2';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
      err: boolean;
    },
    {
      tier: '3';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
      err: boolean;
    },
    {
      tier: '4';
      requiredTos: number | undefined;
      allocatedToken: number | undefined;
      formikName: string;
      err: boolean;
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
  initialLiquidityColData?: [
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
    {
      title: 'Exchange Ratio\n1 TOS';
      content: string | undefined;
      formikName: string;
    },
    {
      title: 'Start Time';
      content: string | undefined;
      formikName: 'startTime';
    },
  ];
};

type Step3_InfoList = {
  [Key: string]: {title: string; content: string | number; isHref?: boolean}[];
};

interface I_StarterProject {
  name: string;
  saleStart: string;
  saleEnd: string;
  current: number;
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
}

type ProjectCardType = {
  data: {
    description: string;
    isAllDeployed: boolean;
    isTokenDeployed: boolean;
    isTokenDeployedErr: boolean;
    owner: string;
    ownerAddress: string;
    projectName: string;
    projectTokenPrice: number;
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    tosPrice: number;
    totalSupply: number;
    totalTokenAllocation: String;
    vaults: VaultAny[];
  };
  key: string;
};

type LaunchMode = 'simplified' | 'advance';

export type {
  Projects,
  ProjectStep1,
  ProjectStep2,
  ProjectStep3,
  SimplifiedProjectStep1,
  SimplifiedProjectStep2,
  SimplifiedProjectStep3,
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
  ProjectCardType,
  TokenType,
  LaunchMode,
  TEconomyStepNumber,
  SimpleProjects,
};
