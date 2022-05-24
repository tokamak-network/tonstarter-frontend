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

type calendarComponentProps = {
  setDate: Dispatch<SetStateAction<any>>;
  startTimeCap: number
};
const DoubleCalendarPop: React.FC<calendarComponentProps> = ({setDate,startTimeCap}) => {
  const {colorMode} = useColorMode();
  const [image, setImage] = useState(
    colorMode === 'light' ? CalendarInactiveImg : CalendarInactiveImgDark,
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState<any[]>([]);
  const [endTime, setEndTime] = useState<number>(0);
  const [endTimeArray, setEndTimeArray] = useState<any[]>([]);
  const [buttonDisable, setButtonDisable] = useState<boolean>();

  
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
    });
    setEndTime(endDates.unix());
    setDate([startDates.unix(), endDates.unix()]);
    onClose();
  };

  useEffect(() => {
    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });
    const tempStart = startDates.unix();
    const ends = moment.unix(endTime);
    const endDates = moment(ends).set({
      hour: endTimeArray[0],
      minute: endTimeArray[1],
      second: endTimeArray[2],
    });
    const tempEnd = endDates.unix();

    const now = moment().unix();
    tempStart === tempEnd || tempEnd < now || tempStart < now || tempEnd< tempStart || tempStart < startTimeCap
      ? setButtonDisable(true)
      : setButtonDisable(false);
  }, [startTime, startTimeArray, endTime, endTimeArray]);
  return (
    <Popover closeOnBlur={true} placement="bottom">
      {({isOpen, onClose}) => (
        <>
          <PopoverTrigger>
            <img
              src={image}
              alt={'calender_image'}
              onMouseEnter={() => setImage(CalendarActiveImg)}
              onMouseOut={() =>
                setImage(
                  colorMode === 'light'
                    ? CalendarInactiveImg
                    : CalendarInactiveImgDark,
                )
              }
              style={{cursor: 'pointer'}}></img>
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
                <Flex
                  flexDir={'column'}
                  borderRight={
                    colorMode === 'light'
                      ? '1px solid #f4f6f8'
                      : '1px solid #535353'
                  }>
                  <CustomCalendar
                    setValue={setStartTime}
                    startTime={startTime} startTimeCap={startTimeCap}></CustomCalendar>
                  <CustomClock
                    setTime={setStartTimeArray}
                    calendarType={'start'}
                    startTime={startTime}
                    endTime={endTime} startTimeCap={startTimeCap}></CustomClock>
                </Flex>
                <Flex flexDir={'column'}>
                  <CustomCalendar
                    setValue={setEndTime}
                    startTime={startTime}
                    calendarType={'end'}
                    endTime={endTime} startTimeCap={startTimeCap}></CustomCalendar>
                  <CustomClock
                    calendarType={'end'}
                    setTime={setEndTimeArray}
                    startTime={startTime}
                    endTime={endTime} startTimeCap={startTimeCap}></CustomClock>
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
                  _hover={{}}
                  disabled={endTime === 0 || buttonDisable }
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
