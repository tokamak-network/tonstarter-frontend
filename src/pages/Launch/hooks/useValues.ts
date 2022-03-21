import {useState} from 'react';
import type {Projects, VaultC} from '@Launch/types';
import moment from 'moment';

const nowTimeStamp = moment().unix();

const defaultParams = [
  {claimRound: 1, claimTime: nowTimeStamp, claimTokenAllocation: 0},
];

const initialObj: Projects['CreateProject'] = {
  projectName: '',
  description: '',
  tokenName: '',
  tokenSymbol: '',
  totalSupply: undefined,
  ownerAddress: '',
  owner: '',
  isTokenDeployed: false,
  isTokenDeployedErr: false,
  isAllDeployed: false,
  tokenAddress: '',
  projectTokenPrice: 0,
  totalTokenAllocation: 0,
  vaults: [
    {
      vaultName: 'Public',
      vaultType: 'Public',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      tokenAllocationForLiquidity: 0,
      hardCap: 0,
      addressForReceiving: '',
      stosTier: {
        oneTier: {
          requiredStos: 0,
          allocatedToken: 0,
        },
        twoTier: {
          requiredStos: 0,
          allocatedToken: 0,
        },
        threeTier: {
          requiredStos: 0,
          allocatedToken: 0,
        },
        fourTier: {
          requiredStos: 0,
          allocatedToken: 0,
        },
      },
      snapshot: 0,
      whitelist: 0,
      whitelistEnd: 0,
      publicRound1: 0,
      publicRound1End: 0,
      publicRound2: 0,
      publicRound2End: 0,
      publicRound1Allocation: 0,
      publicRound2Allocation: 0,
      claimStart: 0,
      index: 0,
    },
    {
      vaultName: 'LP',
      vaultType: 'LP',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 1,
    },
    {
      vaultName: 'TON Staker',
      vaultType: 'TON Staker',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 2,
    },
    {
      vaultName: 'TOS Staker',
      vaultType: 'TOS Staker',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 3,
    },
    {
      vaultName: 'WTON-TOS LP Reward',
      vaultType: 'WTON-TOS LP Reward',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      claim: defaultParams,
      vaultAddress: undefined,
      index: 4,
    },
  ],
};

const initialVaultValue: VaultC = {
  firstClaimTime: nowTimeStamp,
  claimInterval: nowTimeStamp,
  claimRound: 0,
  adminAddress: '',
  isMandatory: false,
  claim: defaultParams,
  vaultName: '',
  vaultTokenAllocation: 0,
  vaultAddress: undefined,
  vaultType: 'C',
  index: 5,
};

const useValues = () => {
  const [initialValues, setInitialValues] =
    useState<Projects['CreateProject']>(initialObj);

  return {initialValues, setInitialValues, defaultParams, initialVaultValue};
};

export default useValues;
