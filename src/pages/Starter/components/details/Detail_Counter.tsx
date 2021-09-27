import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import Countdown from 'react-countdown';

const trimDigit = (arg: any) => {
  if (String(arg).length === 1) {
    return `0${arg}`;
  }
  return arg;
};

export const DetailCounter = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const [date] = useState('2021/12/30');

  const {STATER_STYLE} = theme;

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
          <span style={{fontSize: '20px', marginRight: '2px'}}>D</span>{' '}
          {trimDigit(hours)}
          <span style={{fontSize: '20px'}}>H</span>:{trimDigit(minutes)}
          <span style={{fontSize: '20px'}}>M</span>:{trimDigit(seconds)}
          <span style={{fontSize: '20px'}}>SEC left</span>
        </Text>
      );
    }
  };

  return (
    <Text color="blue.100">
      <Countdown date={date} renderer={countDownRenderer} />
    </Text>
  );
};
