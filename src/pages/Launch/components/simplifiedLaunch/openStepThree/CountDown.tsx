import {Flex, Text, Button, useColorMode, useTheme} from '@chakra-ui/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useFormikContext} from 'formik';
import {Projects, VaultPublic} from '@Launch/types';
import moment from 'moment';

const CountDown = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  const publicVault = values.vaults[0] as VaultPublic;

  const snapshot = publicVault.snapshot;
  const calculateDuration = (snapshot: number) =>
    moment.duration(
      Math.max(snapshot - Math.floor(Date.now() / 1000), 0),
      'seconds',
    );
  const [duration, setDuration] = useState(
    calculateDuration(snapshot ? snapshot : 0),
  );

  const timerCallback = useCallback(() => {
    setDuration(calculateDuration(snapshot ? snapshot : 0));
  }, [snapshot]);

  useEffect(() => {
    const interval = setInterval(timerCallback, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [snapshot]);

  return (
    <Flex
      flexDir={'column'}
      fontSize="13px"
      justifyContent={'center'}
      alignItems="center">
      <Text color={colorMode === 'light' ? '#304156' : '#ffffff'}>
        Deadline
      </Text>
      <Text fontSize={'15px'} color={'#0070ed'}>
        {duration.days().toString().length < 2 ? '0' : ''}
        {duration.days()}:{duration.hours().toString().length < 2 ? '0' : ''}
        {duration.hours()}:{duration.minutes()}:
        {duration.seconds().toString().length < 2 ? '0' : ''}
        {duration.seconds()}
      </Text>
    </Flex>
  );
};

export default CountDown;
