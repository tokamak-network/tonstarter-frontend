import {Box, Grid, Text} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import {ProgressIndicator} from './launchSchedule/progressIndicator';
import {StepNames} from './launchSchedule/stepNames';
import {LaunchDates} from './launchSchedule/launchDates';

type ScheduleProps = {
  currentStep: number;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {currentStep} = props;
  const [maxStep, setStepMax] = useState(0);

  const launchSteps = [
    'Snapshot',
    'Whitelist',
    'Public Sale 1',
    'Public Sale 2',
    'Unlock 1',
    'Unlock ..',
    'Unlock 7',
  ];
  

  useEffect(() => {
    if (currentStep > maxStep) {
      setStepMax(currentStep);
    }
  }, [currentStep, maxStep]);

  return (
    <Grid mb={'40px'} mt={'20px'}>
      <Box my={'20px'}>
        <Text fontSize={'15px'} fontWeight={600}>Schedule</Text>
      </Box>
      <StepNames />
      <ProgressIndicator
        launchSteps={launchSteps}
        currentStep={currentStep}
        maxStep={maxStep}></ProgressIndicator>
      <LaunchDates
        launchSteps={launchSteps}
      />
    </Grid>
  );
};
