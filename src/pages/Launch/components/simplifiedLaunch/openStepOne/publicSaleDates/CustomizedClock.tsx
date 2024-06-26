import {Dispatch, SetStateAction, useState, useEffect} from 'react';
import React, {useMemo} from 'react';
import {
  Flex,
  Box,
  Grid,
  Text,
  NumberInput,
  useTheme,
  useColorMode,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import clock from 'assets/svgs/poll_time_active_icon.svg';
import moment from 'moment';
const themeDesign = {
  border: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #535353',
  },
  font: {
    light: '#86929d',
    dark: '#777777',
  },
  select: {
    light: '#3e495c',
    dark: '#f3f4f1',
  },
  bg: {
    light: 'white.100',
    dark: 'black.200',
  },
};

type ClockProps = {
  setTime?: Dispatch<SetStateAction<any>>;
  startTime: number;
  endTime?: number;
  calendarType: string;
  startTimeCap: number;
  label?: string;
  duration: number
  // month: string,
  // day: number,
  disabled?: boolean;
};

const CustomizedClock = (props: ClockProps) => {
  const {
    setTime,
    startTime,
    endTime,
    calendarType,
    startTimeCap,
    label,
    duration,
    // month,
    // day,
    disabled,
  } = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const hr = startTimeCap !== undefined ? moment.unix(startTimeCap).hours() : 1;
  const minu =
    startTimeCap !== undefined ? moment.unix(startTimeCap).minutes() : 0;
  const sec =
    startTimeCap !== undefined ? moment.unix(startTimeCap).seconds() : 0;
  const [hours, setHours] = useState<number>(
    hr > 12 ? hr - 12 : hr === 0 ? 12 : hr,
  );
  const [minutes, setMinutes] = useState<number>(minu);
  const [seconds, setSeconds] = useState<number>(sec);
  const [meridiem, setMeridiem] = useState<string>(hr >= 12 ? 'PM' : 'AM');
  useEffect(() => {
    setHours(hr > 12 ? hr - 12 : hr === 0 ? 12 : hr);
    setMinutes(minu);
    setSeconds(sec);
    setMeridiem(hr >= 12 ? 'PM' : 'AM');
  }, [startTimeCap]);

  const setUp = () => {
    let hour;
    if (meridiem === 'AM' && hours === 12) {
      setTime && setTime([0, minutes, seconds]);
    } else if (meridiem === 'PM' && hours === 12) {
      setTime && setTime([hours, minutes, seconds]);
    } else if (meridiem === 'PM' && hours !== 12) {
      hour = hours + 12;
      setTime && setTime([hour, minutes, seconds]);
    } else {
      setTime && setTime([hours, minutes, seconds]);
    }
  };

  const [month, setMonth] = useState<string>('');
  const [date, setDate] = useState<number>(0);

  useEffect(() => {
    
    const start = startTime ? startTime : startTimeCap;
    const startDate = new Date(start*1000)
   const end = start + (86400*duration)
     const endDate = new Date(end*1000)
     
    const date =
      calendarType === 'end'
        ? endDate
        : startDate;
  
    
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthCalc = monthNames[date.getMonth()];
    
    const dayCalc = date.getDate();

    // console.log(monthCalc,dayCalc);
    
    setMonth(monthCalc);
    setDate(dayCalc);

    // const
  }, [calendarType, startTime, startTimeCap]);
  // console.log(new Date(startTime*1000));

  //   const monthAndDay = useMemo(() => {

  //   return getMonthAndDay(startTime ? startTime : startTimeCap);
  // },[calendarType, startTime, startTimeCap])

  useEffect(() => {
    setUp();
  }, [hours, minutes, seconds, meridiem, startTimeCap]);

  return (
    <Grid
      alignItems="center"
      justifyContent={'center'}
      w={'298px'}
      borderTop={
        colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #535353'
      }
      borderBottom={
        colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #535353'
      }
      bg={colorMode === 'light' ? '#FFFFFF' : '#222222'}
      zIndex={1}>
      <Box pt={2} textAlign={'left'}>
        <Flex>
          <Text fontSize={'13px'} fontWeight={600}>
            {label}
          </Text>
          &nbsp;
          {startTime ? (
            <Text fontSize={'13px'}>
              {month}&nbsp;{date}
            </Text>
          ) : (
            <Text fontSize={'13px'}>&nbsp;-&nbsp;-&nbsp;</Text>
          )}
        </Flex>
      </Box>
      <Flex
        p={'10px 0px'}
        flexDirection="row"
        alignItems="center"
        justifyContent={'center'}>
        <NumberInput
          isDisabled={disabled}
          maxH={'37px'}
          fontFamily={theme.fonts.roboto}
          maxW={'48px'}
          defaultValue={1}
          colorScheme={'gray'}
          max={12}
          min={1}
          mr={'10px'}
          value={hours}
          onChange={(value) => {
            setHours(parseInt(value));
          }}
          borderColor={'transparent'}
          _focus={{
            borderColor: 'transparent',
          }}
          _active={{
            borderColor: 'transparent',
          }}
          _hover={{
            borderColor: 'transparent',
          }}
          focusBorderColor="transparent">
          <NumberInputField
            fontSize="28px"
            pl={'0px'}
            color={themeDesign.select[colorMode]}
            pr={'14px'}
            focusBorderColor="transparent"
            textAlign={'right'}
            value={hours}
            _hover={{
              borderColor: 'transparent',
            }}
          />
          <NumberInputStepper
            borderColor={'transparent'}
            fontSize={'28px'}
            w={'10px'}
            opacity={0.2}
            size="xs">
            <NumberIncrementStepper borderColor={'transparent'} />
            <NumberDecrementStepper borderColor={'transparent'} />
          </NumberInputStepper>
        </NumberInput>
        <NumberInput
          isDisabled={disabled}
          maxH={'37px'}
          maxW={'48px'}
          defaultValue={0}
          fontFamily={theme.fonts.roboto}
          onChange={(value) => {
            setMinutes(parseInt(value));
          }}
          max={59}
          min={0}
          mr={'10px'}
          value={minutes}
          borderColor={'transparent'}
          _focus={{
            borderColor: 'transparent',
          }}
          _active={{
            borderColor: 'transparent',
          }}
          _hover={{
            borderColor: 'transparent',
          }}
          focusBorderColor="transparent">
          <NumberInputField
            fontSize="28px"
            pl={'0px'}
            pr={'14px'}
            color={themeDesign.select[colorMode]}
            focusBorderColor="transparent"
            textAlign={'right'}
            _hover={{
              borderColor: 'transparent',
            }}
          />
          <NumberInputStepper
            borderColor={'transparent'}
            fontSize={'28px'}
            w={'10px'}
            opacity={0.2}>
            <NumberIncrementStepper borderColor={'transparent'} />
            <NumberDecrementStepper borderColor={'transparent'} />
          </NumberInputStepper>
        </NumberInput>
        <NumberInput
          isDisabled={disabled}
          maxH={'37px'}
          maxW={'48px'}
          fontFamily={theme.fonts.roboto}
          defaultValue={0}
          onChange={(value) => {
            setSeconds(parseInt(value));
          }}
          max={59}
          min={0}
          mr={'10px'}
          borderColor={'transparent'}
          _focus={{
            borderColor: 'transparent',
          }}
          _active={{
            borderColor: 'transparent',
          }}
          _hover={{
            borderColor: 'transparent',
          }}
          value={seconds}
          focusBorderColor="transparent">
          <NumberInputField
            fontSize="28px"
            pl={'0px'}
            color={themeDesign.select[colorMode]}
            pr={'14px'}
            focusBorderColor="transparent"
            textAlign={'right'}
            _hover={{
              borderColor: 'transparent',
            }}
          />
          <NumberInputStepper
            borderColor={'transparent'}
            fontSize={'28px'}
            w={'8px'}
            opacity={0.2}>
            <NumberIncrementStepper borderColor={'transparent'} />
            <NumberDecrementStepper borderColor={'transparent'} />
          </NumberInputStepper>
        </NumberInput>

        <Select
          isDisabled={disabled}
          h={'30px'}
          w={'72px'}
          fontSize={'13px'}
          fontWeight={'bold'}
          color={themeDesign.select[colorMode]}
          mr={'10px'}
          onChange={(e) => {
            setMeridiem(e.target.value);
          }}>
          {hr < 12 ? (
            <>
              {' '}
              <option>AM</option>
              <option>PM</option>
            </>
          ) : (
            <>
              {' '}
              <option>PM</option>
              <option>AM</option>
            </>
          )}
        </Select>
      </Flex>
    </Grid>
  );
};

export default CustomizedClock;
