import {Flex, Text, Button, useColorMode, useTheme,Tooltip, Image} from '@chakra-ui/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useFormikContext} from 'formik';
import {Projects, VaultPublic} from '@Launch/types';
import moment from 'moment';
import tooltipIconGray  from 'assets/svgs/input_question_icon.svg'

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
      <Flex>
      <Text fontSize={'15px'} color={'#0070ed'}>
        {duration.days().toString().length < 2 ? '0' : ''}
        {duration.days()}:{duration.hours().toString().length < 2 ? '0' : ''}
        {duration.hours()}:{duration.minutes().toString().length < 2? '0':''}{duration.minutes()}:
        {duration.seconds().toString().length < 2 ? '0' : ''}
        {duration.seconds()}
      </Text>
      <Tooltip
          label={'All contracts must be deployed before the deadline. If you fail to do so, your project will fail to launch and you will not be able to recover any gas costs incurred.'}
          hasArrow
          fontSize='12px'
          placement="top"
          w='250px'
          color={colorMode === 'light' ? '#e6eaee' : '#424242'}
          aria-label={'Tooltip'}
          textAlign={'center'}
          size={'xs'}>
          <Image  ml='3px' src={tooltipIconGray} />
        </Tooltip>
      </Flex>
     
    </Flex>
  );
};

export default CountDown;
