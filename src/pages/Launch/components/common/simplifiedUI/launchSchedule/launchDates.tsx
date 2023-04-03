import {
  Grid,
  Text,
  GridItem,
  Tooltip,
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
import SingleCalendarPop from '../../SingleCalendarPop';
import DoubleCalendarPop from '../../../common/DoubleCalendarPop';
import {snapshotGap} from '@Launch/const';
import {VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';

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

  // Check if the public vault is deployed & disable calendar icons
  const isPublicVaultDeployed = publicVault.isDeployed;

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
    if (unlockDate1) {
      const secondsInADay = 86400;
      //  days till Last Vesting Round = 1440;
      const seconds = 1440 * secondsInADay;
      const lastUnlock = unlockDate1 + seconds;
      setLastUnlockDate(lastUnlock);
    }
  }, [unlockDate1, lastUnlockDate]);

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
                  <Text color="#ff3b3b">Choose</Text>
                )}
                {!isPublicVaultDeployed && (
                  <Grid mt={'9px'} justifyContent={'center'}>
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
                      Number(snapshotDate + 1),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(
                      Number(snapshotDate + 1 + 86400 * 2),
                      'MM.DD HH:mm:ss',
                    )}
                  </Text>
                ) : (
                  <Text ml={'7px'}>-</Text>
                )}
              </GridItem>
            )}
            {/* Public sale 1 date & time */}
            {step === 'Public Sale 1' && (
              <GridItem w={'100px'} mr={'14px'} p={0}>
                {publicSale1 && publicSale1End ? (
                  <Text>
                    {convertTimeStamp(
                      Number(publicSale1),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(Number(publicSale1End), 'MM.DD HH:mm:ss')}
                  </Text>
                ) : (
                  <Text color="#ff3b3b">Choose</Text>
                )}
                {!isPublicVaultDeployed && (
                  <Grid justifyContent={'center'}>
                    {/* Public sale 1 date & time input whitelist end + 1s*/}
                    <Grid mt={'9px'} justifyContent={'center'}>
                      <DoubleCalendarPop
                        setDate={setPublicSale1DateRange}
                        startTimeCap={publicSale1STC}
                      />
                    </Grid>
                  </Grid>
                )}
              </GridItem>
            )}
            {/* Public sale 2 date & time */}
            {step === 'Public Sale 2' && (
              <GridItem w={'100px'} mr={'29px'} p={0}>
                {publicSale2 && publicSale2End ? (
                  <Text>
                    {convertTimeStamp(
                      Number(publicSale2),
                      'YYYY.MM.DD HH:mm:ss',
                    )}
                    <br />~
                    {convertTimeStamp(Number(publicSale2End), 'MM.DD HH:mm:ss')}
                  </Text>
                ) : (
                  <Text color="#ff3b3b">Choose</Text>
                )}
                <Grid justifyContent={'center'}>
                  <Grid mt={'9px'} justifyContent={'center'}>
                    {!isPublicVaultDeployed && (
                      <DoubleCalendarPop
                        // public sale end + 1
                        setDate={setPublicSale2DateRange}
                        startTimeCap={publicSale2STC}
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
                      49 times unlock <br /> 4 times vesting <br />
                    </Text>
                    <Grid justifyItems={'center'} mt={'6px'}>
                      <Popover>
                        <PopoverTrigger>
                          <Image src={tooltipIcon} />
                        </PopoverTrigger>
                        <PopoverContent
                          w={'200px'}
                          h={'60px'}
                          bg={'#353c48'}
                          color={'#fff'}
                          border={0}>
                          <PopoverArrow bg={'#353c48'} />
                          <PopoverBody>
                            <>
                              Each vault unlocks a set amount each month over a
                              period of up to 48 months.&nbsp;
                              <Link
                                href="https://docs.google.com/spreadsheets/d/1GzeAls343c4STphxg_KqB407fdHalDh88aceCuZx6C0/edit?usp=sharing"
                                target="_blank">
                                Learn more...
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
            {step === 'Unlock 49' && (
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
