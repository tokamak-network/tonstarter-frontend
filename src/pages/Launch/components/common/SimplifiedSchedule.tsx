import {Box, Grid, Flex, Text, useColorMode} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';

type ScheduleProps = {
    stepName: string[];
    currentStep: number;
};
  

export const SimplifiedSchedule: React.FC<ScheduleProps> = (props) => {
    const {stepName, currentStep} = props;
    const [maxStep, setStepMax] = useState(0);
    const {colorMode} = useColorMode();

    useEffect(() => {
        if (currentStep > maxStep) {
          setStepMax(currentStep);
        }
      }, [currentStep, maxStep]);

      
 return (
    <>
    <Grid my={2}>
        <Box my={2}>
            <Text fontSize='md'>Schedule</Text>
        </Box>
        <Grid templateColumns='repeat(6, 1fr)' gap={7}>
            <Flex fontSize={13}><Text mr={'5px'} color={'#FF3B3B'}>*</Text>Snapshot</Flex>
            <Flex fontSize={13}><Text mr={'5px'} color={'#FF3B3B'}>*</Text>Public Sale 1</Flex>
            <Flex fontSize={13}><Text mr={'5px'} color={'#FF3B3B'}>*</Text>Public Sale 2</Flex>
            <Text fontSize={13}>Unlock 1</Text>
            <Text fontSize={13}>...</Text>
            <Text fontSize={13}>Unlock 3</Text>
        </Grid>
        <Flex>
      {stepName.map((step: string, index: number) => {
        const indexNum = index + 1;
        const isStep = currentStep === indexNum;
        const pastStep = currentStep > indexNum || maxStep > indexNum;

        return (
          <Flex  mr={'20px'} alignItems="center" fontSize={14}>
            <Box
              borderRadius={18}
              bg={isStep ? '#2ea1f8' : 'transparent'}
              w={'8px'}
              h={'8px'}
              alignItems="center"
              justifyContent="center"
              border={
                isStep
                  ? ''
                  : colorMode === 'light'
                  ? 'solid 1px #e6eaee'
                  : 'solid 1px #373737'
              }>
            </Box>
            <Box w={'120px'}
              h={'2px'} bg={isStep? '#2ea1f8' : 'transparent'}></Box>
          </Flex>
        );
      })}
    </Flex>
    </Grid>
    </>
 )
};


