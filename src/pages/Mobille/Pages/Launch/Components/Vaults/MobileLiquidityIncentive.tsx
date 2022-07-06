//MobileWtonTosLpReward
import {FC, useState} from 'react';
import {Flex, Box, Text, useColorMode, useTheme} from '@chakra-ui/react';

type LiquidityIncentive = {
    vault: any;
    project: any;
  };
  
export const MobileLiquidityIncentive: FC <LiquidityIncentive> = ({vault, project}) => {
    const theme = useTheme();
  const {colorMode} = useColorMode();
  const [buttonState, setButtonState] = useState('Token');

    return (
        <Flex mt={'35px'} flexDir={'column'} px={'20px'}>
      <Flex
        mx={'auto'}
        mb={'20px'}
        fontFamily={theme.fonts.fld}
        fontSize="13px"
        alignItems={'center'}>
        <Text
          px={'12px'}
          _active={{color: colorMode === 'light' ? '#304156' : '#ffffff'}}
          onClick={() => setButtonState('Token')}
          fontWeight={buttonState === 'Token' ? 'bold' : 'normal'}
          color={
            buttonState === 'Token'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }>
          Token
        </Text>
        <Box
          h={'9px'}
          w={'1px'}
          border={
            colorMode === 'light'
              ? '0.5px solid #d7d9df'
              : '0.5px solid #373737'
          }></Box>
        <Text
          px={'12px'}
          fontWeight={buttonState === 'Schedule' ? 'bold' : 'normal'}
          color={
            buttonState === 'Schedule'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Schedule')}>
          Schedule
        </Text>
        </Flex>
        </Flex>
    )
}