import {Box, Grid, Flex, Text, useColorMode, GridItem} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import SingleCalendarPop from '../SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {convertTimeStamp} from 'utils/convertTIme';
import DoubleCalendarPop from '../../common/DoubleCalendarPop';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {VaultPublic} from '@Launch/types';

type ScheduleProps = {
  currentStep: number;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;
  const {currentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const [snapshotDate, setSnapshotDate] = useState<number | undefined>(
    publicVault.snapshot || 0,
  );
  const [publicSale1, setPublicSale1] = useState<number | undefined>(
    publicVault.publicRound1 || 0,
  );
  const [publicSale1End, setPublicSale1End] = useState<number | undefined>(
    publicVault.publicRound1End || 0,
  );
  const [publicSale2, setPublicSale2] = useState<number | undefined>(
    publicVault.publicRound2 || 0,
  );
  const [publicSale2End, setPublicSale2End] = useState<number | undefined>(
    publicVault.publicRound2End || 0,
  );
  const [unlockDate0, setUnlockDate0] = useState<number | undefined>(0);
  // STC : Start Time Cap
  const [whitelistSTC, setWhitelistSTC] = useState<number>(0);
  const [publicSale1STC, setPublicSale1STC] = useState<number>(0);
  const [publicSale2STC, setPublicSale2STC] = useState<number>(0);
  const [lastUnlockDate, setLastUnlockDate] = useState<number>(0);
  const launchSteps = [
    'Snapshot',
    'Whitelist',
    'Public Sale 1',
    'Public Sale 2',
    'Unlock 0',
    'Unlock 48',
  ];
  const stepName = '';

  const getTimeStamp = () => {
    switch (
      stepName as
        | 'Snapshot'
        | 'Whitelist'
        | 'Public Sale 1'
        | 'Public Sale 2'
        | 'Unlock 0'
    ) {
      case 'Snapshot': {
        return publicVault.snapshot;
      }
      case 'Whitelist': {
        return [publicVault.whitelist, publicVault.whitelistEnd];
      }
      case 'Public Sale 1': {
        return [publicVault.publicRound1, publicVault.publicRound1End];
      }
      case 'Public Sale 2': {
        return [publicVault.publicRound2, publicVault.publicRound2End];
      }
      case 'Unlock 0': {
        //@ts-ignore
        return vaults[1].startTime;
      }
      default:
        return 0;
    }
  };

  const [whitelistDateRange, setWhitelistDateRange] = useState<
    (number | undefined)[]
  >(getTimeStamp() as (number | undefined)[]);
  const [publicSale1DateRange, setPublicSale1DateRange] = useState<
    (number | undefined)[]
  >(getTimeStamp() as (number | undefined)[]);
  const [publicSale2DateRange, setPublicSale2DateRange] = useState<
    (number | undefined)[]
  >(getTimeStamp() as (number | undefined)[]);

  useEffect(() => {
    if (currentStep > maxStep) {
      setStepMax(currentStep);
    }
  }, [currentStep, maxStep]);

  useEffect(() => {
    setFieldValue('vaults[0].snapshot', snapshotDate);
    // Second after snapshot
    setFieldValue('vaults[0].whitelist', snapshotDate && snapshotDate + 1);
    // whitelist start to end - 2 days duration
    setFieldValue(
      'vaults[0].whitelistEnd',
      snapshotDate && snapshotDate + 1 + 86400 * 2,
    );
    setFieldValue('vaults[0].publicRound1', publicSale1);
    setFieldValue('vaults[0].publicRound1End', publicSale1End);
    setFieldValue('vaults[0].publicRound2', publicSale2);
    setFieldValue('vaults[0].publicRound2End', publicSale2End);
  }, [
    snapshotDate,
    setFieldValue,
    publicSale1,
    publicSale1End,
    publicSale2,
    publicSale2End,
    publicSale2DateRange,
    whitelistDateRange,
    publicSale1DateRange,
  ]);

  // Update the start time caps for calendar inputs according to any date range changes
  useEffect(() => {
    if (snapshotDate) {
      setWhitelistSTC(snapshotDate + 1);
    }
  }, [snapshotDate]);

  useEffect(() => {
    if (publicVault.whitelistEnd) {
      setPublicSale1STC(publicVault.whitelistEnd + 1);
    }
  }, [publicVault.whitelistEnd]);

  useEffect(() => {
    if (publicVault.publicRound1End) {
      setPublicSale2STC(publicVault.publicRound1End + 1);
    }
  }, [publicVault.publicRound1End]);

  useEffect(() => {
    if (publicVault.publicRound2End) {
      setUnlockDate0(publicVault.publicRound2End + 1);
    }
  }, [publicVault.publicRound2End]);

  // Calculate last unlock time
  useEffect(() => {
    if (unlockDate0) {
      const secondsInADay = 86400;
      //  days till Last Vesting Round = 1440;
      const seconds = 1440 * secondsInADay;
      const lastUnlock = unlockDate0 + seconds;
      setLastUnlockDate(lastUnlock);
    }
  }, [unlockDate0, lastUnlockDate]);

  useEffect(() => {
    if (publicSale2DateRange) {
      setPublicSale2(publicSale2DateRange[0]);
      setPublicSale2End(publicSale2DateRange[1]);
    }
    if (publicSale1DateRange) {
      setPublicSale1(publicSale1DateRange[0]);
      setPublicSale1End(publicSale1DateRange[1]);
    }
  }, [publicSale2DateRange, publicSale2, publicSale1DateRange, publicSale1]);

  return (
    <Grid my={'40px'}>
      <Box my={'20px'}>
        <Text fontSize="md">Schedule</Text>
      </Box>
      <Flex>
        <Grid
          mb={2}
          fontSize="xs"
          templateColumns="repeat(8, 1fr)"
          textAlign={'center'}
          as="b">
          <GridItem w={'62px'} mr={'59px'}>
            <Flex as="b">
              <Text mr={'5px'} color={'#FF3B3B'}>
                *
              </Text>
              Snapshot
            </Flex>
          </GridItem>
          <GridItem w={'100px'} mr={'28px'}>
            <Flex>
              <Text mr={'5px'} color={'#FF3B3B'}>
                *
              </Text>
              Whitelist
            </Flex>
          </GridItem>
          <GridItem w={'100px'} mr={'28px'}>
            <Flex>
              <Text mr={'5px'} color={'#FF3B3B'}>
                *
              </Text>
              Public Sale 1
            </Flex>
          </GridItem>
          <GridItem w={'100px'} mr={'40px'}>
            <Flex>
              <Text mr={'5px'} color={'#FF3B3B'}>
                *
              </Text>
              Public Sale 2
            </Flex>
          </GridItem>
          <GridItem w={'62px'} mr={'59px'}>
            <Text>Unlock 0</Text>
          </GridItem>
          {/* TODO: Detailed 49-month unlock schedule */}
          {/* <GridItem w={'62px'} mr={'62px'}>
                <Text>...</Text>
              </GridItem> */}
          <GridItem w={'62px'} mr={'66px'}>
            <Text>Unlock 48</Text>
          </GridItem>
        </Grid>
      </Flex>
      <Flex ml={'28px'}>
        {launchSteps.map((step: string, index: number) => {
          const indexNum = index + 1;
          const isStep = currentStep === indexNum;
          const pastStep = currentStep > indexNum || maxStep > indexNum;
          return (
            <Flex alignItems="center" textAlign={'center'}>
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
                }></Box>
              {/* Line */}
              {index < launchSteps.length - 1 && (
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
                  }></Box>
              )}
            </Flex>
          );
        })}
      </Flex>
      <Grid
        templateColumns="repeat(6, 1fr)"
        textAlign="center"
        style={{top: 0}}>
        {launchSteps.map((step: string, index: number) => {
          return (
            <Grid textAlign="center" mt={2} fontSize={'11px'}>
              {/* snapshot date & time */}
              {step === 'Snapshot' && (
                <GridItem w={'62px'} mr={'50px'}>
                  {/* TODO: Update design */}
                  {!snapshotDate ? (
                    <Text color="red.400">{'Choose Date & Time'}</Text>
                  ) : (
                    <Text>
                      {convertTimeStamp(snapshotDate, 'YYYY.MM.DD HH:mm:ss')}
                    </Text>
                  )}
                </GridItem>
              )}
              {/* whitelist date & time */}
              {step === 'Whitelist' && (
                <GridItem w={'106px'} mr={'28px'} textAlign={'center'}>
                  {!snapshotDate ? (
                    <Text color="red.400" ml={'20px'} w={'67px'}>
                      {'Set Snapshot Time'}
                    </Text>
                  ) : (
                    <Text>{`${convertTimeStamp(
                      Number(snapshotDate + 1),
                      'YYYY.MM.DD HH:mm:ss',
                    )} ~${convertTimeStamp(
                      Number(snapshotDate + 1 + 300),
                      'MM.DD HH:mm:ss',
                    )}`}</Text>
                  )}
                </GridItem>
              )}
              {/* Public sale 1 date & time */}
              {step === 'Public Sale 1' && (
                <GridItem w={'106px'} mr={'28px'}>
                  {!publicSale1 || !publicSale1End ? (
                    <Text color="red.400" ml={'20px'} w={'62px'}>
                      {'Choose Date & Time'}
                    </Text>
                  ) : (
                    <Text>{`${convertTimeStamp(
                      Number(publicSale1),
                      'YYYY.MM.DD HH:mm:ss',
                    )} ~${convertTimeStamp(
                      Number(publicSale1End),
                      'MM.DD HH:mm:ss',
                    )}`}</Text>
                  )}
                </GridItem>
              )}
              {/* Public sale 2 date & time */}
              {step === 'Public Sale 2' && (
                <GridItem w={'106px'} mr={'40px'}>
                  {!publicSale2 || !publicSale2End ? (
                    <Text color="red.400" ml={'20px'} w={'62px'}>
                      {'Choose Date & Time'}
                    </Text>
                  ) : (
                    <Text>{`${convertTimeStamp(
                      Number(publicSale2),
                      'YYYY.MM.DD HH:mm:ss',
                    )} ~${convertTimeStamp(
                      Number(publicSale2End),
                      'MM.DD HH:mm:ss',
                    )}`}</Text>
                  )}
                </GridItem>
              )}
              {/* Vesting Round 0 ?? */}
              {step === 'Unlock 0' && (
                <GridItem w={'62px'} mr={'60px'}>
                  <Text mr={'5px'}>
                    {unlockDate0
                      ? convertTimeStamp(unlockDate0, 'YYYY.MM.DD HH:mm:ss')
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* TODO: Add a notice about vesting rounds */}
              {/* TODO: Calculate the last vesting round period 1440 days */}
              {step === 'Unlock 48' && (
                <GridItem w={'62px'} mr={'66px'}>
                  <Text mr={'5px'}>
                    {lastUnlockDate
                      ? convertTimeStamp(lastUnlockDate, 'YYYY.MM.DD HH:mm:ss')
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
            </Grid>
          );
        })}
      </Grid>
      <Grid templateColumns="repeat(6, 1fr)" columnGap={'50px'} fontSize="xs">
        {launchSteps.map((step: string, index: number) => {
          return (
            <Grid alignItems="center" ml={4} mt={'9px'}>
              {/* snapshot date & time input */}
              {step === 'Snapshot' && (
                <Flex alignItems="center" ml={'5px'}>
                  <SingleCalendarPop
                    setDate={setSnapshotDate}
                    startTimeCap={snapshotGap}
                  />
                </Flex>
              )}
              {/* Public sale 1 date & time input*/}
              {step === 'Public Sale 1' && (
                <Flex alignItems="center" ml={'-3px'}>
                  <DoubleCalendarPop
                    setDate={setPublicSale1DateRange}
                    // whitelist end + 1
                    startTimeCap={publicSale1STC}
                  />
                </Flex>
              )}
              {/* Public sale 2 date & time input*/}
              {step === 'Public Sale 2' && (
                <Flex alignItems="center" ml={'-8px'}>
                  <DoubleCalendarPop
                    setDate={setPublicSale2DateRange}
                    // public sale end + 1
                    startTimeCap={publicSale2STC}
                  />
                </Flex>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
