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
  Radio,
  Stack,
  Box,
  RadioGroup,
} from '@chakra-ui/react';
import {LoadingComponent} from 'components/Loading';
import {claimAirdrop} from '../../../components/Airdrop/actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import AdminActions from '@Admin/actions';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {fetchAirdropPayload} from '../../../components/Airdrop/utils/fetchAirdropPayload';
import * as TOKENDIVIDENDPOOLPROXY from 'services/abis/TokenDividendProxyPool.json';
import {ethers} from 'ethers';
import commafy from 'utils/commafy';
import {getClaimalbeList} from '../../Dao/actions';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {convertNumber} from 'utils/number';

type Round = {
  allocatedAmount: string;
  amount: string;
  roundNumber: number;
  myAmount: string;
};

type AirDropList = [Round] | undefined;

export const AirdropClaimTable = () => {
  const { account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [isCheck, setIsCheck] = useState<any[]>([]);
  const [checkedAllBoxes, setCheckedAllBoxes] = useState<boolean>(false);
  const [airdropData, setAirdropData] = useState<any[]>([]);
  const [checkedTokenAddresses, setCheckedTokenAddresses] = useState<any[]>([]);
  const [radioValue, setRadioValue] = useState<string>('DAO Airdrop');
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [tonStakerAirdropTokens, setTonStakerAirdropTokens] = useState<any[]>(
    [],
  );
  const [daoAirdropTokens, setDaoAirdropTokens] = useState<any[]>([]);

  const [genesisAirdropBalance, setGenesisAirdropBalance] = useState<
    string | undefined
  >('');
  const {LockTOSDividend_ADDRESS, TokenDividendProxyPool_ADDRESS} = DEPLOYED;

  const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
    library,
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
        
      const claimList = await getClaimalbeList({account, library});      

      if (tonRes === undefined && claimList === undefined) {
        return;
      }

      const {claimableAmounts, claimableTokens} = tonRes;

      let claimableArr: any[] = [];
      let tempTonStakerArr: any[] = [];
      let tempDaoAirdropArr: any[] = [];

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
      if (claimList) {
        if (claimList?.length > 0) {
          await Promise.all(
            claimList?.map((token: any, idx: number) => {
              claimableArr.push({
                address: token?.tokenAddress,
                amount: token?.claimAmount,
                tokenSymbol: token?.tokenName,
                id: idx,
                tosStaker: true,
              });
            }),
          );
        }
      }
      if (claimableArr.length > 0) {
        // Push to Ton Staker arr
        await Promise.all(
          claimableArr.map((token: any) => {
            if (token.tonStaker === true && token.amount !== '0.00') {
              tempTonStakerArr.push(token);
            }
          }),
        );

        // Push to DAO airdrop arr
        await Promise.all(
          claimableArr.map((token: any) => {
            if (token.tosStaker === true && token.amount !== '0.00') {
              tempDaoAirdropArr.push(token);
            }
          }),
        );
      }

      const sortedTonStakerArr = tempTonStakerArr.sort((a, b) => a.id - b.id);
      const sortedDaoAirdropArr = tempDaoAirdropArr.sort((a, b) => a.id - b.id);

      setTonStakerAirdropTokens(
        sortedTonStakerArr.filter((tonStakerData) => {
          if (
            convertNumber({amount: tonStakerData.amount.toString()}) !== '0.00'
          ) {
            return tonStakerData;
          }
        }),
      );
      setDaoAirdropTokens(
        sortedDaoAirdropArr.filter((daoAirdropData) => {
          if (daoAirdropData.amount !== '0.00') {
            return daoAirdropData;
          }
        }),
      );

      let filteredAirdropData = claimableArr.filter(
        (data) => data.amount !== '0.00',
      );
      const sortedArr = filteredAirdropData.sort((a, b) => a.id - b.id);
      setLoadingData(false);
      setAirdropData(sortedArr);
    }
    if (account !== undefined && library !== undefined) {
      getClaimableAirdropTonAmounts();
    }
    /*eslint-disable*/
  }, [account, transactionType, blockNumber]);

  const availableGenesisAmount = (
    roundInfo: AirDropList,
    claimedAmount: string | undefined,
    unclaimedAmount: string | undefined,
  ) => {
    if (roundInfo !== undefined && claimedAmount !== undefined) {
      setGenesisAirdropBalance(unclaimedAmount);
    }
  };

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
      availableGenesisAmount(roundInfo, claimedAmount, unclaimedAmount);
    }
    if (account !== undefined && library !== undefined) {
      callAirDropData();
    }
    /*eslint-disable*/
  }, [account, transactionType, blockNumber]);

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
    setCheckedAllBoxes(!checkedAllBoxes);

    if (radioValue === 'TON Staker') {
      setIsCheck(tonStakerAirdropTokens.map((data, index) => String(index)));
      setCheckedTokenAddresses(
        tonStakerAirdropTokens.map((data) => data.address),
      );
    } else if (radioValue === 'DAO Airdrop') {
      setIsCheck(daoAirdropTokens.map((data, index) => String(index)));
      setCheckedTokenAddresses(daoAirdropTokens.map((data) => data.address));
    }

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

  return loadingData || !airdropData ? (
    <Flex
      alignItems={'center'}
      mt={'50px'}
      justifyContent={'center'}
      w={'100%'}>
      <LoadingComponent />
    </Flex>
  ) : (
    <Flex flexDirection={'column'} w={'976px'} p={'0px'} mt={'50px'}>
      <Text
        fontSize={'20px'}
        fontFamily={theme.fonts.roboto}
        color={themeDesign.font[colorMode]}
        ml={'14px'}
        mb={'15px'}
        fontWeight={'500'}>
        Token List
      </Text>
      <Flex alignItems={'end'} justifyContent={'space-between'} mb={'20px'}>
        <Flex>
          <Text
            ml={'14px'}
            fontSize={'16px'}
            fontFamily={theme.fonts.fld}
            color={themeDesign.font[colorMode]}>
            From:
          </Text>
          <RadioGroup onChange={setRadioValue} value={radioValue}>
            <Stack direction="row">
              <Box mx={'20px'} display={'flex'}>
                <Radio value="DAO Airdrop" size={'md'} mr={'5px'} />
                <Text fontFamily={theme.fonts.roboto} fontSize={'14px'}>
                  DAO Airdrop
                </Text>
              </Box>
              <Box mx={'20px'} display={'flex'}>
                <Radio value="TON Staker" size={'md'} mr={'5px'} />
                <Text fontFamily={theme.fonts.roboto} fontSize={'14px'}>
                  TON Staker
                </Text>
              </Box>
              <Box mx={'20px'} display={'flex'}>
                <Radio
                  value="Genesis Airdrop"
                  ml={'20px'}
                  size={'md'}
                  mr={'5px'}
                />
                <Text fontFamily={theme.fonts.roboto} fontSize={'14px'}>
                  Genesis Airdrop
                </Text>
              </Box>
            </Stack>
          </RadioGroup>
        </Flex>
        <Button
          color={themeDesign.tosFont[colorMode]}
          border={themeDesign.borderTos[colorMode]}
          height={'32px'}
          width={'120px'}
          padding={'9px 23px 8px'}
          borderRadius={'4px'}
          fontSize={'13px'}
          fontFamily={theme.fonts.roboto}
          background={'transparent'}
          disabled={checkedTokenAddresses.length < 1}
          // _hover={{background: 'transparent'}}
          onClick={() => {
            // console.log(checkedTokenAddresses);

            account &&
              AdminActions.claimMultipleTokens({
                account,
                library,
                addresses: checkedTokenAddresses,
                type: radioValue,
              });
          }}>
          Claim Selected
        </Button>
      </Flex>

      {radioValue === 'TON Staker' && tonStakerAirdropTokens.length > 0 ? (
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
            padding={'20px 35px'}
            fontFamily={theme.fonts.roboto}>
            <Flex minWidth={'10%'}>
              <Checkbox
                // fontWeight={'bold'}
                // fontSize={'14px'}
                // h={'45px'}
                iconSize="18px"
                left={'5%'}
                onChange={handleSelectAll}
                isChecked={checkedAllBoxes}
              />
            </Flex>

            <Text minWidth={'35%'} textAlign={'center'} fontSize={'12px'}>
              Token Symbol
            </Text>
            <Text minWidth={'35%'} textAlign={'center'} fontSize={'12px'}>
              Amount
            </Text>
            <Text
              fontSize={'12px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}
              minWidth={'20%'}
              textAlign={'center'}>
              Action
            </Text>
          </GridItem>
        </Grid>
      ) : radioValue === 'TON Staker' && tonStakerAirdropTokens.length === 0 ? (
        <Flex
          justifyContent={'center'}
          my={'20px'}
          width={'100%'}
          height={'200px'}
          padding={'90px 100px'}
          borderRadius={'10px'}
          border={
            colorMode === 'light' ? 'solid 1px #fff' : 'solid 1px #373737'
          }
          style={{backdropFilter: 'blur(8px)'}}
          boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
          backgroundColor={colorMode === 'light' ? '#fff' : '#222'}>
          <Text
            fontFamily={theme.fonts.fld}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
            fontWeight={'bold'}
            fontSize={'15px'}>
            There aren't any distributed tokens
          </Text>
        </Flex>
      ) : radioValue === 'DAO Airdrop' && daoAirdropTokens.length > 0 ? (
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
            fontFamily={theme.fonts.roboto}>
            <Flex minWidth={'10%'}>
              <Checkbox
                fontWeight={'bold'}
                fontSize={'14px'}
                iconSize="18px"
                left={'5%'}
                onChange={handleSelectAll}
              />
            </Flex>

            <Text minWidth={'35%'} textAlign={'center'} fontSize={'12px'}>
              Token Symbol
            </Text>
            <Text minWidth={'35%'} textAlign={'center'} fontSize={'12px'}>
              Amount
            </Text>
            <Text
              fontSize={'12px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}
              minWidth={'20%'}
              textAlign={'center'}>
              Action
            </Text>
          </GridItem>
        </Grid>
      ) : radioValue === 'Genesis Airdrop' &&
        Number(genesisAirdropBalance) > 0 ? (
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
            fontFamily={theme.fonts.roboto}>
            <Flex minWidth={'10%'}>
              <Checkbox
                fontWeight={'bold'}
                fontSize={'14px'}
                iconSize="18px"
                left={'5%'}
                onChange={handleSelectAll}
              />
            </Flex>

            <Text minWidth={'35%'} textAlign={'center'} fontSize={'12px'}>
              Token Symbol
            </Text>
            <Text minWidth={'35%'} textAlign={'center'} fontSize={'12px'}>
              Amount
            </Text>
            <Text
              fontSize={'12px'}
              fontWeight={'bolder'}
              color={colorMode === 'light' ? '#353c48' : 'white.0'}
              minWidth={'20%'}
              textAlign={'center'}>
              Action
            </Text>
          </GridItem>
        </Grid>
      ) : (
        <Flex
          justifyContent={'center'}
          my={'20px'}
          width={'100%'}
          height={'200px'}
          padding={'90px 100px'}
          borderRadius={'10px'}
          border={
            colorMode === 'light' ? 'solid 1px #fff' : 'solid 1px #373737'
          }
          style={{backdropFilter: 'blur(8px)'}}
          boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
          backgroundColor={colorMode === 'light' ? '#fff' : '#222'}>
          <Text
            fontFamily={theme.fonts.fld}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
            fontWeight={'bold'}
            fontSize={'15px'}>
            There aren't any distributed tokens
          </Text>
        </Flex>
      )}

      {radioValue === 'TON Staker' && tonStakerAirdropTokens.length > 0 ? (
        tonStakerAirdropTokens.map((data: any, index: number) => {
          const {id, address, amount, tokenSymbol, tonStaker, tosStaker} = data;
          const formattedAmt = tonStaker
            ? Number(ethers.utils.formatEther(amount)).toFixed(2)
            : amount;

          return (
            <Grid
              templateColumns="repeat(1, 1fr)"
              w={'100%'}
              bg={themeDesign.bg[colorMode]}>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={
                  index === tonStakerAirdropTokens?.length - 1 ? '' : 'none'
                }
                borderBottomRadius={
                  index === tonStakerAirdropTokens?.length - 1 ? '4px' : 'none'
                }
                className={'chart-cell'}
                d={'flex'}
                justifyContent={'center'}>
                <Flex minWidth={'10%'}>
                  <Checkbox
                    key={id}
                    type="checkbox"
                    name={tokenSymbol}
                    id={String(index)}
                    onChange={handleClick}
                    isChecked={isCheck.includes(String(index))}
                    fontWeight={'bold'}
                    fontSize={'14px'}
                    iconSize="18px"
                    left={'5%'}
                    value={address}
                  />
                </Flex>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'35%'}
                  textAlign={'center'}>
                  {tokenSymbol}
                </Text>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'35%'}
                  textAlign={'center'}>
                  {commafy(formattedAmt)}
                </Text>
                <Flex minWidth={'20%'} justifyContent={'center'}>
                  <Button
                    w={'100px'}
                    h={'38px'}
                    p={'7px 33px'}
                    border={'solid 1px #2a72e5'}
                    borderRadius={'3px'}
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    letterSpacing={'.33px'}
                    bg={'#2a72e5'}
                    color={'#fff'}
                    height={'32px'}
                    _hover={{}}
                    cursor={'pointer'}
                    _active={{}}
                    onClick={() => {
                      account &&
                        AdminActions.claimToken({
                          account,
                          library,
                          address: address,
                          tonStaker: tonStaker,
                          tosStaker: tosStaker,
                        });
                      setIsCheck([]);
                      setCheckedTokenAddresses([]);
                      setIsCheckAll(false);
                      setCheckedAllBoxes(false);
                    }}>
                    Claim
                  </Button>
                </Flex>
              </GridItem>
            </Grid>
          );
        })
      ) : radioValue === 'DAO Airdrop' && daoAirdropTokens.length > 0 ? (
        daoAirdropTokens.map((data: any, index: number) => {

          console.log('daoAirdropTokens',daoAirdropTokens);
          
          const {id, address, amount, tokenSymbol, tonStaker, tosStaker} = data;
          const formattedAmt = tonStaker
            ? Number(ethers.utils.formatEther(amount)).toFixed(2)
            : amount;

          if (address === '0x7a88424c2547ceC49AD1e4eE8eAfCC7F935E76B1') {
            return;
          }

          return (
            <Grid
              templateColumns="repeat(1, 1fr)"
              w={'100%'}
              bg={themeDesign.bg[colorMode]}>
              <GridItem
                border={themeDesign.border[colorMode]}
                borderBottom={
                  index === daoAirdropTokens?.length - 1 ? '' : 'none'
                }
                borderBottomRadius={
                  index === daoAirdropTokens?.length - 1 ? '4px' : 'none'
                }
                className={'chart-cell'}
                d={'flex'}
                justifyContent={'center'}>
                <Flex minWidth={'10%'}>
                  <Checkbox
                    key={id}
                    type="checkbox"
                    name={tokenSymbol}
                    id={String(index)}
                    onChange={handleClick}
                    isChecked={isCheck.includes(String(index))}
                    fontWeight={'bold'}
                    fontSize={'14px'}
                    iconSize="18px"
                    left={'5%'}
                    value={address}
                  />
                </Flex>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'35%'}
                  textAlign={'center'}>
                  {tokenSymbol}
                </Text>
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#353c48' : '#fff'}
                  minWidth={'35%'}
                  textAlign={'center'}>
                  {(formattedAmt)}
                </Text>
                <Flex minWidth={'20%'} justifyContent={'center'}>
                  <Button
                    w={'100px'}
                    h={'38px'}
                    p={'7px 33px'}
                    border={'solid 1px #2a72e5'}
                    borderRadius={'3px'}
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    letterSpacing={'.33px'}
                    bg={'#2a72e5'}
                    color={'#fff'}
                    height={'32px'}
                    _hover={{}}
                    cursor={'pointer'}
                    _active={{}}
                    onClick={() =>
                      account &&
                      AdminActions.claimToken({
                        account,
                        library,
                        address: address,
                        tonStaker: tonStaker,
                        tosStaker: tosStaker,
                      })
                    }>
                    Claim
                  </Button>
                </Flex>
              </GridItem>
            </Grid>
          );
        })
      ) : radioValue === 'Genesis Airdrop' &&
        Number(genesisAirdropBalance) > 0 ? (
        <Grid
          templateColumns="repeat(1, 1fr)"
          w={'100%'}
          bg={themeDesign.bg[colorMode]}>
          <GridItem
            border={themeDesign.border[colorMode]}
            className={'chart-cell'}
            d={'flex'}
            justifyContent={'center'}>
            <Flex minWidth={'10%'}>
              <Checkbox
                key={'Genesis'}
                type="checkbox"
                name={'Genesis Airdrop'}
                id={'Genesis'}
                onChange={handleClick}
                isChecked={isCheck.includes('Genesis')}
                fontWeight={'bold'}
                fontSize={'14px'}
                iconSize="18px"
                left={'5%'}
                value={'Genesis'}
              />
            </Flex>
            <Text
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              minWidth={'35%'}
              textAlign={'center'}>
              TOS
            </Text>
            <Text
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              minWidth={'35%'}
              textAlign={'center'}>
              {commafy(genesisAirdropBalance)}
            </Text>
            <Flex minWidth={'20%'} justifyContent={'center'}>
              <Button
                w={'100px'}
                h={'38px'}
                p={'7px 33px'}
                border={'solid 1px #2a72e5'}
                borderRadius={'3px'}
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
                letterSpacing={'.33px'}
                bg={'#2a72e5'}
                color={'#fff'}
                height={'32px'}
                _hover={{}}
                cursor={'pointer'}
                _active={{}}
                onClick={() =>
                  claimAirdrop({
                    userAddress: account,
                    library: library,
                  })
                }>
                Claim
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      ) : null}
    </Flex>
  );
};
