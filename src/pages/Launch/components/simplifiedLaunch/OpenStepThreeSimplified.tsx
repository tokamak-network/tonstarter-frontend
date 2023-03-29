// Simplified Launch Deploy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepThreeSteps from './openStepThree/StepThreeSteps';
import {useState} from 'react';
import InitialLiquidity from './openStepThree/InitialLiquidity';
import Distribute from './openStepThree/Distribute';
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
import ConfirmTokenSimplifiedModal from '../modals/ConfirmTokenSimplified';
import {useModal} from 'hooks/useModal';
import EstimateGasModal from './openStepThree/EstimateGas';

const VaultComp = (props: {vaultNum: Number}) => {
  const {vaultNum} = props;
  switch (vaultNum) {
    // case 0: 
    // return <Flex>Gas check</Flex>
    case 0:
      return <ProjectToken />;
    case 1:
      return <InitialLiquidity />;
    case 2:
      return <Vesting/>;
    case 3: 
    return <Public/>;
    case 4: 
    return <TonStaker/>;
    case 5: 
    return <TosStaker/>;
    case 6: 
    return  <WtonLP/>;
    case 7: 
    return <TokenLP/>;
    case 8: 
    return <Ecosystem/>;
    case 9: 
    return <Team/>;
    case 10: 
    return <Distribute/>;

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

    const {openAnyModal} = useModal();
    useState(() => {
      openAnyModal('Launch_EstimateGas', {
        from: 'launch/createprojectsimple',
      })}
    )
    
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
    <ConfirmTokenSimplifiedModal/>
    <EstimateGasModal />
    </Flex>
  );
};

export default OpenStepThreeSimplified;
