import React, {useState, Dispatch, useEffect, SetStateAction} from 'react';
import '../styles/clock.scss';
import timer_down_icon_inactive from '../assets/timer_down_icon_inactive.svg';
import timer_up_icon_inactive from '../assets/timer_up_icon_inactive.svg';
import {
  Text,
  Flex,
  NumberInput,
  useColorMode,
  NumberInputField,
  Image,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Button,
} from '@chakra-ui/react';

type ClockProps = {
  value: Date;
  // onChange: (value: Date) => void;
  time: number;
  range?: boolean;
  text?: string;
  setTime: Dispatch<SetStateAction<number[]>>;
};

export const Clock: React.FC<ClockProps> = ({
  value,
  // onChange,
  range,
  time,
  text,
  setTime,
}) => {
  const [hours, setHours] = useState<number>(value.getHours() % 12 || 12);
  const [minutes, setMinutes] = useState<number>(value.getMinutes());
  const [seconds, setSeconds] = useState<number>(value.getSeconds());
  const [meridiem, setMeridiem] = useState<string>('AM');

  const getStartEndTimeText = () => {
    if (time) {
      const options = {month: 'long'} as Intl.DateTimeFormatOptions;
      const month = new Intl.DateTimeFormat('default', options).format(
        new Date(time),
      );
      const date = new Date(time).getDate();
      return `${month} ${date}`;
    } else {
      return `--`;
    }
  };

  const monthAndDate = getStartEndTimeText();

  const setUp = () => {
    let hour;
    if (meridiem === 'AM' && hours === 12) {
      setTime([0, minutes, seconds]);
    } else if (meridiem === 'PM' && hours === 12) {
      setTime([hours, minutes, seconds]);
    } else if (meridiem === 'PM' && hours !== 12) {
      hour = hours + 12;
      setTime([hour, minutes, seconds]);
    } else {
      setTime([hours, minutes, seconds]);
    }
  };

  useEffect(() => {
    setUp();
  }, [hours, minutes, seconds, meridiem]);

  return (
    <>
      <div className="container">
        {range && (
          <div className="container__month-date">{`${text} : ${monthAndDate}`}</div>
        )}
        <div className="clock">
          <Flex p={'10px 10px'} flexDirection="row" alignItems="center">
            <NumberInput
              maxH={'37px'}
              fontFamily={'Roboto'}
              maxW={'48px'}
              defaultValue={hours}
              colorScheme={'gray'}
              max={12}
              min={1}
              mr={'10px'}
              onChange={(value) => {
                setHours(parseInt(value));
              }}
              borderColor={'transparent'}
              _focus={{
                borderColor: 'transparent',
              }}
              _active={{
                borderColor: 'transparent',
              }}
              _hover={{
                borderColor: 'transparent',
              }}
              focusBorderColor="transparent">
              <NumberInputField
                fontSize="28px"
                pl={'0px'}
                color={'gray.800'}
                pr={'14px'}
                focusBorderColor="transparent"
                textAlign={'right'}
                value={hours}
                _hover={{
                  borderColor: 'transparent',
                }}
              />
              <NumberInputStepper
                borderColor={'transparent'}
                fontSize={'28px'}
                w={'10px'}
                opacity={0.2}
                size="xs">
                <NumberIncrementStepper borderColor={'transparent'} />
                <NumberDecrementStepper borderColor={'transparent'} />
              </NumberInputStepper>
            </NumberInput>
            <NumberInput
              maxH={'37px'}
              maxW={'48px'}
              defaultValue={minutes}
              fontFamily={'Roboto'}
              onChange={(value) => {
                setMinutes(parseInt(value));
              }}
              max={59}
              min={0}
              mr={'10px'}
              borderColor={'transparent'}
              _focus={{
                borderColor: 'transparent',
              }}
              _active={{
                borderColor: 'transparent',
              }}
              _hover={{
                borderColor: 'transparent',
              }}
              focusBorderColor="transparent">
              <NumberInputField
                fontSize="28px"
                pl={'0px'}
                pr={'14px'}
                color={''}
                focusBorderColor="transparent"
                textAlign={'right'}
                _hover={{
                  borderColor: 'transparent',
                }}
              />
              <NumberInputStepper
                borderColor={'transparent'}
                fontSize={'28px'}
                w={'10px'}
                opacity={0.2}>
                <NumberIncrementStepper borderColor={'transparent'} />
                <NumberDecrementStepper borderColor={'transparent'} />
              </NumberInputStepper>
            </NumberInput>
            <NumberInput
              maxH={'37px'}
              maxW={'48px'}
              fontFamily={'Roboto'}
              defaultValue={seconds}
              onChange={(value) => {
                setSeconds(parseInt(value));
              }}
              max={59}
              min={0}
              mr={'10px'}
              borderColor={'transparent'}
              _focus={{
                borderColor: 'transparent',
              }}
              _active={{
                borderColor: 'transparent',
              }}
              _hover={{
                borderColor: 'transparent',
              }}
              focusBorderColor="transparent">
              <NumberInputField
                fontSize="28px"
                pl={'0px'}
                color={'gray.800'}
                pr={'14px'}
                focusBorderColor="transparent"
                textAlign={'right'}
                _hover={{
                  borderColor: 'transparent',
                }}
              />
              <NumberInputStepper
                borderColor={'transparent'}
                fontSize={'28px'}
                w={'8px'}
                opacity={0.2}>
                <NumberIncrementStepper borderColor={'transparent'} />
                <NumberDecrementStepper borderColor={'transparent'} />
              </NumberInputStepper>
            </NumberInput>

            <Select
              h={'30px'}
              w={'72px'}
              fontSize={'13px'}
              fontWeight={'bold'}
              color={'gray.800'}
              mr={'10px'}
              onChange={(e) => {
                setMeridiem(e.target.value);
              }}>
              <option>AM</option>
              <option>PM</option>
            </Select>
          </Flex>
        </div>
      </div>
    </>
  );
};
