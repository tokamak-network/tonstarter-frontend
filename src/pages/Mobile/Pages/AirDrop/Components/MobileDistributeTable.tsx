import {useState, useEffect, FC, Dispatch, SetStateAction} from 'react';
import {
  Text,
  Flex,
  useColorMode,
  useTheme,
  Checkbox,
  Grid,
  GridItem,
  Button,
  Radio,
  Stack,
  Box,
  RadioGroup,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';

type DistributeTable = {
  distributedTosTokens: any[]| undefined;
  airdropList: any
};

export const MobileDistributeTable: FC<DistributeTable> = ({
  distributedTosTokens,
  airdropList
}) => {
  const {account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const themeDesign = {
    fontColorTitle: {
      light: 'gray.250',
      dark: 'white.100',
    },
    bg: {
      light: '#fff',
      dark: '#222',
    },
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: '#304156',
      dark: '#fff',
    },
    tosFont: {
      light: '#2a72e5',
      dark: '#2a72e5',
    },
    borderTos: {
      light: 'solid 1px #2a72e5',
      dark: 'solid 1px #2a72e5',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  return (
    <Grid w={'100%'} bg={themeDesign.bg[colorMode]} mt={'12px'}>
      <GridItem
        border={themeDesign.border[colorMode]}
        className={'chart-cell'}
        borderBottom={'none'}
        p={'0px'}
        h={'42px'}
        bg={colorMode === 'light' ? '#ffffff' : '#222222'}
        fontSize={'16px'}
        fontFamily={theme.fonts.roboto}>
        {' '}
     
        <Text
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          w={'50%'}
          textAlign={'center'}
          fontSize={'11px'}
          h={'42px'}
          borderRight={themeDesign.border[colorMode]}>
          Token Symbol
        </Text>
        <Text
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          fontSize={'11px'}
          fontWeight={'bolder'}
          color={colorMode === 'light' ? '#353c48' : 'white.0'}
          w={'50%'}
          textAlign={'center'}>
          Amount
        </Text>
      </GridItem>
      {distributedTosTokens?.map((token: any, index:number) => {
          if (token.amount === '0.00') {
            return null;
          }
        return (
            <GridItem
            bg={(index%2 ===0 )?colorMode==='light'? '#fafbfc':'#262626': colorMode==='light'? '#ffffff':'#222222'}
            border={themeDesign.border[colorMode]}
            borderBottom={
              airdropList && index === airdropList?.length - 1 ? '' : 'none'
            }
            borderBottomRadius={
              airdropList && index === airdropList?.length - 1 ? '4px' : ''
            }
            h={'42px'}
            className={'chart-cell'}
            fontFamily={theme.fonts.fld}
            d={'flex'}
            p={'0px'}
            justifyContent={'center'}
            key={token.tokenName}>
           
            <Text
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}
              w={'50%'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              h={'42px'}
              borderRight={themeDesign.border[colorMode]}
              textAlign={'center'}>
              {token.tokenName}
            </Text>
            <Text
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}
              w={'50%'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              h={'42px'}
           
              textAlign={'center'}>
              {Number(token.amount).toLocaleString()}
            </Text>
          </GridItem>
        )
      })}
    </Grid>
  );
};
