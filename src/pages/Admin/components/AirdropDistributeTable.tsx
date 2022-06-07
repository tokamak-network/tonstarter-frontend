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
import {Contract} from '@ethersproject/contracts';
import {LoadingComponent} from 'components/Loading';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import AdminActions from '../actions';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {convertNumber} from 'utils/number';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as TokenDividendProxyPool from 'services/abis/TokenDividendProxyPool.json';
import useAirdropList from '@Dao/hooks/useAirdropList';
import {ethers} from 'ethers';
import commafy from 'utils/commafy';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';

// type AirdropTokenList = {tokenName: string; amount: string}[];

export const AirdropDistributeTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const dispatch = useDispatch();
  const {account, library} = useActiveWeb3React();
  const {WTON_ADDRESS, LockTOSDividend_ADDRESS} = DEPLOYED;

  const [timeStamp, setTimeStamp] = useState<string>('');
  const [distributedTonTokens, setDistributedTonTokens] = useState<any[]>([]);
  const [distributedTosTokens, setDistributedTosTokens] = useState<any[]>([]);

  // const [distributedTosAmount, setDistributedTosAmount] = useState<any>();
  // const [distributedTonAmount, setDistributedTonAmount] = useState<any>();
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const {airdropList} = useAirdropList();

  useEffect(() => {
    let temp: {tokenName: string; amount: string}[] = [];
    airdropList?.map((tokenInfo: any) => {
      if (tokenInfo.amount !== '0.00') {
        return temp.push(tokenInfo);
      }
    });
  }, [airdropList]);

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
    async function getAllTonDistributedTokens() {
      if (!account) {
        return;
      }

      const {TokenDividendProxyPool_ADDRESS} = DEPLOYED;

      const TOKEN_DIVIDEND_PROXY_CONTRACT = new Contract(
        TokenDividendProxyPool_ADDRESS,
        TokenDividendProxyPool.abi,
        library,
      );

      let distributedTokens: any[] = [];
      let distributedTokenInfo: any[] = [];
      let undefinedToken = false;
      let index = 0;

      try {
        while (!undefinedToken) {
          let tempToken = await TOKEN_DIVIDEND_PROXY_CONTRACT.distributedTokens(
            index,
          );
          distributedTokens.push(tempToken);
          index++;
        }
      } catch (e) {
        undefinedToken = true;
      }

      if (distributedTokens.length > 0) {
        await Promise.all(
          distributedTokens.map(async (tokenAddress: string) => {
            const ERC20_CONTRACT = new Contract(
              tokenAddress,
              ERC20.abi,
              library,
            );
            let tokenSymbol = await ERC20_CONTRACT.symbol();
            let tonHolderAmount =
              await TOKEN_DIVIDEND_PROXY_CONTRACT.distributions(tokenAddress);

            let formattedTonAmount =
              tokenAddress === WTON_ADDRESS
                ? convertNumber({
                    amount: tonHolderAmount.totalDistribution,
                    type: 'ray',
                  })
                : ethers.utils.formatEther(tonHolderAmount.totalDistribution);

            distributedTokenInfo.push({
              symbol: tokenSymbol,
              address: tokenAddress,
              tonHolderAmount: Number(formattedTonAmount).toFixed(2),
            });
          }),
        );
      }
      const filteredTonTokenList = distributedTokenInfo.filter(
        (token) => token.tonHolderAmount !== '0.00',
      );
      setDistributedTonTokens(filteredTonTokenList);
      setLoadingData(false);
    }
    getAllTonDistributedTokens();
  }, [account, library]);

  useEffect(() => {
    async function getAllTosDistributedTokens() {
      if (!account) {
        return;
      }

      const {LockTOSDividend_ADDRESS} = DEPLOYED;

      const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
        LockTOSDividend_ADDRESS,
        LockTOSDividendABI.abi,
        library,
      );

      let distributedTokens: any[] = [];
      let distributedTokenTosInfo: any[] = [];
      let undefinedToken = false;
      let index = 0;

      try {
        while (!undefinedToken) {
          let tempToken = await LOCKTOS_DIVIDEND_CONTRACT.distributedTokens(
            index,
          );
          distributedTokens.push(tempToken);
          index++;
        }
      } catch (e) {
        undefinedToken = true;
      }

      if (distributedTokens.length > 0) {
        await Promise.all(
          distributedTokens.map(async (tokenAddress: string) => {
            const ERC20_CONTRACT = new Contract(
              tokenAddress,
              ERC20.abi,
              library,
            );
            let tokenSymbol = await ERC20_CONTRACT.symbol();

            let tosHolderAmount = await LOCKTOS_DIVIDEND_CONTRACT.distributions(
              tokenAddress,
            );

            let formattedTosAmount =
              tokenAddress === WTON_ADDRESS
                ? convertNumber({
                    amount: tosHolderAmount.totalDistribution,
                    type: 'ray',
                  })
                : ethers.utils.formatEther(tosHolderAmount.totalDistribution);

            distributedTokenTosInfo.push({
              symbol: tokenSymbol,
              address: tokenAddress,
              tosHolderAmount: Number(formattedTosAmount).toFixed(2),
            });
          }),
        );
      }
      const filteredTosTokenList = distributedTokenTosInfo.filter(
        (token) => token.tosHolderAmount !== '0.00',
      );

      setDistributedTosTokens(filteredTosTokenList);
      setLoadingData(false);
    }
    getAllTosDistributedTokens();
  }, [account, library]);

  // useEffect(() => {
  //   async function getDistributedTosAmount() {
  //     if (!account) {
  //       return;
  //     }
  //     const distributedTosAmt = await AdminActions.getDistributedTosAmount({
  //       account,
  //       library,
  //     });
  //     console.log('distributedTosAmt: ', distributedTosAmount);
  //     setDistributedTosAmount(distributedTosAmt);
  //   }
  //   if (account) {
  //     getDistributedTosAmount();
  //   } else {
  //     setDistributedTosAmount('0.00');
  //   }
  // }, [account, library]);

  // useEffect(() => {
  //   async function getDistributedTonAmount() {
  //     if (!account) {
  //       return;
  //     }
  //     const distributedTonAmt = await AdminActions.getDistributedTonAmount({
  //       account,
  //       library,
  //     });
  //     console.log('distributedTonAmt: ', distributedTonAmount);
  //     setDistributedTonAmount(distributedTonAmt);
  //   }
  //   if (account) {
  //     getDistributedTonAmount();
  //   } else {
  //     setDistributedTonAmount('0.00');
  //   }
  // }, [account, library]);

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
              schedule:
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
      {distributedTonTokens.length === 0 ? (
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
            padding={'16px 35px'}
            height={'45px'}
            fontFamily={theme.fonts.fld}>
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
          {/* {distributedTonTokens.map((token: any, index: number) => {
            return (
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={
                  index === distributedTonTokens?.length - 1 ||
                  distributedTosTokens.length > 0
                    ? ''
                    : 'none'
                }
                className={'chart-cell'}
                d={'flex'}
                justifyContent={'center'}>
                <Text
                  fontSize={'12px'}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'33%'}
                  textAlign={'center'}
                  fontFamily={theme.fonts.roboto}>
                  TON Holder
                </Text>
                <Text
                  fontSize={'12px'}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'33%'}
                  textAlign={'center'}
                  fontFamily={theme.fonts.roboto}>
                  {token.symbol}
                </Text>
                <Text
                  fontSize={'12px'}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'33%'}
                  textAlign={'center'}
                  fontFamily={theme.fonts.roboto}>
                  {commafy(token.tonHolderAmount)}
                </Text>
              </GridItem>
            );
          })} */}
          {distributedTosTokens.map((token: any, index: number) => {
            return (
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={
                  index === distributedTosTokens?.length - 1 ? '' : 'none'
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
                  {token.symbol}
                </Text>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : 'white.0'}
                  minWidth={'33%'}
                  textAlign={'center'}>
                  {commafy(token.tosHolderAmount)}
                </Text>
              </GridItem>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
};
