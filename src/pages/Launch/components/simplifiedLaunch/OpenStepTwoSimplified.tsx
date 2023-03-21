// Simplified Launch Token Economy component
import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import StepHeader from './openStepTwo/StepHeader';
import StepComponent from './openStepTwo/StepComponent';
import GraphComponent from './openStepTwo/GraphComponent';

const OpenStepTwoSimplified = (props: any) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

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
        <StepHeader/>
        <Flex px='35px'>
        <StepComponent/>
         <GraphComponent/>
        </Flex>
       
      </Flex>
  );
};

export default OpenStepTwoSimplified;
