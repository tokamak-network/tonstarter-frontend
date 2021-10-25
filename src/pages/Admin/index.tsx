import {Flex, Box, useColorMode} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {AdminObject, StepsName, StepComponent} from '@Admin/types';
import {Step} from './components/Steps';
import {createStarter} from './utils/createStarter';
import {PageHeader} from 'components/PageHeader';

const Steps: React.FC<StepComponent> = (props) => {
  const {stepName, currentStep} = props;
  const {colorMode} = useColorMode();

  return (
    <Flex>
      {stepName.map((step: string, index: number) => {
        const isStep = currentStep === index;
        return (
          <Box d="flex" mr={'20px'} alignItems="center" fontSize={14}>
            <Flex
              borderRadius={18}
              bg={isStep ? '#2ea1f8' : 'transparent'}
              w={'28px'}
              h={'28px'}
              alignItems="center"
              justifyContent="center"
              color={isStep ? 'white.100' : 'gray.575'}
              mr={'12px'}
              border={isStep ? '' : 'solid 1px #e6eaee'}>
              <Box>{index + 1}</Box>
            </Flex>
            <Box>{step}</Box>
          </Box>
        );
      })}
    </Flex>
  );
};

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
  tokenAllocationAmount: '',
  tokenFundRaisingTargetAmount: '',
  tokenFundingRecipient: '',
  //step 3
  saleContractAddress: '',
  vestingContractAddress: '',
  projectTokenRatio: 0,
  projectFundingTokenRatio: 0,
  snapshot: 0,
  startAddWhiteTime: 0,
  endAddWhiteTime: 0,
  startExclusiveTime: 0,
  endExclusiveTime: 0,
  startDepositTime: 0,
  endDepositTime: 0,
  startOpenSaleTime: 0,
  endOpenSaleTime: 0,
  startClaimTime: 0,
  claimInterval: 0,
  claimPeriod: 0,
  //step 4
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
    'tokenAllocationAmount',
    'tokenFundRaisingTargetAmount',
    'tokenFundingRecipient',
    'projectTokenRatio',
    'projectFundingTokenRatio',
  ],
  stepThree: [
    'saleContractAddress',
    'vestingContractAddress',
    'snapshot',
    'startAddWhiteTime',
    'endAddWhiteTime',
    'startExclusiveTime',
    'endExclusiveTime',
    'startDepositTime',
    'endDepositTime',
    'startOpenSaleTime',
    'endOpenSaleTime',
    'startClaimTime',
    'claimInterval',
    'claimPeriod',
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

  return (
    <Flex mt={'72px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'Create Project'}
        subtitle={'You can create  and manage projects.'}
      />
      <Flex mt={'50px'}>
        <Steps
          stepName={['Project', 'Token', 'Sale']}
          currentStep={currentStep}></Steps>
      </Flex>
    </Flex>
  );
};
