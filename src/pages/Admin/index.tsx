import {Flex, Box, useColorMode} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {StepsName, StepComponent} from '@Admin/types';
import {Step} from './components/Steps';
import {PageHeader} from 'components/PageHeader';
import {AdminDetail} from './components/AdminDetail';

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

export const Admin = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Flex mt={'72px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'Create Project'}
        subtitle={'You can create  and manage projects.'}
      />
      <Flex mt={'50px'} mb={'20px'}>
        <Steps
          stepName={['Project', 'Token', 'Sale', 'Layout']}
          currentStep={currentStep}></Steps>
      </Flex>
      <Flex>
        <AdminDetail
          stepName={['Project', 'Token', 'Sale', 'Layout']}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}></AdminDetail>
      </Flex>
    </Flex>
  );
};
