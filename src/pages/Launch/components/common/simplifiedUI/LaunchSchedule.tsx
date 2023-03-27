import {Box, Grid, Flex, Text, useColorMode, GridItem} from '@chakra-ui/react';
import {useEffect,useState} from 'react';
import React from 'react';
import SingleCalendarPop from '../SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {convertTimeStamp} from 'utils/convertTIme';
import DoubleCalendarPop from '../../common/DoubleCalendarPop';
import {Projects, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import InputComponent from '../InputComponent';

type ScheduleProps = {
  // stepNames: string[];
  currentStep: number;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
  const {snapshotTime, whitelist, whitelistEnd,  publicSale1Start, publicSale1End, publicSale2Start, publicSale2End} = values;
  const {currentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const [snapshotDate, setSnapshotDate] = useState<number | undefined>(snapshotTime || 0);
  const [unlockDate1, setUnlockDate1] = useState<number | undefined>(0);
  const [unlockDate2, setUnlockDate2] = useState<number | undefined>(0);
  const [unlockDate3, setUnlockDate3] = useState<number | undefined>(0);
  const [publicSale1StartDate, setPublicSale1StartDate] = useState<number | undefined>(publicSale1Start || 0);
  const [publicSale1EndDate, setPublicSale1EndDate] = useState<number | undefined>(publicSale1End || 0);
  const [publicSale2StartDate, setPublicSale2StartDate] = useState<number | undefined>(publicSale2Start || 0);
  const [publicSale2EndDate, setPublicSale2EndDate] = useState<number | undefined>(publicSale2End || 0);
  const stepName = '';
  const launchSteps = ['Snapshot', 'Public Sale 1', 'Public Sale 2', 'Unlock 1', 'Unlock 2', 'Unlock 3']
  
  const getTimeStamp = () => {
    switch (
      stepName as
        | 'Snapshot'
        | 'Public Sale 1'
        | 'Public Sale 2'
        | 'Unlock 1'
    ) {
      case 'Snapshot': {
        return snapshotTime;
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
  }

  const [dateRange1, setDateRange1] = useState<(number | undefined)[]>(
    getTimeStamp() as (number | undefined)[],
  );
  const [dateRange2, setDateRange2] = useState<(number | undefined)[]>(
    getTimeStamp() as (number | undefined)[],
  );

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
   * 3. Set current owner's account address from web3js.
   */
  return (
    <Grid my={'40px'}>
      <Box my={'20px'}>
        <Text fontSize="md">Schedule</Text>
      </Box>
      <Flex>
          <Grid mb={2} fontSize="xs" templateColumns="repeat(8, 1fr)" textAlign={'center'} as="b">
              <GridItem w={'62px'} mr={'59px'}>
                <Flex as="b">
                <Text mr={'5px'} color={'#FF3B3B'}>
                  *
                </Text>
                Snapshot
              </Flex>
              </GridItem>
              {/* <GridItem  w={'100px'} mr={'28px'}>
                <Flex>
                <Text mr={'5px'} color={'#FF3B3B'}>
                  *
                </Text>
                Whitelist
              </Flex>
              </GridItem> */}
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
              <GridItem w={'62px'} mr={'62px'}>
                <Text>...</Text>
              </GridItem>
              <GridItem w={'62px'} mr={'66px'}>
                <Text>Unlock 3</Text>
              </GridItem>
          </Grid>
      </Flex>
      <Flex ml={'28px'} >
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
      <Grid templateColumns="repeat(6, 1fr)" textAlign="center" style={{top:0}}>
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
              {/* {step === 'Whitelist' && (
                <GridItem w={'106px'} mr={'28px'}>
                  <Text>
                    {dateRange
                      ? `${convertTimeStamp(
                        Number(wldateRange[0]),
                        'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          Number(wldateRange[1]),
                          'MM.DD HH:mm:ss',
                        )}`
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )} */}
              {/* Public sale 1 date & time */}
              {step === 'Public Sale 1' && (
                <GridItem w={'106px'} mr={'28px'}>
                  <Text>
                    {dateRange1
                      ? `${convertTimeStamp(
                        Number(dateRange1[0]),
                        'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          Number(dateRange1[1]),
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
                    {dateRange2
                      ? `${convertTimeStamp(
                        Number(dateRange2[0]),
                          'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          Number(dateRange2[1]),
                          'MM.DD HH:mm:ss',
                        )}`
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {step === 'Unlock 1' && (
                <GridItem w={'62px'} mr={'60px'}>
                  <Text mr={'5px'}>
                    {unlockDate1
                      ? convertTimeStamp(unlockDate1, 'YYYY.MM.DD HH:mm:ss')
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {step === 'Unlock 2' && (
                <GridItem w={'62px'} mr={'62px'}>
                  <Text mr={'5px'}>
                    {unlockDate2
                      ? convertTimeStamp(unlockDate2, 'YYYY.MM.DD HH:mm:ss')
                      : 'Message'}
                  </Text>
                </GridItem>
              )}
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
                    setDate={setSnapshotDate}>
                    startTimeCap={snapshotGap}
                    </SingleCalendarPop>
                </Flex>
              )}
               {/* {step === 'Whitelist' && (
                <Flex alignItems="center" ml={'-3px'}>
                  <DoubleCalendarPop
                    setDate={setWlDateRange}
                    startTimeCap={0}></DoubleCalendarPop>
                </Flex>
              )} */}
              {/* Public sale 1 date & time input*/}
              {step === 'Public Sale 1' && (
                <Flex alignItems="center" ml={'-3px'}>
                  <DoubleCalendarPop
                    setDate={setDateRange1}
                    startTimeCap={0}></DoubleCalendarPop>
                </Flex>
              )}
              {/* Public sale 2 date & time input*/}
              {step === 'Public Sale 2' && (
                <Flex alignItems="center" ml={'-8px'}>
                  <DoubleCalendarPop
                    setDate={setDateRange2}
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
