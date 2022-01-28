import {Flex, Text, useColorMode, useTheme, Box} from '@chakra-ui/react';
import {AvailableBalance} from './AvailableBalance';
import {MyStaked} from './MyStaked';
import {MySTOS} from './MySTOS';
import {shortenAddress} from 'utils';
import {useEffect} from 'react';
import {useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {Claim} from './Claim';
import {Distribute} from './Distribute';
import moment from 'moment';
import {useContract} from 'hooks/useContract';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import {DEPLOYED} from 'constants/index';
import {convertNumber} from 'utils/number';
import {Contract} from '@ethersproject/contracts';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {useBlockNumber} from 'hooks/useBlock';

const themeDesign = {
  fontColorTitle: {
    light: 'gray.250',
    dark: 'white.100',
  },
  fontColor: {
    light: 'gray.250',
    dark: 'black.300',
  },
  fontColorAddress: {
    light: 'gray.400',
    dark: 'gray.425',
  },
  fontGray: {
    light: 'gray.175',
    dark: '#9d9ea5',
  },
  bg: {
    light: 'white.100',
    dark: 'black.200',
  },
  border: {
    light: 'solid 1px #f4f6f8',
    dark: 'solid 1px #373737',
  },
  borderBottom: {
    light: 'solid 1px #f4f6f8',
    dark: 'solid 1px #363636',
  },
  fontAddressColor: {
    light: 'black.300',
    dark: 'white.200',
  },
};

export const STOS = () => {
  const theme = useTheme();
  const {LockTOSDividend_ADDRESS} = DEPLOYED;
  const {colorMode} = useColorMode();
  const {account, library} = useActiveWeb3React();
  const [address, setAddress] = useState('-');
  const [airdropList, setAirdropList] = useState<
    {tokenName: string; amount: string}[] | undefined
  >(undefined);
  const [checkAirdropList, setCheckAirdropList] = useState<
    boolean[] | undefined
  >(undefined);

  const LOCKTOS_DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
  );
  const {blockNumber} = useBlockNumber();

  useEffect(() => {
    if (account && library) {
      setAddress(shortenAddress(account));
    } else {
      setAddress('-');
    }
  }, [account, library]);

  const fetchData = async () => {
    let claimableTokens = [];
    let isError = false;
    let i = 0;

    do {
      try {
        const tokenAddress = await LOCKTOS_DIVIDEND_CONTRACT?.distributedTokens(
          i,
        );
        claimableTokens.push(tokenAddress);
        i++;
      } catch (e) {
        isError = true;
      }
    } while (isError === false);

    const tokens = claimableTokens;
    const nowTimeStamp = moment().unix();
    const result: {tokenName: string; amount: string}[] = await Promise.all(
      tokens.map(async (token: string) => {
        const tokenAmount = await LOCKTOS_DIVIDEND_CONTRACT?.tokensPerWeekAt(
          token,
          nowTimeStamp,
        );
        const ERC20_CONTRACT = new Contract(token, ERC20.abi, library);
        const tokenSymbol = await ERC20_CONTRACT.symbol();
        return {
          tokenName: tokenSymbol,
          amount: convertNumber({
            amount: tokenAmount.toString(),
            localeString: true,
          }) as string,
        };
      }),
    );

    return setAirdropList(result);
  };

  useEffect(() => {
    fetchData();
    /*eslint-disable*/
  }, [blockNumber]);

  useEffect(() => {
    const result = airdropList?.map((tokenInfo) => tokenInfo.amount === '0.00');
    setCheckAirdropList(result || undefined);
  }, [airdropList]);

  return (
    <Flex
      w={420}
      h={'645px'}
      // h={'430px'}
      p={0}
      pt="19.5px"
      px={'20px'}
      flexDir="column"
      bg={themeDesign.bg[colorMode]}
      borderRadius={10}
      boxShadow="0 1px 2px 0 rgba(96, 97, 112, 0.2);"
      border={themeDesign.border[colorMode]}>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        borderBottom={themeDesign.borderBottom[colorMode]}
        pb="20px">
        <Text
          fontSize={'1.250em'}
          fontWeight={'bold'}
          color={themeDesign.fontColorTitle[colorMode]}>
          sTOS
        </Text>
        <Text
          fontFamily={theme.fonts.roboto}
          fontSize="0.750em"
          color="#86929d">
          Stake TOS and get sTOS.
        </Text>
      </Flex>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        mt="30px"
        mb="16px">
        <Text
          fontSize={'0.938em'}
          fontWeight={600}
          color={themeDesign.fontColorAddress[colorMode]}>
          Address
        </Text>
        <Text
          fontFamily={theme.fonts.roboto}
          fontSize="20px"
          fontWeight={600}
          color={themeDesign.fontAddressColor[colorMode]}>
          {address}
        </Text>
      </Flex>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        mb="36px">
        <Text
          fontSize={'0.938em'}
          fontWeight={600}
          color={themeDesign.fontColorAddress[colorMode]}>
          Distributed List
        </Text>
        <Text color={'gray.400'} fontSize={'0.8em'} pb={'1px'}>
          Next Thursday 00:00:00 (UTC)
        </Text>
        <Flex
          fontFamily={theme.fonts.roboto}
          fontSize="20px"
          fontWeight={600}
          color={themeDesign.fontAddressColor[colorMode]}>
          {checkAirdropList?.indexOf(true) === 0 ? (
            <Text fontSize="0.8em">There isn't any distributed token</Text>
          ) : (
            <Text h={'24px'}></Text>
          )}
          {airdropList?.map((tokenInfo, index: number) => {
            if (tokenInfo.amount === '0.00') {
              return null;
            }
            return (
              <Flex alignItems="center">
                {index !== 0 && (
                  <span
                    style={{
                      fontSize: '1em',
                      marginLeft: '10px',
                      textAlign: 'center',
                      verticalAlign: 'center',
                      lineHeight: '35px',
                    }}>
                    |
                  </span>
                )}
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={themeDesign.fontAddressColor[colorMode]}
                  fontSize={'0.8em'}
                  h={'35px'}
                  textAlign="center"
                  verticalAlign={'center'}
                  lineHeight={'35px'}
                  fontWeight={600}>
                  {tokenInfo.amount}
                  <span style={{marginLeft: '5px'}}>{tokenInfo.tokenName}</span>
                </Text>
                {/* {index < airdropList.length - 1 &&
                  airdropList[index + 1].amount !== '0.00' && (
                    <span
                      style={{
                        fontSize: '1em',
                        marginRight: '10px',
                        textAlign: 'center',
                        verticalAlign: 'center',
                        lineHeight: '35px',
                      }}>
                      |
                    </span>
                  )} */}
              </Flex>
            );
          })}
        </Flex>
      </Flex>
      <Box h={'68px'}>
        <AvailableBalance></AvailableBalance>
      </Box>
      <Box h={'68px'}>
        <MyStaked></MyStaked>
      </Box>
      <Box h={'68px'}>
        <MySTOS></MySTOS>
      </Box>
      <Box h={'68px'}>
        <Claim></Claim>
      </Box>
      <Distribute></Distribute>
    </Flex>
  );
};
