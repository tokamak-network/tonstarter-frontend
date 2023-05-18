import React, { useState, useEffect } from 'react';
import { Clock } from './Clock';
import { ActionBar } from './ActionBar';

import '../styles/layout.scss';

type TimePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  selectedDate: Date | null;
  selectedEndDate?: Date | null;
  setSelectedDate: (value: Date | null) => void;
  setSelectedEndDate?: (value: Date | null) => void;
  range?: boolean;
};

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  selectedDate,
  setSelectedDate,
  selectedEndDate,
  setSelectedEndDate,
  range,
}) => {
  const [startTime, setStartTime] = useState<Date | null>(
    selectedDate ? new Date(selectedDate.getTime()) : null,
  );
  const [endTime, setEndTime] = useState<Date | null>(
    selectedEndDate ? new Date(selectedEndDate.getTime()) : null,
  );

  const setSelectedDateTime = () => {
    setStartTime(selectedDate ? new Date(selectedDate.getTime()) : null);
    setEndTime(selectedEndDate ? new Date(selectedEndDate.getTime()) : null);

    return value;
  };

  const initSelection = () => {
    console.log('empty selected date');
  };

  useEffect(() => {
    setSelectedDateTime();
  }, [value]);

  return (
    <>
      {range ? (
        <div>
          <Clock
            value={value}
            onChange={onChange}
            range={true}
            text={'Start time'}
            time={startTime}
          />
          <Clock value={value} onChange={onChange} range={true} text={'End time'} time={endTime} />
        </div>
      ) : (
        <Clock value={value} onChange={onChange} time={startTime} />
      )}

      <ActionBar onClick={setSelectedDateTime} onReset={initSelection} />
    </>
  );
};
