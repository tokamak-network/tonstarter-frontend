import React, { useState, useEffect } from 'react';
import '../styles/clock.scss';
import timer_down_icon_inactive from '../assets/timer_down_icon_inactive.svg';
import timer_up_icon_inactive from '../assets/timer_up_icon_inactive.svg';

type ClockProps = {
  value: Date;
  onChange: (value: Date) => void;
  time: Date | null;
  range?: boolean;
  text?: string;
};

export const Clock: React.FC<ClockProps> = ({ value, onChange, range, time, text }) => {
  const [hours, setHours] = useState<number>(value.getHours() % 12 || 12);
  const [minutes, setMinutes] = useState<number>(value.getMinutes());
  const [seconds, setSeconds] = useState<number>(value.getSeconds());
  const [meridiem, setMeridiem] = useState<string>(value.getHours() >= 12 ? 'PM' : 'AM');

  const updateDate = (newHours: number, newMinutes: number, newSeconds: number) => {
    time = value;
    setHours(newHours % 12 || 12);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
    const newTime = new Date(time);
    console.log('new date', newTime);
    newTime.setHours(newHours, newMinutes, newSeconds);
    onChange(newTime);
  };

  const addHours = () => {
    let newHours = hours + 1;
    if (newHours > 12) {
      newHours = 1;
    }
    updateDate(newHours, minutes, seconds);
  };

  const decreaseHours = () => {
    let newHours = hours - 1;
    if (newHours < 1) {
      newHours = 12;
    }
    updateDate(newHours, minutes, seconds);
  };

  const addMinutes = () => {
    let newMinutes = minutes + 1;
    let newHours = hours;
    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours += 1;
      if (newHours > 12) {
        newHours = 1;
      }
    }
    updateDate(newHours, newMinutes, seconds);
  };

  const decreaseMinutes = () => {
    let newMinutes = minutes - 1;
    let newHours = hours;
    if (newMinutes < 0) {
      newMinutes = 59;
      newHours -= 1;
      if (newHours < 1) {
        newHours = 12;
      }
    }
    updateDate(newHours, newMinutes, seconds);
  };

  const addSeconds = () => {
    let newSeconds = seconds + 1;
    let newMinutes = minutes;
    let newHours = hours;
    if (newSeconds >= 60) {
      newSeconds = 0;
      newMinutes += 1;
      if (newMinutes >= 60) {
        newMinutes = 0;
        newHours += 1;
        if (newHours > 12) {
          newHours = 1;
        }
      }
    }
    updateDate(newHours, newMinutes, newSeconds);
  };

  const decreaseSeconds = () => {
    let newSeconds = seconds - 1;
    let newMinutes = minutes;
    let newHours = hours;
    if (newSeconds < 0) {
      newSeconds = 59;
      newMinutes -= 1;
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours -= 1;
        if (newHours < 1) {
          newHours = 12;
        }
      }
    }
    updateDate(newHours, newMinutes, newSeconds);
  };

  const handleMeridiemChange = (selectedMeridiem: string) => {
    let newHours = hours;
    if (selectedMeridiem === 'PM' && hours < 12) {
      newHours += 12;
    } else if (selectedMeridiem === 'AM' && hours === 12) {
      newHours = 0;
    }
    setMeridiem(selectedMeridiem);
    const newDate = new Date(time || value.getTime());
    newDate.setHours(newHours, minutes, seconds);
    onChange(newDate);
  };

  const getStartEndTimeText = () => {
    if (time) {
      const month = time.toLocaleString('default', { month: 'long' });
      const date = time.getDate();
      return `${month} ${date}`;
    } else {
      return `--`;
    }
  };

  const monthAndDate = getStartEndTimeText();

  return (
    <>
      <div className='container'>
        {range && <div className='container__month-date'>{`${text} : ${monthAndDate}`}</div>}
        <div className='clock'>
          <input
            className='clock__time-input'
            type='text'
            value={hours < 10 ? `${0}${hours}` : `${hours}`}
            readOnly
          />
          <div className='clock__arrow-box'>
            <div onClick={addHours}>
              <img src={timer_up_icon_inactive}></img>
            </div>
            <div onClick={decreaseHours}>
              <img src={timer_down_icon_inactive}></img>
            </div>
          </div>
          <input
            className='clock__time-input'
            type='text'
            value={minutes < 10 ? `${0}${minutes}` : `${minutes}`}
            readOnly
          />
          <div className='clock__arrow-box'>
            <div onClick={addMinutes}>
              <img src={timer_up_icon_inactive}></img>
            </div>
            <div onClick={decreaseMinutes}>
              <img src={timer_down_icon_inactive}></img>
            </div>
          </div>
          <input
            className='clock__time-input'
            type='text'
            value={seconds < 10 ? `${0}${seconds}` : `${seconds}`}
            readOnly
          />
          <div className='clock__arrow-box'>
            <div onClick={addSeconds}>
              <img src={timer_up_icon_inactive}></img>
            </div>
            <div onClick={decreaseSeconds}>
              <img src={timer_down_icon_inactive}></img>
            </div>
          </div>

          <div className='clock__selector'>
            <select
              name='time'
              value={meridiem}
              className='select'
              onChange={(e) => {
                handleMeridiemChange(e.target.value);
              }}
            >
              <option value='AM'>AM</option>
              <option value='PM'>PM</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
