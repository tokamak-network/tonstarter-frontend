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
  Grid,
  GridItem,
  Heading,
  Button,
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

export const AirdropClaimTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const themeDesign = {
    fontColorTitle: {
      light: 'gray.250',
      dark: 'white.100',
    },
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
        <Heading size="md" mr={'10px'}>
          Token List
        </Heading>
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
          <Text minWidth={'20%'} textAlign={'center'}>
            Checkbox
          </Text>
          <Text minWidth={'20%'} textAlign={'center'}>
            Token Symbol
          </Text>
          <Text minWidth={'20%'} textAlign={'center'}>
            Amount
          </Text>
          <Text
            fontSize={'15px'}
            fontWeight={'bolder'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'40%'}
            textAlign={'center'}>
            Action
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
          <Text minWidth={'20%'} textAlign={'center'}>
            Checkbox
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Flex minWidth={'40%'} justifyContent={'center'}>
            <Button
              w={'160px'}
              h={'38px'}
              bg={'transparent'}
              border={themeDesign.border[colorMode]}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'14px'}
              fontFamily={theme.fonts.fld}
              color={themeDesign.fontColorTitle[colorMode]}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.fontColorTitle[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}>
              Airdrop Claim
            </Button>
          </Flex>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Text minWidth={'20%'} textAlign={'center'}>
            Checkbox
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Flex minWidth={'40%'} justifyContent={'center'}>
            <Button
              w={'160px'}
              h={'38px'}
              bg={'transparent'}
              border={themeDesign.border[colorMode]}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'14px'}
              fontFamily={theme.fonts.fld}
              color={themeDesign.fontColorTitle[colorMode]}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.fontColorTitle[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}>
              Airdrop Claim
            </Button>
          </Flex>
        </GridItem>
        <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Text minWidth={'20%'} textAlign={'center'}>
            Checkbox
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Flex minWidth={'40%'} justifyContent={'center'}>
            <Button
              w={'160px'}
              h={'38px'}
              bg={'transparent'}
              border={themeDesign.border[colorMode]}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'14px'}
              fontFamily={theme.fonts.fld}
              color={themeDesign.fontColorTitle[colorMode]}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.fontColorTitle[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}>
              Airdrop Claim
            </Button>
          </Flex>
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
          <Text minWidth={'20%'} textAlign={'center'}>
            Checkbox
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            TOS Holder
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            DOC
          </Text>
          <Flex minWidth={'40%'} justifyContent={'center'}>
            <Button
              w={'160px'}
              h={'38px'}
              bg={'transparent'}
              border={themeDesign.border[colorMode]}
              borderRadius={'3px 0px 0px 3px'}
              fontSize={'14px'}
              fontFamily={theme.fonts.fld}
              color={themeDesign.fontColorTitle[colorMode]}
              _hover={{
                background: 'transparent',
                border: 'solid 1px #2a72e5',
                color: themeDesign.fontColorTitle[colorMode],
                cursor: 'pointer',
              }}
              _active={{
                background: '#2a72e5',
                border: 'solid 1px #2a72e5',
                color: '#fff',
              }}>
              Airdrop Claim
            </Button>
          </Flex>
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
