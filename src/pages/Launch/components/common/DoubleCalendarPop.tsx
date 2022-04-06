import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import React from 'react';
import {
  Text,
  Flex,
  NumberInput,
  Box,
  useTheme,
  useColorMode,
  NumberInputField,
  Image,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverBody,
  Select,
  Button,
} from '@chakra-ui/react';
import HoverImage from 'components/HoverImage';
import CalendarActiveImg from 'assets/launch/calendar-active-icon.svg';
import CalendarInactiveImg from 'assets/launch/calendar-inactive-icon.svg';
import {CustomCalendar} from './CustomCalendar';
import {CustomClock} from './CustomClock';
import '../css/CalendarLaunch.css';
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

type calendarComponentProps = {
  setDate: Dispatch<SetStateAction<any>>;
};
const DoubleCalendarPop: React.FC<calendarComponentProps> = ({setDate}) => {
  const {colorMode} = useColorMode();
  const [image, setImage] = useState(CalendarInactiveImg);
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);
  const [endTime, setEndTime] = useState<number>(0);
  const [endTimeArray, setEndTimeArray] = useState([]);

  const createTime = (onClose: any) => {
    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });

    setStartTime(startDates.unix());

    const ends = moment.unix(endTime);
    const endDates = moment(ends).set({
        hour: endTimeArray[0],
        minute: endTimeArray[1],
        second: endTimeArray[2],
    })

    setEndTime(endDates.unix())
    setDate([startDates.unix(), endDates.unix()]);
    onClose();
  };
  return (
    <Popover closeOnBlur={true} placement="bottom">
      {({isOpen, onClose}) => (
        <>
          <PopoverTrigger>
            <Image
              src={image}
              onMouseEnter={() => setImage(CalendarActiveImg)}
              onMouseOut={() => setImage(CalendarInactiveImg)}></Image>
          </PopoverTrigger>
          <PopoverContent
            h={'423px'}
            w={'600px'}
            border={
              colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #535353'
            }
            bg={colorMode === 'light' ? '#FFFFFF' : '#222222'}
            borderRadius={'4px'}
            _focus={
              colorMode === 'light'
                ? {
                    border: '1px solid #e6eaee',
                  }
                : {
                    border: '1px solid #535353',
                  }
            }
            _hover={
              colorMode === 'light'
                ? {
                    border: '1px solid #e6eaee',
                  }
                : {
                    border: '1px solid #535353',
                  }
            }
            zIndex={1}>
            <Flex flexDir={'column'} justifyContent={'center'}>
              <Flex flexDir={'row'}>
                <Flex flexDir={'column'}
                            borderRight={colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #535353'}
                            >
                  <CustomCalendar
                    setValue={setStartTime}
                    startTime={startTime}></CustomCalendar>
                  <CustomClock setTime={setStartTimeArray}></CustomClock>
                </Flex>
                <Flex flexDir={'column'}>
                  <CustomCalendar
                    setValue={setEndTime}
                    startTime={startTime}
                    calendarType={'end'}></CustomCalendar>
                  <CustomClock setTime={setEndTimeArray}></CustomClock>
                </Flex>
              </Flex>
              <Flex></Flex>
              <Flex alignItems={'center'} justifyContent={'center'} p={'15px'}>
                <Button
                  type="submit"
                  w={'100px'}
                  h={'32px'}
                  bg={'blue.500'}
                  fontSize={14}
                  color={'white.100'}
                  mr={'12px'}
                  //   disabled={isSubmitting}
                  onClick={() => createTime(onClose)}>
                  Set up
                </Button>
                <Button
                  type="submit"
                  w={'100px'}
                  h={'32px'}
                  bg={'#e9edf1'}
                  fontSize={14}
                  color={'#3a495f'}
                  //   disabled={isSubmitting}
                  _hover={{}}
                  onClick={() => onClose()}>
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default DoubleCalendarPop;
