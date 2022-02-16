import {
  Flex,
  Text,
  useColorMode,
  useTheme,
  Box,
  Grid,
  GridItem,
  Icon,
} from '@chakra-ui/react';
import {HamburgerIcon, CloseIcon} from '@chakra-ui/icons';
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
import useDate from '@Dao/hooks/useDate';
import LIST_OPEN_IMAGE from 'assets/svgs/list-open_icon.svg';
import LIST_OPEN_HOVER_IMAGE from 'assets/svgs/list-open_icon-hover.svg';
import LIST_CLOSE_IMAGE from 'assets/svgs/list-close_icon.svg';
import LIST_CLOSE_HOVER__IMAGE from 'assets/svgs/list-close_icon-hover.svg';
import LIST_CLOSE_IMAGE_LIGHT from 'assets/svgs/list-close_icon_light.svg';

import {motion} from 'framer-motion';

type AirdropTokenList = {tokenName: string; amount: string}[];

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

function getOpacity(index: number, arrLength: number): number[] {
  const indexNum = Math.floor(index / 2);
  const rowNum = Math.round(arrLength / 2);
  const result = Array.from({length: rowNum + 1}, (v, i) => {
    return indexNum + 1 >= i ? 1 : 0;
  });
  return result;
  // return [0, 0, 1, 1];
}

function getTranslateY(index: number, arrLength: number): string[] {
  if (arrLength <= 2) {
    return ['0px', '0px'];
  }
  const rowNum = Math.round(arrLength / 2);
  const result = Array.from({length: rowNum + 1}, (v, i) =>
    i === 0 ? '0px' : `-${35 * i}px`,
  );
  return result;
}

export const STOS = () => {
  const theme = useTheme();
  const {LockTOSDividend_ADDRESS} = DEPLOYED;
  const {colorMode} = useColorMode();
  const {account, library} = useActiveWeb3React();
  const [address, setAddress] = useState('-');
  const [airdropList, setAirdropList] = useState<AirdropTokenList | undefined>(
    undefined,
  );
  const [viewAllTokens, setViewAllTokens] = useState(false);

  const LOCKTOS_DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
  );
  const {blockNumber} = useBlockNumber();

  const [airdropExistingList, setAirdropExistingList] = useState<
    AirdropTokenList | undefined
  >(undefined);

  const [loading, setLoading] = useState<boolean>(true);

  const {nextThu} = useDate({format: 'MMM.DD, YYYY'});

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
            type: tokenSymbol !== 'WTON' ? 'wei' : 'ray',
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
    let temp: {tokenName: string; amount: string}[] = [];
    const result = airdropList?.map((tokenInfo) => {
      if (tokenInfo.amount !== '0.00') {
        temp.push(tokenInfo);
      }
    });
    setAirdropExistingList(temp);
    setTimeout(() => setLoading(false), 2500);
  }, [airdropList]);

  return (
    <Flex
      w={420}
      // h={'690px'}
      // h={'430px'}
      p={0}
      pt="19.5px"
      px={'20px'}
      pb={'30px'}
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
        pt="30px"
        pb="16px"
        zIndex={1000}
        bg={themeDesign.bg[colorMode]}>
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
      <Flex flexDir="column" alignItems="center" justifyContent="center">
        <Text
          fontSize={'0.938em'}
          fontWeight={600}
          color={themeDesign.fontColorAddress[colorMode]}
          zIndex={1000}
          w={'100%'}
          bg={themeDesign.bg[colorMode]}
          textAlign="center">
          Distributed List
        </Text>
        <Text
          color={'gray.400'}
          fontSize={'0.8em'}
          pb={'1px'}
          zIndex={1000}
          w={'100%'}
          bg={themeDesign.bg[colorMode]}
          textAlign="center">
          Next(Thu.) {nextThu} 00:00:00 (UTC)
        </Text>
        <Flex
          fontFamily={theme.fonts.roboto}
          fontSize="20px"
          fontWeight={600}
          h={
            airdropExistingList && viewAllTokens
              ? `${(airdropExistingList?.length / 2) * 35}px`
              : '35px'
          }
          mb={'52px'}
          color={themeDesign.fontAddressColor[colorMode]}>
          {loading === true && (
            <Text h={'35px'} w={'100%'} textAlign="center" mt={'12px'}></Text>
          )}
          {loading === false && airdropExistingList?.length === 0 && (
            <Text fontSize="0.8em" h={'35px'} mt={'12px'} zIndex={1100}>
              There isn't any distributed token
            </Text>
          )}
          {airdropExistingList && airdropExistingList.length > 0 && (
            <Box
              className="cover_token"
              w={'371px'}
              h={'20px'}
              pos="absolute"
              zIndex={1000}
              bg={themeDesign.bg[colorMode]}></Box>
          )}
          {airdropExistingList && airdropExistingList.length > 0 && (
            <Flex pos="relative" flexDir={'column'} mt={'12px'} h={'37px'}>
              <Grid
                templateColumns={'repeat(2, 1fr)'}
                justifyContent="center"
                w={'357px'}>
                {loading === false && airdropExistingList.length > 2 && (
                  <Icon
                    as={viewAllTokens ? CloseIcon : HamburgerIcon}
                    zIndex={10000}
                    w={viewAllTokens ? '12px' : '16px'}
                    h={viewAllTokens ? '12px' : '16px'}
                    pos={'absolute'}
                    right={'-10px'}
                    mt={viewAllTokens ? '12px' : '10px'}
                    alt={'LIST_OPEN_IMAGE'}
                    cursor="pointer"
                    color={colorMode === 'dark' ? '#ffffff' : ''}
                    fontWeight={'bold'}
                    _hover={{color: '#257eee'}}
                    onClick={() => setViewAllTokens(!viewAllTokens)}></Icon>
                )}
                {loading === false &&
                  viewAllTokens === false &&
                  airdropExistingList?.map((tokenInfo, index: number) => {
                    return (
                      <motion.div
                        key={`${index}_${tokenInfo}`}
                        animate={{
                          translateY: getTranslateY(
                            index,
                            airdropExistingList.length,
                          ),
                          opacity: getOpacity(
                            index,
                            airdropExistingList.length,
                          ),
                        }}
                        transition={{
                          duration:
                            Math.round(airdropExistingList.length / 2) * 2.5,
                          delay: 1.5,
                          repeat: Infinity,
                        }}
                        style={{zIndex: 10, position: 'relative'}}>
                        <GridItem>
                          {index % 2 !== 0 && (
                            <span
                              style={{
                                position: 'absolute',
                                left: '-10.8px',
                                fontSize: '14px',
                                marginLeft: '10px',
                                marginRight: '10px',
                                textAlign: 'center',
                                verticalAlign: 'center',
                                lineHeight: '35px',
                                color: '#86929d',
                              }}>
                              |
                            </span>
                          )}
                          <Text
                            fontFamily={theme.fonts.roboto}
                            color={themeDesign.fontAddressColor[colorMode]}
                            fontSize={'18px'}
                            h={'35px'}
                            // pr={index % 2 !== 0 ? '' : '10px'}
                            // pl={index % 2 !== 0 ? '10px' : ''}
                            verticalAlign={'center'}
                            lineHeight={'35px'}
                            fontWeight={600}
                            textAlign={
                              index % 2 === 0 &&
                              index + 1 === airdropExistingList.length
                                ? 'center'
                                : index % 2 !== 0
                                ? 'left'
                                : 'right'
                            }
                            pr={index % 2 !== 0 ? '' : '10px'}
                            pl={index % 2 !== 0 ? '10px' : ''}
                            width={
                              index % 2 === 0 &&
                              index + 1 === airdropExistingList.length
                                ? '372px'
                                : '178.5px'
                            }
                            position={
                              index % 2 === 0 &&
                              index + 1 === airdropExistingList.length
                                ? 'absolute'
                                : 'relative'
                            }>
                            {tokenInfo.amount}
                            <span style={{marginLeft: '5px', fontSize: '13px'}}>
                              {tokenInfo.tokenName}
                            </span>
                          </Text>
                        </GridItem>
                      </motion.div>
                    );
                  })}
                {viewAllTokens === true &&
                  airdropExistingList?.map((tokenInfo: any, index: number) => (
                    <GridItem zIndex={1001}>
                      {index % 2 !== 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            left: '47%',
                            fontSize: '14px',
                            marginLeft: '10px',
                            marginRight: '10px',
                            textAlign: 'center',
                            verticalAlign: 'center',
                            lineHeight: '35px',
                            color: '#86929d',
                          }}>
                          |
                        </span>
                      )}
                      <Text
                        fontFamily={theme.fonts.roboto}
                        color={themeDesign.fontAddressColor[colorMode]}
                        fontSize={'18px'}
                        h={'35px'}
                        verticalAlign={'center'}
                        lineHeight={'35px'}
                        fontWeight={600}
                        textAlign={
                          index % 2 === 0 &&
                          index + 1 === airdropExistingList.length
                            ? 'center'
                            : index % 2 !== 0
                            ? 'left'
                            : 'right'
                        }
                        pr={index % 2 !== 0 ? '' : '10px'}
                        pl={index % 2 !== 0 ? '10px' : ''}
                        width={
                          index % 2 === 0 &&
                          index + 1 === airdropExistingList.length
                            ? '372px'
                            : '178.5px'
                        }
                        position={
                          index % 2 === 0 &&
                          index + 1 === airdropExistingList.length
                            ? 'absolute'
                            : 'relative'
                        }>
                        {tokenInfo.amount}
                        <span style={{marginLeft: '5px', fontSize: '13px'}}>
                          {tokenInfo.tokenName}
                        </span>
                      </Text>
                    </GridItem>
                  ))}
              </Grid>
            </Flex>
          )}
          {airdropExistingList && airdropExistingList.length > 0 && (
            <Box
              className="conver_token"
              w={'371px'}
              h={'400px'}
              pos="absolute"
              top={'400px'}
              zIndex={1000}
              bg={themeDesign.bg[colorMode]}></Box>
          )}
        </Flex>
      </Flex>
      <Box h={'68px'} zIndex={1000}>
        <AvailableBalance></AvailableBalance>
      </Box>
      <Box h={'68px'} zIndex={1000}>
        <MyStaked></MyStaked>
      </Box>
      <Box h={'68px'} zIndex={1000}>
        <MySTOS></MySTOS>
      </Box>
      <Box
        w={'100%'}
        h={'1px'}
        zIndex={1000}
        bg={colorMode === 'light' ? '#e7edf3' : '#373737'}
        mt={'16px'}
        mb={'25px'}></Box>
      <Box h={'68px'} zIndex={1000}>
        <Claim></Claim>
      </Box>
      <Box zIndex={1000}>
        <Distribute></Distribute>
      </Box>
    </Flex>
  );
};
