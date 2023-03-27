import {Box, Grid, Flex, Text, useColorMode, GridItem} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import SingleCalendarPop from '../SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {convertTimeStamp} from 'utils/convertTIme';
import DoubleCalendarPop from '../../common/DoubleCalendarPop';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';

type ScheduleProps = {
  currentStep: number;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const {
    snapshotTime,
    whitelistStart,
    whitelistEnd,
    publicSale1Start,
    publicSale1End,
    publicSale2Start,
    publicSale2End,
  } = values;
  const {currentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const [snapshotDate, setSnapshotDate] = useState<number | undefined>(
    snapshotTime || 0,
  );
  const [unlockDate1, setUnlockDate1] = useState<number | undefined>(0);
  const [unlockDate3, setUnlockDate3] = useState<number | undefined>(0);
  const [whitelistSTC, setWhitelistSTC] = useState<number>(0);
  const [publicSale1STC, setPublicSale1STC] = useState<number>(0);
  const [publicSale2STC, setPublicSale2STC] = useState<number>(0);
  const launchSteps = [
    'Snapshot',
    'Whitelist',
    'Public Sale 1',
    'Public Sale 2',
    'Unlock 1',
    'Unlock 3',
  ];
  const stepName = '';
  console.log('useFormikValues', values);
  const getTimeStamp = () => {
    switch (
      stepName as
        | 'Snapshot'
        | 'Whitelist'
        | 'Public Sale 1'
        | 'Public Sale 2'
        | 'Unlock 1'
    ) {
      case 'Snapshot': {
        return snapshotTime;
      }
      case 'Whitelist': {
        return [whitelistStart, whitelistEnd];
      }
      case 'Public Sale 1': {
        return [publicSale1Start, publicSale1End];
      }
      case 'Public Sale 2': {
        return [publicSale2Start, publicSale2End];
      }
      case 'Unlock 1': {
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
    setFieldValue('snapshotTime', snapshotDate);
    // Second after snapshot
    setFieldValue('whitelistStart', snapshotDate && snapshotDate + 1);
    // 5 min duration
    setFieldValue('whitelistEnd', snapshotDate && (snapshotDate + 1) + 300);
    setFieldValue('publicSale1Start', publicSale1DateRange[0]);
    setFieldValue('publicSale1End', publicSale1DateRange[1]);
    setFieldValue('publicSale2Start', publicSale2DateRange[0]);
    setFieldValue('publicSale2End', publicSale2DateRange[1]);
  }, [
    snapshotDate,
    setFieldValue,
    publicSale1DateRange,
    publicSale2DateRange,
    whitelistDateRange,
  ]);

  useEffect(() => {
    if (snapshotDate) {
      setWhitelistSTC(snapshotDate + 1);
    }
  }, [snapshotDate]);
  
  useEffect(() => {
    if (whitelistEnd) {
      setPublicSale1STC(whitelistEnd + 1);
    }
  }, [whitelistEnd]);
  
  useEffect(() => {
    if (publicSale1End) {
      setPublicSale2STC(publicSale1End + 1);
    }
  }, [publicSale1End]);

  useEffect(() => {
    if(publicSale2End) {
      setUnlockDate1(publicSale2End + 1)
    }
  }, [publicSale2End])

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
            <Text>Unlock 1</Text>
          </GridItem>
          {/* TODO: Detailed 49-month unlock schedule */}
          {/* <GridItem w={'62px'} mr={'62px'}>
                <Text>...</Text>
              </GridItem> */}
          <GridItem w={'62px'} mr={'66px'}>
            <Text>Unlock 3</Text>
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
                  <Text>
                    {snapshotDate
                      ? convertTimeStamp(snapshotDate, 'YYYY.MM.DD HH:mm:ss')
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* whitelist date & time */}
              {step === 'Whitelist' && (
                <GridItem w={'106px'} mr={'28px'}>
                  <Text>
                    {snapshotDate
                      ? `${convertTimeStamp(
                          Number(snapshotDate + 1),
                          'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          Number(snapshotDate + 1 + 300),
                          'MM.DD HH:mm:ss',
                        )}`
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* Public sale 1 date & time */}
              {step === 'Public Sale 1' && (
                <GridItem w={'106px'} mr={'28px'}>
                  <Text>
                    {publicSale1DateRange
                      ? `${convertTimeStamp(
                          Number(publicSale1DateRange[0]),
                          'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          Number(publicSale1DateRange[1]),
                          'MM.DD HH:mm:ss',
                        )}`
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* Public sale 2 date & time */}
              {step === 'Public Sale 2' && (
                <GridItem w={'106px'} mr={'40px'}>
                  <Text mr={'5px'}>
                    {publicSale2DateRange
                      ? `${convertTimeStamp(
                          Number(publicSale2DateRange[0]),
                          'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          Number(publicSale2DateRange[1]),
                          'MM.DD HH:mm:ss',
                        )}`
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* Vesting Round 0 ?? */}
              {step === 'Unlock 1' && (
                <GridItem w={'62px'} mr={'60px'}>
                  <Text mr={'5px'}>
                    {unlockDate1
                      ? convertTimeStamp(unlockDate1, 'YYYY.MM.DD HH:mm:ss')
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* TODO: Calculate the last vesting round period 1440 days */}
              {step === 'Unlock 3' && (
                <GridItem w={'62px'} mr={'66px'}>
                  <Text mr={'5px'}>
                    {unlockDate3
                      ? convertTimeStamp(unlockDate3, 'YYYY.MM.DD HH:mm:ss')
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
                    startTimeCap={publicSale1STC} />
                </Flex>
              )}
              {/* Public sale 2 date & time input*/}
              {step === 'Public Sale 2' && (
                <Flex alignItems="center" ml={'-8px'}>
                  <DoubleCalendarPop
                    setDate={setPublicSale2DateRange}
                    // public sale end + 1
                    startTimeCap={publicSale2STC} />
                </Flex>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
