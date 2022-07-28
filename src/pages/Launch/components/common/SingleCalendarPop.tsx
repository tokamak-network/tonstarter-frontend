import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import React from 'react';
import {
  Flex,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@chakra-ui/react';
import CalendarActiveImg from 'assets/launch/calendar-active-icon.svg';
import CalendarInactiveImg from 'assets/launch/calendar-inactive-icon.svg';
import CalendarInactiveImgDark from 'assets/launch/calendar-inactive-icon-dark.svg';
import {CustomCalendar} from './CustomCalendar';
import {CustomClock} from './CustomClock';
import '../css/CalendarLaunch.css';
import moment from 'moment';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';

type calendarComponentProps = {
  setDate?: Dispatch<SetStateAction<any>>;
  fieldValueKey?: string;
  oldValues?: {};
  valueKey?: any;
  startTimeCap?: number;
};
const SingleCalendarPop: React.FC<calendarComponentProps> = ({
  setDate,
  fieldValueKey,
  oldValues,
  valueKey,
  startTimeCap,
}) => {
  const {colorMode} = useColorMode();
  const [image, setImage] = useState(
    colorMode === 'light' ? CalendarInactiveImg : CalendarInactiveImgDark,
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);

  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const createTime = (onClose: any) => {
    create();

    if (fieldValueKey) {
      const timeStamp = startTime;
      // setFieldValue(fieldValueKey, {...oldValues, [valueKey]: timeStamp});
      return onClose();
    } else {
      if (setDate) {
        setDate(startTime);
      }
    }
    onClose();
  };

  const create = () => {
    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });
    setStartTime(startDates.unix());
  };

  useEffect(() => {
    create();
  }, [startTimeArray, startTime]);
  return (
    <Popover closeOnBlur={true} placement="bottom">
      {({isOpen, onClose}) => (
        <>
          <PopoverTrigger>
            <img
              src={image}
              onMouseEnter={() => setImage(CalendarActiveImg)}
              onMouseOut={() =>
                setImage(
                  colorMode === 'light'
                    ? CalendarInactiveImg
                    : CalendarInactiveImgDark,
                )
              }
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
                startTime={startTime}
                startTimeCap={startTimeCap}></CustomCalendar>
              <CustomClock
                setTime={setStartTimeArray}
                calendarType={'start'}
                startTime={startTime}
                startTimeCap={startTimeCap}></CustomClock>
              <Flex alignItems={'center'} justifyContent={'center'} p={'15px'}>
                <Button
                  type="submit"
                  w={'100px'}
                  h={'32px'}
                  bg={'blue.500'}
                  fontSize={14}
                  color={'white.100'}
                  mr={'12px'}
                  _hover={{}}
                  disabled={
                    startTimeCap !== undefined
                      ? startTime <= startTimeCap
                      : false
                  }
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
