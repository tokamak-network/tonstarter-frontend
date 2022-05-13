import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import React from 'react';
import {
  Text,
  Flex,
  NumberInput,
  Box,
  useTheme,
  useColorMode,
  NumberInputField,
  Image,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverBody,
  Select,
  Button,
} from '@chakra-ui/react';
import clock from 'assets/svgs/poll_time_active_icon.svg';
import moment from 'moment';
const themeDesign = {
  border: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #535353',
  },
  font: {
    light: '#86929d',
    dark: '#777777',
  },
  select: {
    light: '#3e495c',
    dark: '#f3f4f1',
  },
  bg: {
    light: 'white.100',
    dark: 'black.200',
  },
};

type ClockProps = {
  setTime: Dispatch<SetStateAction<any>>;
  startTime: number;
  endTime?: number;
  calendarType: string;
};

export const CustomClock = (props: ClockProps) => {
  const {setTime, startTime, endTime, calendarType} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [hours, setHours] = useState<number>(1);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [meridiem, setMeridiem] = useState<string>('AM');

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
    <Flex
      alignItems="center"
      justifyContent={'center'}
      w={'298px'}
      borderTop={
        colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #535353'
      }
      borderBottom={
        colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #535353'
      }
      bg={colorMode === 'light' ? '#FFFFFF' : '#222222'}
      zIndex={1}>
      <Flex
        p={'10px 0px'}
        flexDirection="row"
        alignItems="center"
        justifyContent={'center'}>
        <NumberInput
          maxH={'37px'}
          fontFamily={theme.fonts.roboto}
          maxW={'48px'}
          defaultValue={1}
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
            color={themeDesign.select[colorMode]}
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
          defaultValue={0}
          fontFamily={theme.fonts.roboto}
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
            color={themeDesign.select[colorMode]}
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
          fontFamily={theme.fonts.roboto}
          defaultValue={0}
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
          value={seconds}
          focusBorderColor="transparent">
          <NumberInputField
            fontSize="28px"
            pl={'0px'}
            color={themeDesign.select[colorMode]}
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
          color={themeDesign.select[colorMode]}
          mr={'10px'}
          onChange={(e) => {
            setMeridiem(e.target.value);
          }}>
          <option>AM</option>
          <option>PM</option>
        </Select>
      </Flex>
    </Flex>
  );
};
