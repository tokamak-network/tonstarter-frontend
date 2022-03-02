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
  totalSupply: '',
  ownerAddress: '',
  owner: '',
  isTokenDeployed: true,
  isAllDeployed: false,
  tokenAddress: '',
  vaults: [
    {
      vaultName: 'Public',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
      vaultAddress: undefined,
    },
    {
      vaultName: 'LP',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
      vaultAddress: undefined,
    },
    {
      vaultName: 'TON Staker',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
      vaultAddress: undefined,
    },
    {
      vaultName: 'TOS Staker',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
      vaultAddress: undefined,
    },
    {
      vaultName: 'WTON-TOS LP Reward',
      vaultTokenAllocation: 0,
      firstClaimTime: nowTimeStamp,
      claimInterval: nowTimeStamp,
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
      vaultAddress: undefined,
    },
  ],
};

const initialVaultValue: VaultC = {
  firstClaimTime: nowTimeStamp,
  claimInterval: nowTimeStamp,
  claimRound: 0,
  adminAddress: '',
  isMandatory: false,
  params: defaultParams,
  vaultName: '',
  vaultTokenAllocation: 0,
  vaultAddress: undefined,
};

const useValues = () => {
  const [initialValues, setInitialValues] =
    useState<Projects['CreateProject']>(initialObj);

  return {initialValues, setInitialValues, defaultParams, initialVaultValue};
};

export default useValues;
