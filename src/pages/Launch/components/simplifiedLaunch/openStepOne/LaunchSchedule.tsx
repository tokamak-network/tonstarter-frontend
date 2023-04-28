import {Box, Grid, Text} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import {ProgressIndicator} from './launchSchedule/progressIndicator';
import {StepNames} from './launchSchedule/stepNames';
import {LaunchDates} from './launchSchedule/launchDates';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {VaultPublic} from '@Launch/types';

type ScheduleProps = {
  currentStep: number;
  isListed: boolean;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {currentStep, isListed} = props;
  const [maxStep, setStepMax] = useState(0);

  const {values} = useFormikContext<Projects['CreateSimplifiedProject']>();

  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;

  const getVaultStatus = (publicVault: VaultPublic) => {
  const now = Date.now();
  const ONE_DAY_IN_SEC = 86400; // number of seconds in a day

  const isSnapshotPassed = publicVault.snapshot && now >= publicVault.snapshot;
  const isWhitelistPassed = publicVault.whitelistEnd && now >= publicVault.whitelistEnd;
  const isPublicSale1Passed = publicVault.publicRound1End && now >= publicVault.publicRound1End;
  const isPublicSale2Passed = publicVault.publicRound2End && now >= publicVault.publicRound2End;

  const firstVestingDay = publicVault.publicRound2End ? publicVault.publicRound2End + 1 : 0;
  const isVesting1Passed = firstVestingDay && now >= firstVestingDay;
  const isVesting2Passed = firstVestingDay && now < firstVestingDay + (360 * ONE_DAY_IN_SEC);
  const isVesting3Passed = firstVestingDay && now < firstVestingDay + (720 * ONE_DAY_IN_SEC);
  const isVesting4Passed = firstVestingDay && now < firstVestingDay + (1080 * ONE_DAY_IN_SEC);

  return {
    isSnapshotPassed,
    isWhitelistPassed,
    isPublicSale1Passed,
    isPublicSale2Passed,
    isVesting1Passed,
    isVesting2Passed,
    isVesting3Passed,
    isVesting4Passed,
  };
  }

const vaultStatus = getVaultStatus(publicVault);
// console.log('snapshotpassed', vaultStatus.isSnapshotPassed);
// console.log('vesting1Passed', vaultStatus.isVesting1Passed);

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
        <Text fontSize={'15px'} fontWeight={600}>
          Schedule
        </Text>
      </Box>
      <StepNames />
      <ProgressIndicator
        launchSteps={launchSteps}
        currentStep={currentStep}
        maxStep={maxStep}
        isListed={isListed}
        isSnapshotPassed={vaultStatus.isSnapshotPassed}
        isWhitelistPassed={vaultStatus.isWhitelistPassed}
        isPublicSale1Passed={vaultStatus.isPublicSale1Passed}
        isPublicSale2Passed={vaultStatus.isPublicSale2Passed}
        isVesting1Passed={vaultStatus.isVesting1Passed}
        isVesting2Passed={vaultStatus.isVesting2Passed}
        isVesting3Passed={vaultStatus.isVesting3Passed}
        isVesting4Passed={vaultStatus.isVesting4Passed}
        
      />
      <LaunchDates launchSteps={launchSteps} />
    </Grid>
  );
};
