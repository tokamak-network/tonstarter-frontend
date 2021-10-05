import {Text} from '@chakra-ui/react';
import Countdown from 'react-countdown';

// type YYYY = `19${d}${d}` | `20${d}${d}`;
// type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
// type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;
// type DateYMString = `${YYYY}/${MM}`;
// type DateYMDString = `${DateYMString}/${DD}`;

type DetailCounterProps = {
  numberFontSize?: string;
  stringFontSize?: string;
  date: string;
};

const trimDigit = (arg: any) => {
  if (String(arg).length === 1) {
    return `0${arg}`;
  }
  return arg;
};

export const DetailCounter: React.FC<DetailCounterProps> = (prop) => {
  const {numberFontSize, stringFontSize, date} = prop;

  console.log(date);

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
