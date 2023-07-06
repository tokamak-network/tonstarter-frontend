import {useColorMode} from '@chakra-ui/react';
import * as dateFns from 'date-fns';
import {Cell} from '../components/Cell';
import {daysOfWeek} from '../utils/dateUtils';
import calender_Forward_icon from '../assets/calender_Forward_icon.svg';
import calender_back_icon from '../assets/calender_back_icon.svg';

import '../styles/cell.scss';
import '../styles/calendar.scss';

type CalendarProps = {
  value?: Date;
  onChange: (value: Date) => void;
  selectedDate: Date | null;
  selectedEndDate?: Date | null;
  setSelectedDate: (value: Date | null) => void;
  setSelectedEndDate?: (value: Date | null) => void;
  range?: boolean;
};

export const Calendar = (props: CalendarProps) => {
  const {colorMode} = useColorMode();
  const {
    value = new Date(),
    onChange,
    selectedDate,
    setSelectedDate,
    selectedEndDate,
    setSelectedEndDate,
    range,
  } = props;
  const startDate = dateFns.startOfMonth(value);
  const endDate = dateFns.endOfMonth(value);
  const totalDates = dateFns.eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  const prefixDays = startDate.getDay(); // get the starting day of the month
  const prevMonth = () => onChange && onChange(dateFns.sub(value, {months: 1}));
  const nextMonth = () => onChange && onChange(dateFns.add(value, {months: 1}));
  const today = new Date();
  const currentMonthDays = dateFns.getDaysInMonth(startDate);
  const totalCells = 42; // Total cells in a 6-week calendar view
  // TODO: change the total cells to 35 if in a 5-week calendar view

  // Calculate the number of suffix days
  const suffixDays = totalCells - prefixDays - currentMonthDays;

  const handleClickDate = (index: number) => {
    const date = dateFns.setDate(value, index);
    if (range) {
      if (selectedDate && !selectedEndDate) {
        if (dateFns.isBefore(date, selectedDate)) {
          setSelectedDate(date);
          setSelectedEndDate && setSelectedEndDate(selectedDate);
        } else {
          setSelectedEndDate && setSelectedEndDate(date);
        }
      } else {
        setSelectedDate(date);
        setSelectedEndDate && setSelectedEndDate(null);
      }
    } else {
      setSelectedDate(date);
    }
    onChange && onChange(date);
  };

  const isBeforeToday = (date: Date) => {
    return dateFns.isBefore(date, dateFns.startOfDay(today));
  };
  return (
    <div className={'calendar'}>
      <div
        className={`calendar__header ${
          colorMode === 'light'
            ? 'calendar__header--light-mode'
            : 'calendar__header--dark-mode'
        }`}>
        <div className="calendar__header__navigation" onClick={prevMonth}>
          <img src={calender_back_icon} alt="Previous Month" />
        </div>
        <div className="calendar__header__middle">
          {dateFns.format(value, 'LLLL yyyy')}
        </div>
        <div className="calendar__header__navigation" onClick={nextMonth}>
          <img src={calender_Forward_icon} alt="Next Month" />
        </div>
      </div>
      <div className="calendar__body">
        {daysOfWeek.map((day) => (
          <Cell className="cell__days" key={day}>
            {day}
          </Cell>
        ))}
        {/* prefix days */}
        {Array.from({length: prefixDays}).map((_, index) => {
          const prevMonthDate = dateFns.subMonths(startDate, 1);
          const prevMonthDays = dateFns.getDaysInMonth(prevMonthDate);
          const prevMonthStartDay = dateFns
            .addDays(startDate, -prefixDays + index)
            .getDate();

          const cellClass =
            colorMode === 'dark'
              ? 'cell__prev-month--dark-mode'
              : 'cell__prev-month--light-mode';

          return (
            <Cell className={cellClass} key={`prev-${index}`}>
              {prevMonthStartDay}
            </Cell>
          );
        })}
        {totalDates.map((date) => {
          if (date.getMonth() !== value.getMonth()) {
            return <Cell key={date.toString()} />;
          }

          const isSelectedDate = selectedDate
            ? dateFns.isSameDay(date, selectedDate)
            : false;
          const isSelectedRange =
            selectedDate &&
            selectedEndDate &&
            dateFns.isSameDay(date, selectedDate) &&
            dateFns.isSameDay(date, selectedEndDate);
          const isToday = dateFns.isToday(date);
          const isDisabled = isBeforeToday(date);

          const dateRange: Date[] = [];
          if (selectedDate && selectedEndDate) {
            const currentDate = new Date(selectedDate);
            while (currentDate <= selectedEndDate) {
              dateRange.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }

          const isActive = isSelectedDate || isSelectedRange || false;

          return (
            <Cell
              isActive={isActive}
              isToday={isToday}
              isRange={
                range && dateRange.some((d) => dateFns.isSameDay(d, date))
              }
              isStart={
                range && selectedDate && dateFns.isSameDay(date, selectedDate)
              }
              isEnd={
                range &&
                selectedEndDate &&
                dateFns.isSameDay(date, selectedEndDate)
              }
              startDate={selectedDate}
              endDate={selectedEndDate}
              className={`cell ${
                isDisabled
                  ? `cell__disabled${
                      colorMode === 'light' ? '--light-mode' : '--dark-mode'
                    }`
                  : ''
              }`}
              key={date.toString()}
              onClick={
                isDisabled ? undefined : () => handleClickDate(date.getDate())
              }>
              {dateFns.format(date, 'd')}
            </Cell>
          );
        })}
        {/*  TODO: add dates next month */}
        {/* suffix days */}
        {Array.from({length: suffixDays}).map((_, index) => {
          const nextMonthDate = dateFns.addMonths(startDate, 1);
          const nextMonthStartDay = index + 1;
          const nextMonthDateValue = dateFns.setDate(
            nextMonthDate,
            nextMonthStartDay,
          );

          const cellClass =
            colorMode === 'dark'
              ? 'cell__next-month--dark-mode'
              : 'cell__next-month--light-mode';

          return (
            <Cell className={cellClass} key={`next-${index}`}>
              {nextMonthDateValue.getDate()}
            </Cell>
          );
        })}
      </div>
    </div>
  );
};
