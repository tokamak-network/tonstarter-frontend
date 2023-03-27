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
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import Team from './openStepThree/Team';
import Ecosystem from './openStepThree/Ecosystem';
import TokenLP from './openStepThree/TokenLp';
import TonStaker from './openStepThree/TonStaker';
import TosStaker from './openStepThree/TosStaker';
import WtonLP from './openStepThree/WtonLP';

const VaultComp = (props: {vaultNum: Number}) => {
  const {vaultNum} = props;
  switch (vaultNum) {
    case 0: 
    return <Flex>Gas check</Flex>
    case 1:
      return <ProjectToken />;
    case 2:
      return <InitialLiquidity />;
    case 3:
      return <Vesting/>;
    case 4: 
    return <Public/>;
    case 5: 
    return <Team/>;
    case 6: 
    return <Ecosystem/>;
    case 7: 
    return <TokenLP/>;
    case 8: 
    return <TonStaker/>;
    case 9: 
    return <TosStaker/>;
    case 10: 
    return <WtonLP/>;
    case 11: 
    return <Initiate/>;

    default:
    return <Flex>No vault</Flex>
  }
};

const OpenStepThreeSimplified = (props: any) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
    
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
