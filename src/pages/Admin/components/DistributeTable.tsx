import {FC, useRef, useEffect, useState} from 'react';
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
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {LoadingComponent} from 'components/Loading';
import {CustomButton} from 'components/Basic/CustomButton';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import AdminActions from '../actions';
import {FetchPoolData} from '@Admin/types';
import moment from 'moment';
import {useBlockNumber} from 'hooks/useBlock';
import {DEPLOYED} from 'constants/index';
import {useERC20Token} from 'hooks/useERC20Token';
import {convertNumber, convertToRay, convertToWei} from 'utils/number';
import * as ERC20 from 'services/abis/ERC20.json';

export const DistributeTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {account, library} = useActiveWeb3React();
  const {TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS, DOC_ADDRESS} = DEPLOYED;

  const [timeStamp, setTimeStamp] = useState<string>('');
  const [distributions, setDistributions] = useState<any[]>([]);
  const [distributedTosAmount, setDistributedTosAmount] = useState<any>();

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
    scheduleColor: {
      light: '#808992',
      dark: '#9d9ea5',
    },
    dateColor: {
      light: '#353c48',
      dark: '#f3f4f1',
    },
  };

  useEffect(() => {
    async function getDistributedTosAmount() {
      if (!account) {
        return;
      }
      const distributedTosAmt = await AdminActions.getDistributedTosAmount({
        account,
        library,
      });
      console.log('distributedTosAmt: ', distributedTosAmount);
      setDistributedTosAmount(distributedTosAmt);
    }
    if (account) {
      getDistributedTosAmount();
    } else {
      setDistributedTosAmount('0.00');
    }
  }, [account, library]);

  useEffect(() => {
    //GET NEXT THUR
    const dayINeed = 4; // for Thursday
    const today = moment().isoWeekday();
    const thisWed = moment().isoWeekday(dayINeed).format('YYYY-MM-DD');
    const nextWed = moment().add(1, 'weeks').isoWeekday(dayINeed).format('LL');
    if (today === dayINeed || today < dayINeed) {
      return setTimeStamp(thisWed);
    } else {
      return setTimeStamp(nextWed);
    }
  }, []);

  return (
    <Flex flexDirection={'column'} w={'976px'} p={'0px'} mt={'50px'}>
      <Flex alignItems={'center'} justifyContent={'space-between'} mb={'20px'}>
        <Flex alignItems={'baseline'}>
          <Heading size="md" mr={'10px'}>
            Token List
          </Heading>
          <Flex>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize={'13px'}
              color={themeDesign.scheduleColor[colorMode]}
              mr={'3px'}>
              schedule:
            </Text>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize={'13px'}
              color={themeDesign.dateColor[colorMode]}>
              {' '}
              Next(Thu.) {timeStamp} 00:00:00 (UTC)
            </Text>
          </Flex>
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
          _hover={{background: 'transparent'}}
          onClick={() =>
            dispatch(
              openModal({
                type: 'Airdrop_Distribute',
                data: {
                  test: 'data',
                },
              }),
            )
          }>
          Distribute
        </Button>
      </Flex>
      {distributions.length === 0 ? (
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          w={'100%'}
          py={'30px'}
          fontFamily={theme.fonts.fld}
          fontSize={'16px'}
          borderY={themeDesign.border[colorMode]}>
          <Text>No distributions scheduled this round.</Text>
        </Flex>
      ) : (
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
      )}
    </Flex>
  );
};
