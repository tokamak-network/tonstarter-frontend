import {Flex} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {AdminObject, StepsName} from '@Admin/types';
import {Step} from './components/Steps';

const initialValue: AdminObject = {
  name: '',
  description: '',
  adminAddress: '',
  website: '',
  telegram: '',
  medium: '',
  twitter: '',
  discord: '',
  image: '',
  tokenName: '',
  tokenAddress: '',
  tokenSymbol: '',
  tokenSymbolImage: '',
  tokenAllowcationAmount: '',
  tokenFundRaisingTargetAmount: '',
  tokenFundingRecipient: '',
  projectTokenRatio: 0,
  projectFundingTokenRatio: 0,
  saleContractAddress: '',
  vestingContractAddress: '',
  snapshotTimestamp: '',
  exclusiveStartTime: '',
  addWhitelistEndTime: '',
  participationEndTime: '',
  subscriptionStartTime: '',
  saleStartTime: '',
  saleEndTime: '',
  claimStartTime: '',
  //sec
  claimIntervals: 0,
  claimCount: '',
  position: '',
  production: '',
  topSlideExposure: false,
};

const stepsName: StepsName = {
  stepOne: [
    'name',
    'description',
    'adminAddress',
    'website',
    'telegram',
    'medium',
    'twitter',
  ],
  stepTwo: [
    'tokenName',
    'tokenAddress',
    'tokenSymbol',
    'tokenSymbolImage',
    'tokenAllowcationAmount',
    'tokenFundRaisingTargetAmount',
    'tokenFundingRecipient',
    'projectTokenRatio',
    'projectFundingTokenRatio',
  ],
  stepThree: [
    'saleContractAddress',
    'vestingContractAddress',
    'snapshotTimestamp',
    'exclusiveStartTime',
    'addWhitelistEndTime',
    'participationEndTime',
    'subscriptionStartTime',
    'saleStartTime',
    'saleEndTime',
    'claimStartTime',
    'claimIntervals',
  ],
  stepFour: ['claimCount', 'position', 'production', 'topSlideExposure'],
};

export const Admin = () => {
  const [data, setData] = useState<AdminObject>(initialValue);
  const [currentStep, setCurrentStep] = useState(0);

  const makeRequest = (formData: AdminObject) => {
    console.log('Form Submitted', formData);
  };

  const handleNextStep = (newData: any, final = false) => {
    setData((prev) => ({...prev, ...newData}));

    if (final) {
      makeRequest(newData);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const makeSteps = () => {
    let result = [];
    for (const property in stepsName) {
      result.push(
        <Step
          data={data}
          //@ts-ignore
          names={stepsName[String(property)]}
          next={handleNextStep}
          lastStep={
            currentStep === Object.keys(stepsName).length - 1 ? true : false
          }></Step>,
      );
    }
    return result;
  };

  const steps = makeSteps();

  return <Flex mt={'72px'}>{steps[currentStep]}</Flex>;
};
