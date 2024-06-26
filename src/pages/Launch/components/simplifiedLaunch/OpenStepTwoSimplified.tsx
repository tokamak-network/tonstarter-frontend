// Simplified Launch Token Economy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepComponent from './openStepTwo/StepComponent';
import GraphComponent from './openStepTwo/GraphComponent';
import validateSimplifiedFormikValues from '@Launch/utils/validateSimplified';
import { useFormikContext } from 'formik';
import {Projects} from '@Launch/types';
import {Dispatch, SetStateAction, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {setProjectStep,saveTempProjectData} from '@Launch/launch.reducer';

const OpenStepTwoSimplified = (props: {  setDisableForStep2: Dispatch<SetStateAction<boolean>>;}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
  const {setDisableForStep2} = props;
  const dispatch: any = useAppDispatch();

 useEffect(() => {
    const {resultsStep2} = validateSimplifiedFormikValues(values)
    
    const validation = resultsStep2.length > 0 ? false : true
    
    setDisableForStep2(!validation);
    
  }, [values, setDisableForStep2]);

  useEffect(() => {
    dispatch(setProjectStep({data: 2}));
  }, [dispatch]);


  useEffect(() => {
    
    dispatch(saveTempProjectData({data: values}));
    setFieldValue('isSimplified',true )

  },[dispatch, setFieldValue, values])

  return (
    <Flex
      w="774px"
      border={'1px solid'}
      flexDir='column'
      borderColor={colorMode === 'dark' ? '#373737' : 'transparent'}
      bg={colorMode === 'light' ? 'white.100' : 'transparent'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      borderRadius="10px">
        <StepHeader deploySteps={false} title={'Token Economy'}/>
        <Flex pl='35px' mb="40px">
        <StepComponent/>
         <GraphComponent />
        </Flex>
      </Flex>
  );
};

export default OpenStepTwoSimplified;
