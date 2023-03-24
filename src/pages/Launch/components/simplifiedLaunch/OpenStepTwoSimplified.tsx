// Simplified Launch Token Economy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepComponent from './openStepTwo/StepComponent';
import GraphComponent from './openStepTwo/GraphComponent';
import validateSimplifiedFormikValues from '@Launch/utils/validateSimplifiedStep2';
import { useFormikContext } from 'formik';
import {Projects} from '@Launch/types';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';

const OpenStepTwoSimplified = (props: {  setDisableForStep2: Dispatch<SetStateAction<boolean>>;}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
  const {setDisableForStep2} = props;

 useEffect(() => {
    const validation = validateSimplifiedFormikValues(values)
    setDisableForStep2(!validation);
    
  }, [values, setDisableForStep2]);
  return (
    <Flex
      w="774px"
      h="512px"
      border={'1px solid'}
      flexDir='column'
      borderColor={colorMode === 'dark' ? '#373737' : 'transparent'}
      bg={colorMode === 'light' ? 'white.100' : 'transparent'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      borderRadius="10px">
        <StepHeader deploySteps={false} title={'Token Economy'}/>
        <Flex px='35px'>
        <StepComponent/>
         <GraphComponent/>
        </Flex>
       
      </Flex>
  );
};

export default OpenStepTwoSimplified;
