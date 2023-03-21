import {Box, Grid, Flex, Text, useColorMode} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import { repeat } from 'lodash';

type ScheduleProps = {
    stepNames: string[];
    currentStep: number;
};
  

export const SimplifiedSchedule: React.FC<ScheduleProps> = (props) => {
    const {stepNames, currentStep} = props;
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
      <Grid templateColumns='repeat(6, 1fr)' gap={8}>
      {stepNames.map((step: string, index: number) => {
          const indexNum = index + 1;
          const isStep = currentStep === indexNum;
          const pastStep = currentStep > indexNum || maxStep > indexNum;
          return (
            <Grid mb={2} fontSize='xs'>
                {(step === 'Snapshot' || step === 'Public Sale 1' || step === 'Public Sale 2') 
                ? <Flex as='b'><Text mr={'5px'} color={'#FF3B3B'}>*</Text>{step}</Flex>
                : <Flex><Text as='b'>{step}</Text></Flex>
                }
          </Grid>
        );
      })}
    </Grid>
    <Flex ml={'25px'}>
      {stepNames.map((step: string, index: number) => {
          const indexNum = index + 1;
          const isStep = currentStep === indexNum;
          const pastStep = currentStep > indexNum || maxStep > indexNum;
          return (
            <Flex alignItems="center">
            {/* Dot */}
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
            {/* Line */}
            {index < stepNames.length - 1 &&
            <Box
                w={'120px'}
                h={'2px'} 
                bg={isStep ? '#2ea1f8' : 'transparent'}
                border={
                    isStep
                      ? ''
                      : colorMode === 'light'
                      ? 'solid 1px #e6eaee'
                      : 'solid 1px #373737'
                  }>
            </Box>
            }
          </Flex>
        );
      })}
    </Flex>
    </Grid>
    </>
 )
};


