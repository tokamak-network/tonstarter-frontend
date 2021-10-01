import {Flex} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {AdminObject, StepsName} from '@Admin/types';
import {Step} from './components/Steps';
import {createStarter} from './utils/createStarter';

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
  snapshotTimestamp: 0,
  exclusiveStartTime: 0,
  addWhitelistEndTime: 0,
  participationEndTime: 0,
  subscriptionStartTime: 0,
  saleStartTime: 0,
  saleEndTime: 0,
  claimStartTime: 0,
  //sec
  claimIntervals: 0,
  claimCount: 0,
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
  stepFour: ['position', 'production', 'topSlideExposure'],
};

export const Admin = () => {
  const [data, setData] = useState<AdminObject>(initialValue);
  const [currentStep, setCurrentStep] = useState(0);

  const makeRequest = (formData: AdminObject) => {
    console.log('Form Submitted', formData);
    return createStarter(formData);
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
