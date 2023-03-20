import {Box, Grid, Flex, Text } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import React from 'react';

type ScheduleProps = {
};

export const SimplifiedSchedule: React.FC<ScheduleProps> = (props) => {
    const steps = [
        { label: 'Snapshot', content },
        { label: 'Public Sale 1', content },
        { label: 'Public Sale 2', content },
      ];
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
        
    </Grid>
    </>
 )
};
