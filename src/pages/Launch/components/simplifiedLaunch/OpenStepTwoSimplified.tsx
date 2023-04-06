// Simplified Launch Token Economy component
import {Flex, useColorMode, useTheme, Image, Text} from '@chakra-ui/react';
import StepHeader from './StepHeader';
import StepComponent from './openStepTwo/StepComponent';
import GraphComponent from './openStepTwo/GraphComponent';
import validateSimplifiedFormikValues from '@Launch/utils/validateSimplified';
import { useFormikContext } from 'formik';
import {Projects, VaultPublic} from '@Launch/types';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import RescheduleModal from '../common/simplifiedUI/Reschedule';
import {useModal} from 'hooks/useModal';

const OpenStepTwoSimplified = (props: {  setDisableForStep2: Dispatch<SetStateAction<boolean>>;}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
  const {setDisableForStep2} = props;
  const {openAnyModal} = useModal();

 useEffect(() => {
    const {resultsStep2} = validateSimplifiedFormikValues(values)
    
    const validation = resultsStep2.length > 0 ? false : true
    
    setDisableForStep2(!validation);
    
  }, [values, setDisableForStep2]);

  useEffect(() => {
    if (!values.vaults || values.vaults.length === 0) {
      return;
    }
    const publicVault = values.vaults[0] as VaultPublic;
    if (!publicVault.snapshot) {
      return;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeftToDeploy = Math.floor(
      (publicVault.snapshot - currentTime) / 60,
    );
    if (timeLeftToDeploy < 60 ) {
      openAnyModal('Reschedule', {
        from: 'launch/createprojectsimple',
      })}

  }, [values.vaults, openAnyModal]);

  return (
    <Flex
      w="774px"
      // h="512px"
      border={'1px solid'}
      flexDir='column'
      borderColor={colorMode === 'dark' ? '#373737' : 'transparent'}
      bg={colorMode === 'light' ? 'white.100' : 'transparent'}
      boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
      borderRadius="10px">
        <StepHeader deploySteps={false} title={'Token Economy'}/>
        <Flex pl='35px' mb="40px">
        <StepComponent/>
         <GraphComponent/>
        </Flex>
        {/* <RescheduleModal /> */}
      </Flex>
  );
};

export default OpenStepTwoSimplified;
