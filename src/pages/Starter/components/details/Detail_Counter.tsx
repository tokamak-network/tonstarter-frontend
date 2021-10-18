import {Text} from '@chakra-ui/react';
import Countdown from 'react-countdown';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchStarters} from '../../starter.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';

// type YYYY = `19${d}${d}` | `20${d}${d}`;
// type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
// type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;
// type DateYMString = `${YYYY}/${MM}`;
// type DateYMDString = `${DateYMString}/${DD}`;

type DetailCounterProps = {
  numberFontSize?: string;
  stringFontSize?: string;
  date: any;
  style?: any;
  claimStep?: boolean;
};

const trimDigit = (arg: any) => {
  if (String(arg).length === 1) {
    return `0${arg}`;
  }
  return arg;
};

export const DetailCounter: React.FC<DetailCounterProps> = (prop) => {
  const {numberFontSize, stringFontSize, date, style, claimStep} = prop;
  const dispatch = useAppDispatch();
  const {chainId, library} = useActiveWeb3React();

  async function fetchStarter() {
    await dispatch(
      fetchStarters({
        chainId,
        library,
      }) as any,
    );
  }

  //@ts-ignore
  const countDownRenderer = ({days, hours, minutes, seconds, completed}) => {
    if (completed) {
      // Render a completed state
      fetchStarter();
      return null;
    } else {
      // Render a countdown
      return (
        <Text style={{...style}}>
          {days}
          <span
            style={{
              fontSize: stringFontSize || '20px',
              marginRight: '2px',
              ...style,
            }}>
            D
          </span>{' '}
          {trimDigit(hours)}
          <span style={{fontSize: stringFontSize || '20px', ...style}}>H</span>:
          {trimDigit(minutes)}
          <span style={{fontSize: stringFontSize || '20px', ...style}}>M</span>:
          {trimDigit(seconds)}
          <span style={{fontSize: stringFontSize || '20px', ...style}}>
            SEC left
          </span>
        </Text>
      );
    }
  };

  //@ts-ignore
  const claimCountDownRenderer = ({
    //@ts-ignore
    days,
    //@ts-ignore
    hours,
    //@ts-ignore
    minutes,
    //@ts-ignore
    seconds,
    //@ts-ignore
    completed,
  }) => {
    if (completed) {
      // Render a completed state
      fetchStarter();
      return null;
    } else {
      // Render a countdown
      return (
        <Text style={{...style}}>
          {days}
          <span
            style={{
              fontSize: stringFontSize || '20px',
              marginRight: '2px',
              ...style,
            }}>
            D
          </span>{' '}
          {trimDigit(hours)}
          <span style={{fontSize: stringFontSize || '20px', ...style}}>:</span>
          {trimDigit(minutes)}
          <span style={{fontSize: stringFontSize || '20px', ...style}}>:</span>
          {trimDigit(seconds)}
        </Text>
      );
    }
  };

  return (
    <Text color="blue.100" fontSize={numberFontSize}>
      <Countdown
        date={date}
        renderer={
          claimStep === true ? claimCountDownRenderer : countDownRenderer
        }
      />
    </Text>
  );
};
