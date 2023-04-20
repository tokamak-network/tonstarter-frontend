import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useState} from 'react';
import Calendar from 'react-calendar';
import './css/CalendarLaunch.css';
import calender_Forward_icon_inactive from 'assets/svgs/calender_Forward_icon_inactive.svg';
import calender_back_icon_inactive from 'assets/svgs/calender_back_icon_inactive.svg';
import moment from 'moment';
import {isProduction} from '@Launch/utils/checkConstants';

type CalendarProps = {
  setValue: Dispatch<SetStateAction<any>>;
  startTime: number;
  endTime?: number;
  calendarType?: string;
  startTimeCap?: number;
  duration: number;
};

const CustomizedCalendar = (prop: CalendarProps) => {
  const {setValue, startTime, endTime, calendarType, startTimeCap, duration} =
    prop;
  const {colorMode} = useColorMode();
  const [calVal, setCalVal] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  // const setInput = (date: any) => {
  //   const dateSelected = Number(new Date(date));
  //   setCalVal(dateSelected / 1000);
  //   setValue(dateSelected / 1000);
  // }

  const handleStartDateChange = (date: Date) => {
    const endDate = new Date(date);
    isProduction() === false
      ? endDate.setDate(endDate.getDate() + (2 * 60) / 1000)
      : endDate.setDate(endDate.getDate() + duration);
    setDateRange({startDate: date, endDate});
    setValue(date.getTime() / 1000);
  };
  const tilesDisabled = ({date, view}: any) => {
    const now = moment().startOf('day').unix();
    const formattedDate = moment(date).startOf('day').unix();
    const startCap = startTimeCap
      ? moment.unix(startTimeCap).startOf('day').unix()
      : moment().startOf('day').unix();

    if (calendarType !== undefined) {
      if (view === 'month') {
        if (formattedDate < startCap) {
          return true;
        } else if (
          calendarType === 'end' &&
          startTime !== 0 &&
          formattedDate < moment.unix(startTime).startOf('day').unix()
        ) {
          return true;
        } else {
          return false;
        }
      } else if (view === 'year') {
        const dateFormatted = new Date(formattedDate * 1000);
        const monthFormatted = dateFormatted.getMonth();
        const nowFormatted = new Date(startTime * 1000);
        const monthNow = nowFormatted.getMonth();
        if (monthFormatted >= monthNow) {
          return false;
        } else {
          return true;
        }
      } else {
        const dateFormatted = new Date(formattedDate * 1000);
        const yearFormatted = dateFormatted.getFullYear();
        const nowFormatted = new Date(startTime * 1000);
        const yearNow = nowFormatted.getFullYear();
        if (yearFormatted >= yearNow) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (view === 'month') {
        if (formattedDate < startCap) {
          return true;
        } else {
          return false;
        }
      } else if (view === 'year') {
        const dateFormatted = new Date(formattedDate * 1000);
        const monthFormatted = dateFormatted.getMonth();
        const nowFormatted = new Date(now * 1000);
        const monthNow = nowFormatted.getMonth();
        if (monthFormatted >= monthNow) {
          return false;
        } else {
          return true;
        }
      } else {
        const dateFormatted = new Date(formattedDate * 1000);
        const yearFormatted = dateFormatted.getFullYear();
        const nowFormatted = new Date(now * 1000);
        const yearNow = nowFormatted.getFullYear();
        if (yearFormatted >= yearNow) {
          return false;
        } else {
          return true;
        }
      }
    }
  };

  const tileClassName = ({date}: any) => {
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      date.getTime() >= dateRange.startDate.getTime() &&
      date.getTime() <= dateRange.endDate.getTime()
    ) {
      return 'react-calendar__tile--active';
    }
    return '';
  };

  const dayStyle =
    colorMode === 'light'
      ? `.react-calendar  {
        background-color: white;
      }
      .react-calendar__tile:enabled:hover {
        border: solid 1px #93b7f1;
        color: #2a72e5;
        background: transparent;
      }
      .react-calendar__tile:enabled:focus {
        color: #fff;
        border: none;
        background-color: #2a72e5;
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
        color: #c7d1d8;
        background: transparent
      }
      `
      : `.react-calendar {
        background: #222222;
      }
      .react-calendar__tile:enabled:hover {
        border: solid 1px #264a84;
        color: #2a72e5;
        background: transparent;
      }
      .react-calendar__tile:enabled:focus {
        color: #fff;
        border: none;
        background-color: #2a72e5;
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
        color: #424242;
        background: transparent
      }`;

  return (
    <Flex alignItems={'center'} display="flex">
      <style>{dayStyle}</style>
      <Calendar
        onChange={handleStartDateChange}
        nextLabel={<img src={calender_Forward_icon_inactive} />}
        prevLabel={<img src={calender_back_icon_inactive} />}
        minDetail={'decade'}
        locale={'en-EN'}
        tileDisabled={tilesDisabled}
        tileClassName={tileClassName}
      />
    </Flex>
  );
};

export default CustomizedCalendar;
