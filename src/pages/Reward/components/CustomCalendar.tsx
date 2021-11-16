import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';

import {FC, Dispatch, SetStateAction, useRef, useState, useEffect} from 'react';
import Calendar from 'react-calendar';
import '../css/Calendar.css';
import calender_Forward_icon_inactive from 'assets/svgs/calender_Forward_icon_inactive.svg';
import calender_back_icon_inactive from 'assets/svgs/calender_back_icon_inactive.svg';
import moment from 'moment';


const themeDesign = {
  border: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};

type CalendarProps = {
  setValue: Dispatch<SetStateAction<any>>;
  startTime: number;
  endTime: number;
  calendarType: string;
};

export const CustomCalendar = (prop: CalendarProps) => {
  const {setValue, startTime, endTime, calendarType} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showInputValue, setShowInputValue] = useState<string>('');
  const refCalendar = useRef<HTMLInputElement>(null);
  
  const setInput = (date: any) => {
    setShowCalendar(false);
    const dateSelected = Number(new Date(date));
    setValue(dateSelected / 1000);
    const dateFormatted = moment(date).format('MM/DD/YYYY');
    setShowInputValue(dateFormatted);
  };

  const tilesDisabled = ({activeStartDate, date, view}: any) => {
    const now = moment().startOf('day').unix();
    const formattedDate = moment(date).startOf('day').unix();
    const nowTimeStamp = moment().unix();
    const maxEndDate =  now+ 63072000
    const maxStartDate = now+ 2592000
    if (view === 'month') {
      if (formattedDate < now) {
        return true;
      } 
      
      else if (calendarType === 'end' && formattedDate>maxEndDate && startTime !== 0) {
        return true;
      }
      else if (calendarType === 'start' && formattedDate> maxStartDate) {
        return true
      }
      else if (
        endTime !== 0 &&
        formattedDate > endTime &&
        calendarType === 'start'
      ) {
        return true;
      } 

      else if (calendarType === 'end' &&  startTime !== 0 && formattedDate <startTime ) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;
    }
  };
  useEffect(() => {
    const hideCalendar = (ref: any) => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowCalendar(false);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    };
    hideCalendar(refCalendar);
  }, [endTime, startTime]);

  const dayStyle =
    colorMode === 'light'
      ? `.react-calendar  {
      background-color: white;
      box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);
    }
    .react-calendar__navigation {
      border-bottom: solid 1px #dfe3e9;
    }
    .react-calendar__month-view__weekdays {
      color: 384919e;
    }
    .react-calendar__month-view__days__day--neighboringMonth { 
      color: #c7d1d8;
    }
    // .react-calendar__tile{
    //   color: #3d495d;
    // }
    `
      : `.react-calendar {
      background: #222222;
      border: 1px solid #535353;
    }
    .react-calendar__navigation {
      border-bottom: solid 1px #363636;
    }
    .react-calendar__month-view__weekdays {
      color: #777777;
    }
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #3c3c3c;
    }
    .react-calendar__tile{
      color: 3dee4ef;
    }`;

  return (
    <Flex
      alignItems={'flex-start'}
      border={themeDesign.border[colorMode]}
      borderRadius={'4px'}
      w={'100px'}
      h={'30px'}
      onClick={() => setShowCalendar(true)}
      display="flex"
      justifyContent="end">
      <Input
        fontSize={13}
        value={showInputValue}
        readOnly={true}
        h={30}
        placeholder={'MM/DD/YYYY'}
        border={'none'}
        _focus={{
          border: 'none',
        }}
        _active={{
          border: 'none',
        }}
      />
      <style>{dayStyle}</style>
      {showCalendar ? (
        <Calendar
          onChange={setInput}
          nextLabel={<img src={calender_Forward_icon_inactive} />}
          prevLabel={<img src={calender_back_icon_inactive} />}
          minDetail={'decade'}
          inputRef={refCalendar}
          tileDisabled={tilesDisabled}
        />
      ) : null}
    </Flex>
  );
};
