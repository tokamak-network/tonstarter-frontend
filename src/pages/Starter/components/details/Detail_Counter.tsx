import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import Countdown from 'react-countdown';

type DetailCounterProps = {
  numberFontSize?: string;
  stringFontSize?: string;
  // date: 'YYYY/MM/DD'
};

const trimDigit = (arg: any) => {
  if (String(arg).length === 1) {
    return `0${arg}`;
  }
  return arg;
};

export const DetailCounter: React.FC<DetailCounterProps> = (prop) => {
  const {numberFontSize, stringFontSize} = prop;

  const [date] = useState('2021/12/30');

  //@ts-ignore
  const countDownRenderer = ({days, hours, minutes, seconds, completed}) => {
    if (completed) {
      // Render a completed state
      return null;
    } else {
      // Render a countdown
      return (
        <Text>
          {days}
          <span
            style={{fontSize: stringFontSize || '20px', marginRight: '2px'}}>
            D
          </span>{' '}
          {trimDigit(hours)}
          <span style={{fontSize: stringFontSize || '20px'}}>H</span>:
          {trimDigit(minutes)}
          <span style={{fontSize: stringFontSize || '20px'}}>M</span>:
          {trimDigit(seconds)}
          <span style={{fontSize: stringFontSize || '20px'}}>SEC left</span>
        </Text>
      );
    }
  };

  return (
    <Text color="blue.100" fontSize={numberFontSize}>
      <Countdown date={date} renderer={countDownRenderer} />
    </Text>
  );
};
