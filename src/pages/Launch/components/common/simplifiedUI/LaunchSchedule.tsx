import {Box, Grid, Flex, Text, useColorMode, GridItem} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import React from 'react';
import SingleCalendarPop from '../SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {convertTimeStamp} from 'utils/convertTIme';
import DoubleCalendarPop from '../../common/DoubleCalendarPop';
import {Projects, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';

type ScheduleProps = {
  stepNames: string[];
  currentStep: number;
};

export const LaunchSchedule: React.FC<ScheduleProps> = (props) => {
  const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
  const snapshotValue = values.snapshotTime;
  const StartPublicSale1Value = values.publicSale1Start;
  const EndPublicSale1Value = values.publicSale1End;
  const StartPublicSale2Value = values.publicSale2Start;
  const EndPublicSale2Value = values.publicSale2End;
  const {stepNames, currentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const [snapshotDate, setSnapshotDate] = useState<number | undefined>(snapshotValue || 0);
  const [unlockDate1, setUnlockDate1] = useState<number | undefined>(0);
  const [unlockDate2, setUnlockDate2] = useState<number | undefined>(0);
  const [unlockDate3, setUnlockDate3] = useState<number | undefined>(0);
  const [publicSale1StartDate, setPublicSale1StartDate] = useState<number | undefined>(StartPublicSale1Value || 0);
  const [publicSale1EndDate, setPublicSale1EndDate] = useState<number | undefined>(EndPublicSale1Value || 0);
  const [publicSale2StartDate, setPublicSale2StartDate] = useState<number | undefined>(StartPublicSale2Value || 0);
  const [publicSale2EndDate, setPublicSale2EndDate] = useState<number | undefined>(EndPublicSale2Value || 0);
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

  const publicVault = vaults[0] as VaultPublic;

  const getTimeStamp = () => {
    stepNames.forEach(stepName => {      
      switch (
        stepName
      ) {
        case 'Snapshot': {
          return publicVault.snapshot;
        }
        case 'Whitelist': {
          return [publicVault.whitelist, publicVault.whitelistEnd];
        }
        case 'Public Round 1': {
          return [publicVault.publicRound1, publicVault.publicRound1End];
        }
        case 'Public Round 2': {
          return [publicVault.publicRound2, publicVault.publicRound2End];
        }
        case 'Start Time': {
          //@ts-ignore
          return vaults[1].startTime;
        }
        default:
          return 0;
      }
    });
  }

  /**
   * TODO:
   * 1. Set Unlock, Public Sale date,time according to Snapshot time
   * 2. use snapshotGap to calculate Public Sale, Unlock time
   */
  return (
    <Grid my={'40px'}>
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
              <GridItem w={'62px'} mr={'62px'}>
                <Text>...</Text>
              </GridItem>
              <GridItem w={'62px'} mr={'66px'}>
                <Text>Unlock 3</Text>
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
                <GridItem w={'62px'} mr={'50px'}>
                  <Text>
                    {snapshotDate
                      ? convertTimeStamp(snapshotDate, 'YYYY.MM.DD HH:mm:ss')
                      : '0000.00.00 00:00:00'}
                  </Text>
                </GridItem>
              )}
              {/* Public sale 1 date & time */}
              {step === 'Public Sale 1' && (
                <GridItem w={'106px'} mr={'28px'}>
                  <Text>
                    {publicSale1StartDate && publicSale1EndDate
                      ? `${convertTimeStamp(
                        publicSale1StartDate,
                          'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          publicSale1EndDate,
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
                    {publicSale2StartDate && publicSale2EndDate
                      ? `${convertTimeStamp(
                        publicSale2StartDate,
                          'YYYY.MM.DD HH:mm:ss',
                        )} ~${convertTimeStamp(
                          publicSale2EndDate,
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
        {stepNames.map((step: string, index: number) => {
          return (
            <Grid alignItems="center" ml={4} mt={'9px'}>
              {/* snapshot date & time input */}
              {step === 'Snapshot' && (
                <Flex alignItems="center" ml={'5px'}>
                  <SingleCalendarPop
                    setDate={setSnapshotDate}></SingleCalendarPop>
                </Flex>
              )}
              {/* Public sale 1 date & time input*/}
              {step === 'Public Sale 1' && (
                <Flex alignItems="center" ml={'-3px'}>
                  <DoubleCalendarPop
                    // FIXME: 
                    // setDate={[setPublicSale1StartDate, setPublicSale2EndDate]}
                    setDate={setPublicSale1StartDate}
                    startTimeCap={0}></DoubleCalendarPop>
                </Flex>
              )}
              {/* Public sale 2 date & time input*/}
              {step === 'Public Sale 2' && (
                <Flex alignItems="center" ml={'-8px'}>
                  <DoubleCalendarPop
                    // FIXME: 
                    // setDate={[setPublicSale2StartDate, setPublicSale2EndDate]}
                    setDate={setPublicSale2StartDate}
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
