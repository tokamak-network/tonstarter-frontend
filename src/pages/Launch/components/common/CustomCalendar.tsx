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
import '../css/CalendarLaunch.css';
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
  endTime?: number;
  calendarType?: string;
};

export const CustomCalendar = (prop: CalendarProps) => {
  const {setValue, startTime, endTime, calendarType} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  
  const [showInputValue, setShowInputValue] = useState<string>('');
  const setInput = (date: any) => {
    const dateSelected = Number(new Date(date));
    setValue(dateSelected / 1000);
    const dateFormatted = moment(date).format('MM/DD/YYYY');
    setShowInputValue(dateFormatted);
  };

  const tilesDisabled = ({date, view}: any) => {
    const now = moment().startOf('day').unix();
    const formattedDate = moment(date).startOf('day').unix();
    if (calendarType !== undefined) {
      if (view === 'month') {
        if (formattedDate < now) {
          return true;
        }
      else if (calendarType === 'end' &&  startTime !== 0  && formattedDate <= startTime ) {
        return true;
      }
        else {
          return false;
        }
      } else if (view === 'year') {  
        const dateFormatted = new Date(formattedDate*1000)
        const monthFormatted = dateFormatted.getMonth();
        const nowFormatted = new Date(startTime*1000);
        const monthNow = nowFormatted.getMonth();
        if (monthFormatted >= monthNow) {
          return false;
        }
        else {
          return true;
        }
      } else {
        const dateFormatted = new Date(formattedDate*1000)
        const yearFormatted = dateFormatted.getFullYear();
        const nowFormatted = new Date(startTime*1000);
        const yearNow = nowFormatted.getFullYear();
        if (yearFormatted >= yearNow) {
          return false;
        } else {
          return true;
        }
      }
    }
     else {
      if (view === 'month') {
        if (formattedDate < now) {
          return true;
        }
        else {
          return false;
        }
      } else if (view === 'year') {  
        const dateFormatted = new Date(formattedDate*1000)
        const monthFormatted = dateFormatted.getMonth();
        const nowFormatted = new Date(now*1000);
        const monthNow = nowFormatted.getMonth();
        if (monthFormatted >= monthNow) {
          return false;
        } else {
          return true;
        }
      } else {
        const dateFormatted = new Date(formattedDate*1000)
        const yearFormatted = dateFormatted.getFullYear();
        const nowFormatted = new Date(now*1000);
        const yearNow = nowFormatted.getFullYear();
        if (yearFormatted >= yearNow) {
          return false;
        } else {
          return true;
        }
      }
    }
    
  };

  const dayStyle =
    colorMode === 'light'
      ? `.react-calendar  {
      background-color: white;
     
    }
    .react-calendar__navigation {
      border-bottom: solid 1px #dfe3e9;
    }
    .react-calendar__month-view__weekdays {
      color: 384919e;
    }
    .react-calendar__month-view__days__day--neighboringMonth { 
      color: #86929d;
    }
    .react-calendar__tile:disabled {
      color: #c7d1d8
    }
    // .react-calendar__tile{
    //   color: #3d495d;
    // }
    `
      : `.react-calendar {
      background: #222222;
     
    }
    .react-calendar__navigation {
      border-bottom: solid 1px #363636;
    }
    .react-calendar__month-view__weekdays {
      color: #777777;
    }
    .react-calendar__month-view__days__day--neighboringMonth {
      color: #86929d;
    }
    .react-calendar__tile{
      color: 3dee4ef;
    }
    .react-calendar__tile:disabled {
      color: #424242
    }`;

  return (
    <Flex
      alignItems={'center'}
      display="flex"
     
      >
      <style>{dayStyle}</style>
     
        <Calendar
          onChange={setInput}
          nextLabel={<img src={calender_Forward_icon_inactive} />}
          prevLabel={<img src={calender_back_icon_inactive} />}
          minDetail={'decade'}
          locale={'en-EN'}
          tileDisabled={tilesDisabled}
        />
      
    </Flex>
  );
};
