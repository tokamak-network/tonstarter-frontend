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
  propNames,
} from '@chakra-ui/react';
import HoverImage from 'components/HoverImage';
import CalendarActiveImg from 'assets/launch/calendar-active-icon.svg';
import CalendarInactiveImg from 'assets/launch/calendar-inactive-icon.svg';
import {CustomCalendar} from './CustomCalendar';
import {CustomClock} from './CustomClock';
import '../css/CalendarLaunch.css';
import moment from 'moment';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
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
  setDate?: Dispatch<SetStateAction<any>>;
  fieldValueKey?: string;
  oldValues?: {};
  valueKey?: any;
};
const SingleCalendarPop: React.FC<calendarComponentProps> = ({
  setDate,
  fieldValueKey,
  oldValues,
  valueKey,
}) => {
  const {colorMode} = useColorMode();
  const [image, setImage] = useState(CalendarInactiveImg);
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);

  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();

  const createTime = (onClose: any) => {
    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });

    setStartTime(startDates.unix());
    if (fieldValueKey) {
      console.log('fieldValueKey');
      console.log(fieldValueKey);
      const timeStamp = startDates.unix();
      setFieldValue(fieldValueKey, {...oldValues, [valueKey]: timeStamp});
      return onClose();
    } else {
      if (setDate) {
        setDate(startDates.unix());
      }
    }
    onClose();
  };

  return (
    <Popover closeOnBlur={true} placement="bottom">
      {({isOpen, onClose}) => (
        <>
          <PopoverTrigger>
            <img
              src={image}
              onMouseEnter={() => setImage(CalendarActiveImg)}
              onMouseOut={() => setImage(CalendarInactiveImg)}
              style={{cursor: 'pointer'}}
              alt={'calender_icon'}></img>
          </PopoverTrigger>
          <PopoverContent
            h={'423px'}
            w={'300px'}
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
              <CustomCalendar
                setValue={setStartTime}
                startTime={startTime}></CustomCalendar>
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

export default SingleCalendarPop;
