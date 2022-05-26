import {useState, useEffect} from 'react';
import {
  Text,
  Flex,
  useColorMode,
  useTheme,
  Checkbox,
  Grid,
  GridItem,
  Button,
} from '@chakra-ui/react';
import {LoadingComponent} from 'components/Loading';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import moment from 'moment';
import AdminActions from '@Admin/actions';
import {useBlockNumber} from 'hooks/useBlock';
import {convertNumber} from 'utils/number';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {fetchAirdropPayload} from '../../../components/Airdrop/utils/fetchAirdropPayload';
import * as TOKENDIVIDENDPOOLPROXY from 'services/abis/TokenDividendProxyPool.json';
import {ethers} from 'ethers';
import {TonStaker} from '@Launch/components/Projects/TonStaker';

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
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isCheck, setIsCheck] = useState<any[]>([]);
  const [airdropData, setAirdropData] = useState<any[]>([]);
  const [checkedTokenAddresses, setCheckedTokenAddresses] = useState<any[]>([]);
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

  useEffect(() => {
    async function getClaimableAirdropTonAmounts() {
      if (account === undefined || account === null) {
        return;
      }
      const tonRes =
        await TOKEN_DIVIDEND_PROXY_POOL_CONTRACT.getAvailableClaims(account);

      const tosRes =
        await TOKEN_DIVIDEND_PROXY_POOL_CONTRACT.getAvailableClaims(account);

      if (tonRes === undefined && tosRes === undefined) {
        return;
      }

      const {claimableAmounts, claimableTokens} = tonRes;
      const tosClaimableAmounts = tosRes.claimableAmounts;
      const tosClaimableTokens = tosRes.tosClaimableTokens;

      let claimableArr: any[] = [];
      if (claimableAmounts.length > 0 && claimableTokens) {
        await Promise.all(
          claimableTokens.map(async (tokenAddress: string, idx: number) => {
            const ERC20_CONTRACT = new Contract(
              tokenAddress,
              ERC20.abi,
              library,
            );
            let tokenSymbol = await ERC20_CONTRACT.symbol();
            claimableArr.push({
              address: tokenAddress,
              amount: claimableAmounts[idx],
              tokenSymbol: tokenSymbol,
              id: idx,
              tonStaker: true,
            });
          }),
        );
      }
      if (tosClaimableAmounts.length > 0 && tosClaimableTokens) {
        await Promise.all(
          tosClaimableTokens.map(async (tokenAddress: string, idx: number) => {
            const ERC20_CONTRACT = new Contract(
              tokenAddress,
              ERC20.abi,
              library,
            );
            let tokenSymbol = await ERC20_CONTRACT.symbol();
            claimableArr.push({
              address: tokenAddress,
              amount: tosClaimableAmounts[idx],
              tokenSymbol: tokenSymbol,
              id: idx,
              tosStaker: true,
            });
          }),
        );
      }

      const sortedArr = claimableArr.sort((a, b) => a.id - b.id);
      console.log('sortedArr: ', sortedArr);
      setLoadingData(false);
      setAirdropData(sortedArr);
      // availableGenesisAmount(roundInfo, claimedAmount, unclaimedAmount);
    }
    if (account !== undefined && library !== undefined) {
      getClaimableAirdropTonAmounts();
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
    setIsCheck(airdropData.map((data) => String(data.id)));
    setCheckedTokenAddresses(airdropData.map((data) => data.address));

    if (isCheckAll) {
      setIsCheck([]);
      setCheckedTokenAddresses([]);
    }
  };

  const handleClick = (e: any) => {
    const {id, checked, value} = e.target;
    let tempCheckedAddresses = checkedTokenAddresses;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
    if (!checkedTokenAddresses.includes(value)) {
      tempCheckedAddresses.push(value);
    } else if (checkedTokenAddresses.includes(value)) {
      tempCheckedAddresses = tempCheckedAddresses.filter(
        (address) => address !== value,
      );
    }
    setCheckedTokenAddresses(tempCheckedAddresses);
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
          disabled={checkedTokenAddresses.length < 1}
          onClick={() => {
            account &&
              AdminActions.claimMultipleTokens({
                account,
                library,
                addresses: checkedTokenAddresses,
              });
          }}
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

      {loadingData || !airdropData ? (
        <Flex
          alignItems={'center'}
          mt={'50px'}
          justifyContent={'center'}
          w={'100%'}>
          <LoadingComponent />
        </Flex>
      ) : (
        airdropData.map((data: any, index: number) => {
          const {id, address, amount, tokenSymbol, tonStaker, tosStaker} = data;
          const formattedAmt = Number(ethers.utils.formatEther(amount)).toFixed(
            2,
          );
          return (
            <Grid
              templateColumns="repeat(1, 1fr)"
              w={'100%'}
              bg={themeDesign.bg[colorMode]}>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={index === airdropData?.length - 1 ? '' : 'none'}
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
                    isChecked={isCheck.includes(String(index))}
                    fontWeight={'bold'}
                    fontSize={'14px'}
                    h={'45px'}
                    left={'5%'}
                    value={address}
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
                  {formattedAmt}
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
                            tokenAddress: address,
                            amount: formattedAmt,
                            tonStaker: tonStaker,
                            tosStaker: tosStaker,
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
        })
      )}
    </Flex>
  );
};
