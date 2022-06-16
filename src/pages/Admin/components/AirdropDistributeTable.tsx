import {useEffect, useState} from 'react';
import {
  Text,
  Flex,
  useColorMode,
  useTheme,
  Button,
  Heading,
  GridItem,
  Grid,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import {LoadingComponent} from 'components/Loading';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import moment from 'moment';
import useAirdropList from '@Dao/hooks/useAirdropList';
import commafy from 'utils/commafy';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';

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

export const AirdropDistributeTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [timeStamp, setTimeStamp] = useState<string>('');
  const [distributedTosTokens, setDistributedTosTokens] = useState<any[]>([]);

  const [loadingData, setLoadingData] = useState<boolean>(true);
  const {airdropList} = useAirdropList();

  useEffect(() => {
    setLoadingData(false);
    setDistributedTosTokens(airdropList);
  }, [airdropList]);

  useEffect(() => {
    console.log(distributedTosTokens);
  }, [distributedTosTokens]);

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

  return loadingData ? (
    <Flex
      alignItems={'center'}
      mt={'50px'}
      justifyContent={'center'}
      w={'100%'}>
      <LoadingComponent />
    </Flex>
  ) : (
    <Flex flexDirection={'column'} w={'976px'} p={'0px'} mt={'50px'}>
      <Flex alignItems={'end'} justifyContent={'space-between'} mb={'20px'}>
        <Flex alignItems={'baseline'} flexDirection={'column'} ml={'14px'}>
          <Heading size="md" mb={'26px'}>
            Token List
          </Heading>
          <Flex mr={'3px'}>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize={'13px'}
              color={themeDesign.scheduleColor[colorMode]}
              mr={'3px'}>
              sTOS Holder Schedule :
            </Text>
            <Text
              fontFamily={theme.fonts.roboto}
              fontSize={'13px'}
              mr={'7px'}
              color={themeDesign.dateColor[colorMode]}>
              {' '}
              Next(Thu.) {timeStamp} 00:00:00 (UTC)
            </Text>
            <Tooltip
              hasArrow
              placement="top"
              label="sTOS Holder distributions follow the schedule displayed, whereas TON Holder distributions happen immediately."
              color={theme.colors.white[100]}
              bg={theme.colors.gray[375]}>
              <Image src={tooltipIcon} />
            </Tooltip>
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
          // _hover={{background: 'transparent'}}
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
      {distributedTosTokens.length === 0 ? (
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
            fontSize={'12px'}
            padding={'16px 35px'}
            height={'45px'}
            fontFamily={theme.fonts.roboto}>
            <Text
              fontSize={'12px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}
              minWidth={'33%'}
              textAlign={'center'}>
              Distribute To
            </Text>
            <Text minWidth={'33%'} textAlign={'center'} fontSize={'12px'}>
              Token Symbol
            </Text>
            <Text minWidth={'33%'} textAlign={'center'} fontSize={'12px'}>
              Amount
            </Text>
          </GridItem>
          {distributedTosTokens?.map((token: any, index: number) => {
            if (token.amount === '0.00') {
              return null;
            }
            return (
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={index === airdropList?.length - 1 ? '' : 'none'}
                borderBottomRadius={
                  index === airdropList?.length - 1 ? '4px' : ''
                }
                className={'chart-cell'}
                fontSize={'16px'}
                fontFamily={theme.fonts.fld}
                d={'flex'}
                justifyContent={'center'}>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : 'white.0'}
                  minWidth={'33%'}
                  textAlign={'center'}>
                  sTOS Holder
                </Text>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : 'white.0'}
                  minWidth={'33%'}
                  textAlign={'center'}>
                  {token.tokenName}
                </Text>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : 'white.0'}
                  minWidth={'33%'}
                  textAlign={'center'}>
                  {commafy(token.amount)}
                </Text>
              </GridItem>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
};
