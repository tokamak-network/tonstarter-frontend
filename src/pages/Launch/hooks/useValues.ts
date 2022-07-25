import {useState} from 'react';
import type {Projects, VaultC} from '@Launch/types';
import {DEPLOYED} from 'constants/index';
import {stosMinimumRequirements} from '@Launch/const';

const defaultParams = [
  {claimRound: 1, claimTime: undefined, claimTokenAllocation: undefined},
];

const {
  pools: {TOS_WTON_POOL},
} = DEPLOYED;

const initialObj: Projects['CreateProject'] = {
  projectName: undefined,
  description: undefined,
  tokenName: undefined,
  tokenSymbol: undefined,
  totalSupply: undefined,
  ownerAddress: '',
  owner: undefined,
  isTokenDeployed: false,
  isTokenDeployedErr: false,
  isAllDeployed: false,
  tokenAddress: '',
  tokenType: undefined,
  tokenOwnerAccount: undefined,
  tosPrice: 0,
  projectTokenPrice: 0,
  salePrice: 0,
  totalTokenAllocation: 0,
  sector: '',
  tokenSymbolImage: '',
  website: '',
  medium: '',
  telegram: '',
  twitter: '',
  discord: '',
  vaults: [
    {
      vaultName: 'Public',
      vaultType: 'Public',
      vaultTokenAllocation: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      tokenAllocationForLiquidity: 5,
      hardCap: undefined,
      addressForReceiving: '',
      isDeployed: false,
      isSet: false,
      isDeployedErr: false,
      stosTier: {
        oneTier: {
          requiredStos: stosMinimumRequirements.tier1,
          allocatedToken: undefined,
        },
        twoTier: {
          requiredStos: stosMinimumRequirements.tier2,
          allocatedToken: undefined,
        },
        threeTier: {
          requiredStos: stosMinimumRequirements.tier3,
          allocatedToken: undefined,
        },
        fourTier: {
          requiredStos: stosMinimumRequirements.tier4,
          allocatedToken: undefined,
        },
      },
      snapshot: undefined,
      whitelist: undefined,
      whitelistEnd: undefined,
      publicRound1: undefined,
      publicRound1End: undefined,
      publicRound2: undefined,
      publicRound2End: undefined,
      publicRound1Allocation: undefined,
      publicRound2Allocation: undefined,
      claimStart: undefined,
      index: 0,
    },
    {
      vaultName: 'Initial Liquidity',
      vaultType: 'Initial Liquidity',
      vaultTokenAllocation: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 1,
      isDeployed: false,
      isSet: false,
      isDeployedErr: false,
      poolAddress: undefined,
      tokenPair: undefined,
    },
    {
      vaultName: 'TON Staker',
      vaultType: 'TON Staker',
      vaultTokenAllocation: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 2,
      isDeployed: false,
      isSet: false,
      isDeployedErr: false,
    },
    {
      vaultName: 'TOS Staker',
      vaultType: 'TOS Staker',
      vaultTokenAllocation: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 3,
      isDeployed: false,
      isSet: false,
      isDeployedErr: false,
    },
    {
      vaultName: 'WTON-TOS LP Reward',
      vaultType: 'WTON-TOS LP Reward',
      vaultTokenAllocation: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 4,
      isDeployed: false,
      isSet: false,
      isDeployedErr: false,
      poolAddress: TOS_WTON_POOL,
      tokenPair: 'WTON-TOS',
    },
    {
      vaultName: 'Liquidity Incentive',
      vaultType: 'Liquidity Incentive',
      vaultTokenAllocation: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 5,
      isDeployed: false,
      isSet: false,
      isDeployedErr: false,
      poolAddress: undefined,
      tokenPair: undefined,
    },
  ],
};

const initialVaultValue: VaultC = {
  adminAddress: '',
  isMandatory: false,
  claim: defaultParams,
  vaultName: '',
  vaultTokenAllocation: 0,
  vaultAddress: undefined,
  vaultType: 'C',
  index: 9999,
  isDeployed: false,
  isSet: false,
  isDeployedErr: false,
};

const useValues = (account?: string) => {
  const initialObject = account ? {...initialObj, owner: account} : initialObj;
  const [initialValues, setInitialValues] =
    useState<Projects['CreateProject']>(initialObject);

  return {initialValues, setInitialValues, defaultParams, initialVaultValue};
};

export default useValues;
