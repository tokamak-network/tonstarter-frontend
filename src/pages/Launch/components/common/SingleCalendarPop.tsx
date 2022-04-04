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

type calendarComponentProps = {};
const SingleCalendarPop: React.FC<calendarComponentProps> = () => {
  const {colorMode} = useColorMode();
  const [image, setImage] = useState(CalendarInactiveImg);
  const [created, setCreated] = useState();
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);
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
            w={'300px'}
            boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
            border={colorMode === 'light' ? '' : '1px solid #535353'}
            bg={colorMode === 'light' ? '#FFFFFF' : '#222222'}
            borderRadius={'4px'}
            _focus={
              colorMode === 'light'
                ? {
                    border: 'transparent',
                  }
                : {
                    border: '1px solid #535353',
                  }
            }
            _hover={
              colorMode === 'light'
                ? {
                    border: 'transparent',
                  }
                : {
                    border: '1px solid #535353',
                  }
            }
            zIndex={1}>
            <Flex flexDir={'column'} justifyContent={'center'}>
              <CustomCalendar
                setValue={setStartTime}
                startTime={startTime}
                endTime={endTime}
                calendarType={'start'}
                created={created}></CustomCalendar>
              <CustomClock setTime={setStartTimeArray}></CustomClock>
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
                  _hover={{}}
                  //   onClick={() => handleStep(false)}
                >
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
                    onClick={() => onClose()}
                >
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

export default SingleCalendarPop;
