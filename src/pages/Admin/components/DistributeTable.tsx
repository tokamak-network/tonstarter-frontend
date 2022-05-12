import {FC, useRef} from 'react';
import {
  Text,
  Flex,
  Select,
  Box,
  useColorMode,
  Center,
  useTheme,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Heading,
  GridItem,
  Grid,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {LoadingComponent} from 'components/Loading';
import {CustomButton} from 'components/Basic/CustomButton';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import AdminActions from '../actions';
import {FetchPoolData} from '@Admin/types';

export const DistributeTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: '#2a72e5',
      dark: '#2a72e5',
    },
    borderTos: {
      light: 'dashed 1px #dfe4ee',
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
    <Flex flexDirection={'column'} w={'976px'} p={'0px'} mt={'50px'}>
      <Flex alignItems={'center'} justifyContent={'space-between'} mb={'20px'}>
        <Flex>
          <Heading size="md" mr={'10px'}>
            Token List
          </Heading>
          <Text> schedule: Next(Thu.) Apr.07, 2022 00:00:00 (UTC) </Text>
        </Flex>
        <Button
          color={themeDesign.tosFont[colorMode]}
          border={themeDesign.borderTos[colorMode]}
          height={'32px'}
          width={'100px'}
          padding={'9px 23px 8px'}
          borderRadius={'4px'}
          fontSize={'13px'}
          fontFamily={theme.fonts.roboto}
          background={'transparent'}
          _hover={{background: 'transparent'}}>
          Claim All
        </Button>
      </Flex>
      <Grid templateColumns="repeat(1, 1fr)" w={'100%'} mb={'30px'}>
        <GridItem
          border={themeDesign.border[colorMode]}
          className={'chart-cell'}
          borderTopLeftRadius={'4px'}
          borderBottom={'none'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}>
          <Text
            fontSize={'15px'}
            fontWeight={'bolder'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            Distribute To
          </Text>
          <Text minWidth={'33%'} textAlign={'center'}>
            Token Symbol
          </Text>
          <Text minWidth={'33%'} textAlign={'center'}>
            Amount
          </Text>
        </GridItem>

        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            1,000,000
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            1,000,000
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            1,000,000
          </Text>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottomLeftRadius={'4px'}
          borderBottomRightRadius={'4px'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'33%'}
            textAlign={'center'}>
            1,000,000
          </Text>
        </GridItem>
        {/* <GridItem
          border={themeDesign.border[colorMode]}
          className={'chart-cell'}
          fontFamily={theme.fonts.fld}
          borderBottomRightRadius={'4px'}>
          <Flex flexDir={'column'}>
            <Text color={colorMode === 'light' ? '#9d9ea5' : '#7e8993'}>
              You can distribute on
            </Text>
            <Text color={colorMode === 'light' ? '#353c48' : 'white.0'}>
              10:00
            </Text>
          </Flex>
        </GridItem> */}
      </Grid>
    </Flex>
  );
};
