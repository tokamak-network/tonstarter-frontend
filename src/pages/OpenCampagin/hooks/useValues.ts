import {useState} from 'react';
import type {Projects} from '@OpenCampagin/types';

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
    },
  ],
};

const useValues = () => {
  const [initialValues, setInitialValues] =
    useState<Projects['CreateProject']>(initialObj);

  return {initialValues, setInitialValues};
};

export default useValues;
