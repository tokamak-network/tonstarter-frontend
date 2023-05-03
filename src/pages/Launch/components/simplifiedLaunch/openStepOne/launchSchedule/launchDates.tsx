import {
  Grid,
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
import React, {useState, useEffect, useMemo} from 'react';
import {convertTimeStamp} from 'utils/convertTIme';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import SingleCalendarPop from '../../../common/SingleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {isProduction} from '@Launch/utils/checkConstants';
import PublicSaleDatePicker from '../publicSaleDates/PublicSaleDatePicker';
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
  const isPublicVaultInitialized = publicVault.isSet; // Not showing calendar icons when public vault is initialized

  const [snapshotDate, setSnapshotDate] = useState<number | undefined>(0);
  const [publicSale1, setPublicSale1] = useState<number | undefined>(0);
  const [publicSale1End, setPublicSale1End] = useState<number | undefined>(0);
  const [publicSale2, setPublicSale2] = useState<number | undefined>(0);
  const [publicSale2End, setPublicSale2End] = useState<number | undefined>(0);
  const [unlockDate1, setUnlockDate1] = useState<number | undefined>(0);
  const [lastUnlockDate, setLastUnlockDate] = useState<number>(0);
  const [publicSale1STC, setPublicSale1STC] = useState<number>(0);
  const [publicSale2STC, setPublicSale2STC] = useState<number>(0);
  const [whitelistDateRange, setWhitelistDateRange] = useState<
    (number | undefined)[]
  >([]);

  // Use popover as a tooltip
  const [isOpen, setIsOpen] = React.useState(false);
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const calcWhitelistTime = () => {
    if (snapshotDate) {
      const startDate = snapshotDate + 1;
      let endDate =
        !publicSale1 && isProduction()
          ? startDate + 86400 * 2 // If in production and no public sale, set end date to 2 days after start date
          : publicSale1 && publicSale1 - 1; // If public sale is defined, set end date to 1 second before public sale start time

      setWhitelistDateRange([startDate, endDate]);
    }
  };

  useEffect(() => {
    calcWhitelistTime();
  }, [snapshotDate, publicSale1]);

  const calcPublicSaleDates = () => {
    const isProd = isProduction();
    
    if (publicSale1) {
      const duration = isProd ? 2 * 86400 : 2 * 60;
      setPublicSale1End(publicSale1 + duration);
    }
  
    if (publicSale2) {
      const duration = isProd ? 5 * 86400 : 2 * 60;
      setPublicSale2End(publicSale2 + duration);
    }
  }

  useEffect(() => {
    calcPublicSaleDates();
  }, [publicSale2, publicSale1, snapshotDate]);


  const calcLastUnlockDate = () => {
    if (unlockDate1) {
      const secondsInADay = 86400;
      const seconds = 1440 * secondsInADay; // 1440 days till Last Vesting Round
      const lastUnlock = unlockDate1 + seconds;
      setLastUnlockDate(lastUnlock);
    } else {
      setLastUnlockDate(0);
    }
  }

  useEffect(() => {
    calcLastUnlockDate();
  }, [unlockDate1, lastUnlockDate, snapshotDate]);

  const setStartTimeCap = () => {
    if (whitelistDateRange[1]) {
      setPublicSale1STC(whitelistDateRange[1] + 1);
    }
    if (publicSale1End) {
      setPublicSale2STC(publicSale1End);
    }
    if (publicSale2End) {
      setUnlockDate1(publicSale2End + 1);
    }
  };

  useEffect(() => {
    setStartTimeCap();
  }, [whitelistDateRange[1], snapshotDate, publicSale1,publicSale2]);

  const resetSchedule = () => {
    setPublicSale1(0);
    setPublicSale1End(0);
    calcWhitelistTime();
    setStartTimeCap();
    resetVestingSchedule();
  };

  useEffect(() => {
    resetSchedule();
  }, [snapshotDate]);

  const resetVestingSchedule = () => {
    setPublicSale2(0);
    setPublicSale2End(0);
    setUnlockDate1(0);
    setLastUnlockDate(0);
  }

  useEffect(() => {
    if (publicSale1 && publicSale2 && publicSale1 > publicSale2) {
      resetVestingSchedule();
    }
  }, [publicSale1]);

  useEffect(() => {
    setFieldValue('vaults[0].snapshot', snapshotDate);
    setFieldValue('vaults[0].whitelist', whitelistDateRange[0]);
    setFieldValue('value[0].whitelistEnd', whitelistDateRange[1]);
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

  console.log('values', values)

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
                {!isPublicVaultInitialized && (
                  <Grid mt={'9px'} ml={'8px'} justifyContent={'center'}>
                    <SingleCalendarPop
                      setDate={setSnapshotDate}
                      startTimeCap={snapshotGap}
                    />
                  </Grid>
                )}
              </GridItem>
            )}
            {/* whitelist date & time */}
            {step === 'Whitelist' && (
              <GridItem w={'100px'} mr={'14px'} p={0}>
                {snapshotDate ? (
                  <Text>
                    {convertTimeStamp(
                      Number(whitelistDateRange[0]),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(
                      Number(whitelistDateRange[1]),
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
                {publicSale1 ? (
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
                {!isPublicVaultInitialized && (
                  <Grid justifyContent={'center'}>
                    {/* Public sale 1 date & time input whitelist end + 1s*/}
                    <Grid mt={'9px'} ml={'8px'} justifyContent={'center'}>
                      <PublicSaleDatePicker
                        setDate={setPublicSale1}
                        startTimeCap={publicSale1STC}
                        duration={2}
                        disabled={snapshotDate ? false : true}
                      />
                    </Grid>
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
                <Grid justifyContent={'center'}>
                  <Grid mt={'9px'} ml={'8px'} justifyContent={'center'}>
                    {!isPublicVaultInitialized && (
                      <PublicSaleDatePicker
                        setDate={setPublicSale2}
                        startTimeCap={publicSale2STC}
                        duration={5}
                        disabled={publicSale1End ? false : true}
                      />
                    )}
                  </Grid>
                </Grid>
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
