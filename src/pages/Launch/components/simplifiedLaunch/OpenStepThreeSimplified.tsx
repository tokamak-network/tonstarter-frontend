// Simplified Launch Deploy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepThreeSteps from './openStepThree/StepThreeSteps';
import {useState,useEffect} from 'react';
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

import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectLaunch,setProjectStep,saveTempProjectData} from '@Launch/launch.reducer';

const VaultComp = (props: {vaultNum: Number}) => {
  const {vaultNum} = props;
  switch (vaultNum) {
    // case 0: 
    // return <Flex>Gas check</Flex>
    case 0:
      return <ProjectToken />;
    case 1:
      return <InitialLiquidity step='Deploy'/>;
    case 2:
      return <Vesting step='Deploy'/>;
    case 3: 
    return <Public step='Deploy'/>;
    case 4: 
    return <TonStaker step='Deploy'/>;
    case 5: 
    return <TosStaker step='Deploy'/>;
    case 6: 
    return  <WtonLP step='Deploy'/>;
    case 7: 
    return <TokenLP step='Deploy'/>;
    case 8: 
    return <Ecosystem step='Deploy'/>;
    case 9: 
    return <Team step='Deploy'/>;
    case 10: 
    return <Distribute/>;
    case 11:
      return <InitialLiquidity step='Initialize'/>;
    case 12:
      return <Vesting step='Initialize'/>;
    case 13: 
    return <Public step='Initialize'/>;
    case 14: 
    return <TonStaker step='Initialize'/>;
    case 15: 
    return <TosStaker step='Initialize'/>;
    case 16: 
    return  <WtonLP step='Initialize'/>;
    case 17: 
    return <TokenLP step='Initialize'/>;
    case 18: 
    return <Ecosystem step='Initialize'/>;
    case 19: 
    return <Team step='Initialize'/>;

    default:
    return <Flex>No vault</Flex>
  }
};

const OpenStepThreeSimplified = (props: any) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch: any = useAppDispatch();
 

  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

    const {openAnyModal} = useModal();
    useState(() => {
      openAnyModal('Launch_EstimateGas', {
        from: 'launch/createproject',
      })}
    )

    useEffect(() => {
      dispatch(setProjectStep({data: 3}));
    }, [dispatch]);
  
    
  useEffect(() => {
    console.log('data changes');
    
    dispatch(saveTempProjectData({data: values}));
  },[values])
  


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
      <StepHeader deploySteps={true} deployStep={currentStep+1} setCurrentStep={setCurrentStep} title={'Deploy'} />
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
