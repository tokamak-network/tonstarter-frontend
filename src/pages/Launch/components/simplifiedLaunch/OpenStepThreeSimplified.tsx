// Simplified Launch Deploy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepThreeSteps from './openStepThree/StepThreeSteps';
import {useState} from 'react';
import InitialLiquidity from './openStepThree/InitialLiquidity';
import Initiate from './openStepThree/Initiate';
import ProjectToken from './openStepThree/ProjectToken';
import Vesting from './openStepThree/Vesting';
import Public from './openStepThree/Public';

const VaultComp = (props: {vaultNum: Number}) => {
  const {vaultNum} = props;
  switch (vaultNum) {
    case 0:
      return <ProjectToken />;
    case 1:
      return <InitialLiquidity />;
    case 2:
      return <Vesting />;
    case 3: 
    return <Public/>;
    case 4: 
    return <Initiate/>;
    default:
    return <Flex>No vault</Flex>
  }
};

const OpenStepThreeSimplified = (props: any) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Flex
      w="774px"
      h="100%"
      pb={'51px'}
      border={'1px solid'}
      flexDir="column"
      borderColor={colorMode === 'dark' ? '#373737' : 'transparent'}
      bg={colorMode === 'light' ? 'white.100' : 'transparent'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      borderRadius="10px"
      alignItems={'center'}>
      <StepHeader deploySteps={true} deployStep={1} title={'Deploy'} />
      <StepThreeSteps
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    <VaultComp vaultNum={currentStep}/>
    </Flex>
  );
};

export default OpenStepThreeSimplified;
