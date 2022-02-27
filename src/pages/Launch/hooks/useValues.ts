import {useState} from 'react';
import type {Projects} from '@Launch/types';
import moment from 'moment';

const defaultParams = [
  {claimRound: 1, claimTime: moment().unix(), claimTokenAllocation: 0},
];

const initialObj: Projects['CreateProject'] = {
  projectName: '',
  description: '',
  tokenName: '',
  tokenSymbol: '',
  totalSupply: '',
  ownerAddress: '',
  isTokenDeployed: false,
  isAllDeployed: false,
  vaults: [
    {
      vaultName: 'Public',
      vaultTokenAllocation: 0,
      firstClaimTime: new Date(),
      claimInterval: new Date(),
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
    },
    {
      vaultName: 'LP',
      vaultTokenAllocation: 0,
      firstClaimTime: new Date(),
      claimInterval: new Date(),
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
    },
    {
      vaultName: 'TON Staker',
      vaultTokenAllocation: 0,
      firstClaimTime: new Date(),
      claimInterval: new Date(),
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
    },
    {
      vaultName: 'TOS Staker',
      vaultTokenAllocation: 0,
      firstClaimTime: new Date(),
      claimInterval: new Date(),
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
    },
    {
      vaultName: 'WTON-TOS LP Reward',
      vaultTokenAllocation: 0,
      firstClaimTime: new Date(),
      claimInterval: new Date(),
      claimRound: 0,
      adminAddress: '',
      isMandatory: true,
      params: defaultParams,
    },
  ],
};

const initialVaultValue = {
  firstClaimTime: new Date(),
  claimInterval: new Date(),
  claimRound: 0,
  adminAddress: '',
  isMandatory: false,
  params: defaultParams,
};

const useValues = () => {
  const [initialValues, setInitialValues] =
    useState<Projects['CreateProject']>(initialObj);

  return {initialValues, setInitialValues, defaultParams, initialVaultValue};
};

export default useValues;
