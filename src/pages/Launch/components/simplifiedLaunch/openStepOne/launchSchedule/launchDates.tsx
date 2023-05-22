import {
  Grid,
  Box,
  Text,
  GridItem,
  Image,
  useTheme,
  Link,
  PopoverTrigger,
  PopoverContent,
  Popover,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import {convertTimeStamp} from 'utils/convertTIme';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import SingleCalendarPop from '../../../common/SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {isProduction} from '@Launch/utils/checkConstants';
import PublicSaleDatePicker from '../publicSaleDates/PublicSaleDatePicker';
import {DateTimePicker} from '../../../../components/DateTimePicker';
import calendarInactiveIcon from 'assets/svgs/calendar_inactive_icon.svg';
import calendarActiveIcon from 'assets/svgs/calendar_active_icon.svg';
const pdfPath = require('assets/ClaimSchedule.pdf').default;

type LaunchDateProps = {
  launchSteps: string[];
};

export const LaunchDates: React.FC<LaunchDateProps> = (props) => {
  const {launchSteps} = props;
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;
  const theme = useTheme();

  // Do not show calendar icons if public vault is initialized
  const isPublicVaultDeployed = publicVault.isSet;

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
  const [unlockDate1, setUnlockDate0] = useState<number | undefined>(0);
  // STC : Start Time Cap
  const [whitelistSTC, setWhitelistSTC] = useState<number>(0);
  const [publicSale1STC, setPublicSale1STC] = useState<number>(0);
  const [publicSale2STC, setPublicSale2STC] = useState<number>(0);
  const [lastUnlockDate, setLastUnlockDate] = useState<number>(0);
  const [isDateTimePickerOpen, setDateTimePickerOpen] = useState(false);

  //  popover as a tooltip
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const stepName = '';
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
    if (publicSale1) {
      if (isProduction() === false) {
        setPublicSale1End(publicSale1 + 2 * 60);
      } else {
        setPublicSale1End(publicSale1 + 2 * 86400);
      }
    }
    if (publicSale2) {
      if (isProduction() === false) {
        setPublicSale2End(publicSale2 + 2 * 60);
      } else {
        setPublicSale2End(publicSale2 + 5 * 86400);
      }
    }
  }, [publicSale2, publicSale1]);

  useEffect(() => {
    setFieldValue('vaults[0].snapshot', snapshotDate);
    // Second after snapshot
    setFieldValue('vaults[0].whitelist', snapshotDate && snapshotDate + 1);
    // whitelist start to end - 2 min (Dev)
    if (isProduction() === false) {
      setFieldValue(
        'vaults[0].whitelistEnd',
        snapshotDate && snapshotDate + 2 * 60,
      );
    } else {
      // whitelist start to end - 2 days (Prod)
      setFieldValue(
        'vaults[0].whitelistEnd',
        snapshotDate && snapshotDate + 1 + 86400 * 2,
      );
    }
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
    whitelistDateRange,
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
      setPublicSale2STC(publicVault.publicRound1End);
    }
  }, [publicVault.publicRound1End]);

  useEffect(() => {
    if (publicVault.publicRound2End) {
      setUnlockDate0(publicVault.publicRound2End + 1);
    }
  }, [publicVault.publicRound2End]);

  // Calculate last unlock time
  useEffect(() => {
    if (unlockDate1) {
      const secondsInADay = 86400;
      //  days till Last Vesting Round = 1440;
      const seconds = 1440 * secondsInADay;
      const lastUnlock = unlockDate1 + seconds;
      setLastUnlockDate(lastUnlock);
    }
  }, [unlockDate1, lastUnlockDate]);

  const handleTogglePicker = () => {
    setDateTimePickerOpen(!isDateTimePickerOpen);
  };

  const handlePickerCancel = () => {
    setDateTimePickerOpen(false);
  };

  return (
    <Grid
      templateColumns="repeat(7, 1fr)"
      fontSize={'10.9px'}
      textAlign="center"
      p={0}>
      {launchSteps.map((step: string, index: number) => {
        return (
          <Grid textAlign="center" mt={2} line-height={'1.36'} p={0}>
            {/* snapshot date & time */}
            {step === 'Snapshot' && (
              <GridItem w="56px" mr="14px" p={0}>
                {snapshotDate ? (
                  <Text>
                    {convertTimeStamp(snapshotDate, 'YYYY.MM.DD HH:mm:ss')}
                  </Text>
                ) : (
                  <Text color="#ff3b3b" ml={'8px'}>
                    Choose
                  </Text>
                )}
                {!isPublicVaultDeployed && (
                  <Box mt={'8px'} ml={'20px'}>
                    <DateTimePicker range={false} />
                  </Box>
                )}
              </GridItem>
            )}
            {/* whitelist date & time */}
            {step === 'Whitelist' && (
              <GridItem w={'100px'} mr={'14px'} p={0}>
                {snapshotDate ? (
                  <Text>
                    {convertTimeStamp(
                      Number(snapshotDate + 1),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(
                      // mainnet: 2 days after snapshot time
                      // testnet: whitelist end: 1 second after snapshot, 1 second before public sale 1 */}
                      Number(
                        isProduction() === false
                          ? publicSale1
                            ? publicSale1 - 1
                            : snapshotDate + 2 * 60
                          : publicSale1
                          ? publicSale1 - 1
                          : snapshotDate + 1 + 86400 * 2,
                      ),
                      'MM.DD HH:mm:ss',
                    )}
                  </Text>
                ) : (
                  <Text ml={'8px'}>-</Text>
                )}
              </GridItem>
            )}
            {/* Public sale 1 date & time */}
            {step === 'Public Sale 1' && (
              <GridItem w={'100px'} mr={'14px'} p={0}>
                {publicSale1 && snapshotDate && snapshotDate < publicSale1 ? (
                  <Text>
                    {convertTimeStamp(
                      Number(publicSale1),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(Number(publicSale1End), 'MM.DD HH:mm:ss')}
                  </Text>
                ) : (
                  <Text color="#ff3b3b" ml={'8px'}>
                    Choose
                  </Text>
                )}
                {!isPublicVaultDeployed && (
                  <Grid justifyContent={'center'}>
                    {/* Public sale 1 date & time input whitelist end + 1s*/}
                    {/* <Grid mt={'9px'} ml={'8px'} justifyContent={'center'}>
                      <PublicSaleDatePicker
                        setDate={setPublicSale1}
                        startTimeCap={publicSale1STC}
                        duration={2}
                        disabled={snapshotDate ? false : true}
                      />
                    </Grid> */}
                    <Popover>
                      <PopoverTrigger>
                        <Box
                          as="button"
                          mt={'9px'}
                          ml={'7px'}
                          disabled={!snapshotDate}
                          style={{
                            cursor: !snapshotDate ? 'default' : 'pointer',
                          }}
                          _hover={{
                            backgroundImage: snapshotDate
                              ? `url(${calendarActiveIcon})`
                              : '',
                          }}
                          transition="background-image 0.3s">
                          <img
                            src={
                              publicSale1End
                                ? calendarActiveIcon
                                : calendarInactiveIcon
                            }
                            alt="Inactive image"
                          />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent _focus={{border: 'none'}}>
                        <DateTimePicker range={true} />
                      </PopoverContent>
                    </Popover>
                  </Grid>
                )}
              </GridItem>
            )}
            {/* Public sale 2 date & time */}
            {step === 'Public Sale 2' && (
              <GridItem w={'100px'} mr={'29px'} p={0}>
                {publicSale2 &&
                publicSale1 &&
                publicSale2 > publicSale1 &&
                snapshotDate &&
                snapshotDate < publicSale1 ? (
                  <Text>
                    {convertTimeStamp(
                      Number(publicSale2),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(Number(publicSale2End), 'MM.DD HH:mm:ss')}
                  </Text>
                ) : (
                  <Text color="#ff3b3b" ml={'8px'}>
                    Choose
                  </Text>
                )}
                {/* <Grid justifyContent={'center'}> */}
                {/* <Grid mt={'9px'} ml={'8px'} justifyContent={'center'}> */}
                {!isPublicVaultDeployed && (
                  // <PublicSaleDatePicker
                  //   // public sale end + 1
                  //   setDate={setPublicSale2}
                  //   startTimeCap={publicSale2STC}
                  //   duration={5}
                  //   disabled={publicSale1End ? false : true}
                  // />
                  <Popover>
                    <PopoverTrigger>
                      <Box
                        as="button"
                        mt={'9px'}
                        ml={'7px'}
                        disabled={!publicSale1End}
                        style={{
                          cursor: !publicSale1End ? 'default' : 'pointer',
                        }}
                        _hover={{
                          backgroundImage: publicSale1End
                            ? `url(${calendarActiveIcon})`
                            : '',
                        }}
                        transition="background-image 0.3s">
                        <img
                          src={
                            publicSale1End
                              ? calendarActiveIcon
                              : calendarInactiveIcon
                          }
                          alt="Inactive image"
                        />
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent _focus={{border: 'none'}}>
                      <DateTimePicker range={true} />
                    </PopoverContent>
                  </Popover>
                )}
                {/* </Grid> */}
                {/* </Grid> */}
              </GridItem>
            )}
            {step === 'Unlock 1' && (
              <GridItem w={'56px'} mr={'39px'} p={0}>
                <Text>
                  {unlockDate1
                    ? convertTimeStamp(unlockDate1, 'YYYY.MM.DD HH:mm:ss') +
                      '\n(Vesting 1)'
                    : '(Vesting 1)'}
                </Text>
              </GridItem>
            )}
            {step === 'Unlock ..' && (
              <GridItem w={'78px'} mr={'40px'}>
                {unlockDate1 ? (
                  <>
                    <Text>
                      7 times unlock <br /> 4 times vesting <br />
                    </Text>
                    <Grid justifyItems={'center'} mt={'6px'}>
                      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
                        <PopoverTrigger>
                          <Image
                            src={tooltipIcon}
                            onMouseEnter={handleMouseEnter}
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          w={'200px'}
                          h={'60px'}
                          bg={'#353c48'}
                          color={'#fff'}
                          _focus={{}}>
                          <PopoverArrow bg={'#353c48'} />
                          <PopoverBody textAlign={'left'}>
                            <>
                              Each vault unlocks a set amount each month over a
                              period of up to 48 months.&nbsp;
                              {/* Open claim schedule as pdf on a new tab */}
                              <Link
                                href={pdfPath}
                                target="_blank"
                                without
                                rel="noopener noreferrer"
                                style={{textDecoration: 'none'}}>
                                Learn{' '}
                                <span style={{color: '#2a72e5'}}>more...</span>
                              </Link>
                            </>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Grid>
                  </>
                ) : (
                  <Text ml={'7px'}>-</Text>
                )}
              </GridItem>
            )}
            {step === 'Unlock 7' && (
              <GridItem w={'56px'} p={0}>
                <Text>
                  {lastUnlockDate
                    ? convertTimeStamp(lastUnlockDate, 'YYYY.MM.DD HH:mm:ss') +
                      '\n(Vesting 4)'
                    : '(Vesting 4)'}
                </Text>
              </GridItem>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};
