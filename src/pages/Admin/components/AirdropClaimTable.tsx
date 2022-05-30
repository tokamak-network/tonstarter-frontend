import {FC, useRef, useState, useEffect} from 'react';
import {
  Text,
  Flex,
  Select,
  Box,
  useColorMode,
  Center,
  useTheme,
  Checkbox,
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
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import moment from 'moment';
import {useBlockNumber} from 'hooks/useBlock';
import {convertNumber} from 'utils/number';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {fetchAirdropPayload} from '../../../components/Airdrop/utils/fetchAirdropPayload';
import * as TOKENDIVIDENDPOOLPROXY from 'services/abis/TokenDividendProxyPool.json';

type Round = {
  allocatedAmount: string;
  amount: string;
  roundNumber: number;
  myAmount: string;
};

type AirDropList = [Round] | undefined;

export const AirdropClaimTable = () => {
  const {blockNumber} = useBlockNumber();
  const {account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState<any[]>([]);
  const [airdropData, setAirdropData] = useState<AirDropList>(undefined);
  const [genesisAirdropBalance, setGenesisAirdropBalance] = useState<
    string | undefined
  >(undefined);
  const [airdropList, setAirdropList] = useState<
    {tokenName: string; amount: string}[] | undefined
  >(undefined);
  const dispatch = useDispatch();
  const {LockTOSDividend_ADDRESS, TokenDividendProxyPool_ADDRESS} = DEPLOYED;
  const LOCKTOS_DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
  );
  const TOKEN_DIVIDEND_PROXY_POOL_CONTRACT = new Contract(
    TokenDividendProxyPool_ADDRESS,
    TOKENDIVIDENDPOOLPROXY.abi,
    library,
  );

  const dummyData = [
    {
      id: '1',
      tokenSymbol: 'TON',
    },
    {
      id: '2',
      tokenSymbol: 'TOS',
    },
    {
      id: '3',
      tokenSymbol: 'DOC',
    },
    {
      id: '4',
      tokenSymbol: 'WTON',
    },
    {
      id: '5',
      tokenSymbol: 'WTON',
    },
    {
      id: '6',
      tokenSymbol: 'WTON',
    },
  ];
  const [list, setList] = useState<any[]>(dummyData);

  console.log(
    'TOKEN_DIVIDEND_PROXY_POOL_CONTRACT',
    TOKEN_DIVIDEND_PROXY_POOL_CONTRACT,
  );

  useEffect(() => {
    async function getClaimableAirdropAmounts() {
      if (account === undefined || account === null) {
        return;
      }
      const res = await TOKEN_DIVIDEND_PROXY_POOL_CONTRACT.getAvailableClaims(
        account,
      );
      console.log('res: ', res);

      // if (res === undefined) {
      //   return;
      // }
      // const {roundInfo, claimedAmount, unclaimedAmount} = res;
      // console.log('res: ', res);
      // setAirdropData(roundInfo);
      // availableGenesisAmount(roundInfo, claimedAmount, unclaimedAmount);
    }
    if (account !== undefined && library !== undefined) {
      getClaimableAirdropAmounts();
    }
    /*eslint-disable*/
  }, [account]);

  useEffect(() => {
    async function callAirDropData() {
      if (account === undefined || account === null) {
        return;
      }
      const res = await fetchAirdropPayload(account, library);
      if (res === undefined) {
        return;
      }
      const {roundInfo, claimedAmount, unclaimedAmount} = res;
      console.log('res: ', res);
      setAirdropData(roundInfo);
      availableGenesisAmount(roundInfo, claimedAmount, unclaimedAmount);
    }
    if (account !== undefined && library !== undefined) {
      callAirDropData();
    }
    /*eslint-disable*/
  }, [account]);

  const availableGenesisAmount = (
    roundInfo: AirDropList,
    claimedAmount: string | undefined,
    unclaimedAmount: string | undefined,
  ) => {
    if (roundInfo !== undefined && claimedAmount !== undefined) {
      return setGenesisAirdropBalance(unclaimedAmount);
    }
  };

  // const fetchData = async () => {
  //   let claimableTokens = [];
  //   let isError = false;
  //   let i = 0;

  //   console.log('isError: ', isError);

  //   do {
  //     try {
  //       const tokenAddress = await LOCKTOS_DIVIDEND_CONTRACT?.distributedTokens(
  //         i,
  //       );
  //       claimableTokens.push(tokenAddress);
  //       i++;
  //     } catch (e) {
  //       isError = true;
  //     }
  //   } while (isError === false);

  //   const tokens = claimableTokens;
  //   const nowTimeStamp = moment().unix();
  //   const result: {tokenName: string; amount: string}[] = await Promise.all(
  //     tokens.map(async (token: string) => {
  //       const tokenAmount = await LOCKTOS_DIVIDEND_CONTRACT?.tokensPerWeekAt(
  //         token,
  //         nowTimeStamp,
  //       );
  //       const ERC20_CONTRACT = new Contract(token, ERC20.abi, library);
  //       const tokenSymbol = await ERC20_CONTRACT.symbol();
  //       return {
  //         tokenName: tokenSymbol,
  //         amount: convertNumber({amount: tokenAmount.toString()}) as string,
  //       };
  //     }),
  //   );
  //   return setAirdropList(result);
  // };

  // useEffect(() => {
  //   fetchData();
  //   /*eslint-disable*/
  // }, [blockNumber]);

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

  const handleSelectAll = (e: any) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = (e: any) => {
    const {id, checked} = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  return (
    <Flex flexDirection={'column'} w={'976px'} p={'0px'} mt={'50px'}>
      <Flex alignItems={'center'} justifyContent={'space-between'} mb={'20px'}>
        <Text
          fontSize={'20px'}
          fontFamily={theme.fonts.roboto}
          color={themeDesign.font[colorMode]}
          ml={'20px'}
          height={'32px'}
          width={'150px'}
          fontWeight={'500'}
          padding={'3px 23px 8px'}>
          Token List
        </Text>
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
          // onClick={() =>
          //   dispatch(
          //     openModal({
          //       type: 'Airdrop_Claim',
          //       data: {
          //         test: 'data',
          //       },
          //     }),
          //   )
          // }
          _hover={{background: 'transparent'}}>
          Claim All
        </Button>
      </Flex>
      <Grid
        templateColumns="repeat(1, 1fr)"
        w={'100%'}
        bg={themeDesign.bg[colorMode]}>
        <GridItem
          border={themeDesign.border[colorMode]}
          className={'chart-cell'}
          borderTopLeftRadius={'6px'}
          borderTopRightRadius={'6px'}
          borderBottom={'none'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}>
          <Flex minWidth={'10%'}>
            <Checkbox
              fontWeight={'bold'}
              fontSize={'14px'}
              h={'45px'}
              left={'5%'}
              onChange={handleSelectAll}
            />
          </Flex>

          <Text minWidth={'35%'} textAlign={'center'}>
            Token Symbol
          </Text>
          <Text minWidth={'35%'} textAlign={'center'}>
            Amount
          </Text>
          <Text
            fontSize={'15px'}
            fontWeight={'bolder'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            Action
          </Text>
        </GridItem>
      </Grid>

      {console.log('airdropData: ', airdropData)}
      {console.log('genesisAirdropBalance: ', genesisAirdropBalance)}
      {console.log('airdropList: ', airdropList)}

      {dummyData.map((data: any, index: number) => {
        const {id, tokenSymbol} = data;
        return (
          <Grid
            templateColumns="repeat(1, 1fr)"
            w={'100%'}
            bg={themeDesign.bg[colorMode]}>
            <GridItem
              border={themeDesign.border[colorMode]}
              // borderBottom={index === dummyData.length - 1 ? '' : 'none'}
              className={'chart-cell'}
              fontSize={'16px'}
              fontFamily={theme.fonts.fld}
              d={'flex'}
              justifyContent={'center'}>
              <Flex minWidth={'10%'}>
                <Checkbox
                  key={id}
                  type="checkbox"
                  name={tokenSymbol}
                  id={id}
                  onChange={handleClick}
                  isChecked={isCheck.includes(id)}
                  fontWeight={'bold'}
                  fontSize={'14px'}
                  h={'45px'}
                  left={'5%'}
                />
              </Flex>
              <Text
                fontSize={'15px'}
                color={colorMode === 'light' ? '#353c48' : 'white.0'}
                minWidth={'35%'}
                textAlign={'center'}>
                {tokenSymbol}
              </Text>
              <Text
                fontSize={'15px'}
                color={colorMode === 'light' ? '#353c48' : 'white.0'}
                minWidth={'35%'}
                textAlign={'center'}>
                1,000,000
              </Text>
              <Flex minWidth={'20%'} justifyContent={'center'}>
                <Button
                  w={'100px'}
                  h={'38px'}
                  p={'7px 33px'}
                  border={'solid 1px #2a72e5'}
                  borderRadius={'3px'}
                  fontSize={'14px'}
                  fontFamily={theme.fonts.fld}
                  bg={'#2a72e5'}
                  color={'#fff'}
                  _hover={{
                    background: 'transparent',
                    border: 'solid 1px #2a72e5',
                    color: themeDesign.fontColorTitle[colorMode],
                    cursor: 'pointer',
                  }}
                  _active={{}}
                  onClick={() =>
                    dispatch(
                      openModal({
                        type: 'Airdrop_Claim',
                        data: {
                          genesisAirdropBalance: genesisAirdropBalance,
                          tokenSymbol: tokenSymbol,
                        },
                      }),
                    )
                  }>
                  Claim
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        );
      })}

      {/* <GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Checkbox
            minWidth={'20%'}
            fontWeight={'bold'}
            fontSize={'14px'}
            h={'45px'}
            left={'9%'}
            onChange={() => console.log('hello')}
          />
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            TOS
          </Text>
          <Text
            fontSize={'15px'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            minWidth={'20%'}
            textAlign={'center'}>
            {genesisAirdropBalance}
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
              }}
              onClick={() =>
                dispatch(
                  openModal({
                    type: 'Airdrop_Claim',
                    data: {
                      test: 'data',
                    },
                  }),
                )
              }>
              Claim
            </Button>
          </Flex>
        </GridItem> */}
      {/*<GridItem
          border={themeDesign.border[colorMode]}
          borderBottom={'none'}
          className={'chart-cell'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          d={'flex'}
          justifyContent={'center'}>
          <Checkbox
            minWidth={'20%'}
            fontWeight={'bold'}
            fontSize={'14px'}
            h={'45px'}
            left={'9%'}
            onChange={() => console.log('hello')}
          />
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
          <Checkbox
            minWidth={'20%'}
            fontWeight={'bold'}
            fontSize={'14px'}
            h={'45px'}
            left={'9%'}
            onChange={() => console.log('hello')}
          />
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
        </GridItem> */}

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
    </Flex>
  );
};
