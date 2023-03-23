import {Box, Grid, Flex, Text, useColorMode, GridItem} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import SingleCalendarPop from '../SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {convertTimeStamp} from 'utils/convertTIme';
import DoubleCalendarPop from '../../common/DoubleCalendarPop';

type ScheduleProps = {
  stepNames: string[];
  currentStep: number;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {stepNames, currentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const [snapshotDate, setSnapshotDate] = useState<number | undefined>(0);
  const [unlockDate1, setUnlockDate1] = useState<number | undefined>(0);
  const [unlockDate2, setUnlockDate2] = useState<number | undefined>(0);
  const [unlockDate3, setUnlockDate3] = useState<number | undefined>(0);
  const [publicSale1DateRange, setPublicSale1DateRange] = useState<number[]>([
    0, 0,
  ]);
  const [publicSale2DateRange, setPublicSale2DateRange] = useState<number[]>([
    0, 0,
  ]);

  /* Ensure stepMax is always set to the highest value of currentStep seen (so far) 
       If currentStep increases beyond the current maxStep, the stepMax is updated to 
       reflect the new maximum value of currentStep

       callback func will run whenever the currentStep, or maxStep changes.
    */
  useEffect(() => {
    if (currentStep > maxStep) {
      setStepMax(currentStep);
    }
  }, [currentStep, maxStep]);

  /**
   * TODO:
   * 1. Set Unlock, Public Sale date,time according to Snapshot time
   * 2. use snapshotGap to calculate Public Sale, Unlock time
   * 3. update steps when navigating back to this component
   * 4. Set Date range types
   */
  return (
    <Grid my={4}>
      <Box my={'20px'}>
        <Text fontSize="md">Schedule</Text>
      </Box>
      <Flex>
          <Grid mb={2} fontSize="xs" templateColumns="repeat(6, 1fr)" textAlign={'center'} as="b">
              <GridItem w={'62px'} mr={'59px'}>
                <Flex as="b">
                <Text mr={'5px'} color={'#FF3B3B'}>
                  *
                </Text>
                Snapshot
              </Flex>
              </GridItem>
              <GridItem  w={'100px'} mr={'28px'}>
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
              <GridItem w={'62px'} mr={'50px'}>
                <Text>Unlock 2</Text>
              </GridItem>
              <GridItem w={'62px'} mr={'50px'}>
                <Text>Unlock 2</Text>
              </GridItem>
          </Grid>
      </Flex>
      <Flex ml={'28px'} >
        {stepNames.map((step: string, index: number) => {
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
              {index < stepNames.length - 1 && (
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
      <Grid templateColumns="repeat(6, 1fr)" textAlign="center" style={{top:0}}>
        {stepNames.map((step: string, index: number) => {
          return (
            <Grid textAlign="center" mt={2} fontSize={'11px'}>
              {/* snapshot date & time */}
              {step === 'Snapshot' && (
                <GridItem w={'62px'} mr={'55px'}>
                  <Text>
                    {snapshotDate
                      ? convertTimeStamp(snapshotDate, 'YYYY-MM-DD HH:mm:ss')
                      : '0000-00-00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* Public sale 1 date & time */}
              {step === 'Public Sale 1' && (
                <GridItem w={'101px'} mr={'28px'}>
                  <Text>
                    {publicSale1DateRange
                      ? `${convertTimeStamp(
                          publicSale1DateRange[0],
                          'YYYY-MM-DD HH:mm:ss',
                        )} ~ ${convertTimeStamp(
                          publicSale1DateRange[1],
                          'MM-DD HH:mm:ss',
                        )}`
                      : '0000-00-00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* Public sale 2 date & time */}
              {step === 'Public Sale 2' && (
                <GridItem w={'106px'} mr={'40px'}>
                  <Text mr={'5px'}>
                    {publicSale2DateRange
                      ? `${convertTimeStamp(
                          publicSale2DateRange[0],
                          'YYYY-MM-DD HH:mm:ss',
                        )} ~ ${convertTimeStamp(
                          publicSale2DateRange[1],
                          'MM-DD HH:mm:ss',
                        )}`
                      : '0000-00-00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {step === 'Unlock 1' && (
                <GridItem w={'62px'} mr={'60px'}>
                  <Text mr={'5px'}>
                    {unlockDate1
                      ? convertTimeStamp(unlockDate1, 'YYYY-MM-DD HH:mm:ss')
                      : '0000-00-00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {step === 'Unlock 2' && (
                <GridItem w={'62px'} mr={'50px'}>
                  <Text mr={'5px'}>
                    {unlockDate2
                      ? convertTimeStamp(unlockDate2, 'YYYY-MM-DD HH:mm:ss')
                      : '0000-00-00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {step === 'Unlock 3' && (
                <GridItem w={'62px'} mr={'50px'}>
                  <Text mr={'5px'}>
                    {unlockDate3
                      ? convertTimeStamp(unlockDate3, 'YYYY-MM-DD HH:mm:ss')
                      : '0000-00-00 00:00:00'}
                  </Text>
                </GridItem>
              )}
            </Grid>
          );
        })}
      </Grid>
      <Grid templateColumns="repeat(6, 1fr)" gap={8} fontSize="xs">
        {stepNames.map((step: string, index: number) => {
          return (
            <Grid alignItems="center" ml={4} mt={'9px'}>
              {/* snapshot date & time input */}
              {step === 'Snapshot' && (
                <Flex alignItems="center">
                  <SingleCalendarPop
                    setDate={setSnapshotDate}></SingleCalendarPop>
                </Flex>
              )}
              {/* Public sale 1 date & time input*/}
              {step === 'Public Sale 1' && (
                <Flex alignItems="center">
                  <DoubleCalendarPop
                    setDate={setPublicSale1DateRange}
                    startTimeCap={0}></DoubleCalendarPop>
                </Flex>
              )}
              {/* Public sale 2 date & time input*/}
              {step === 'Public Sale 2' && (
                <Flex alignItems="center">
                  <DoubleCalendarPop
                    setDate={setPublicSale2DateRange}
                    startTimeCap={0}></DoubleCalendarPop>
                </Flex>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};
