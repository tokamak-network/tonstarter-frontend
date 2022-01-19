import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Select,
  NumberInput,
  NumberInputField,
  Grid,
  IconButton,
  Tooltip,
  CheckboxGroup,
  Stack,
  Checkbox,
} from '@chakra-ui/react';

import {FC, useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {checkTokenType} from 'utils/token';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';
import {claim, withdraw} from '../actions';
import {selectTransactionType} from 'store/refetch.reducer';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {getTokenSymbol} from '../utils/getTokenSymbol';
import {claimMultiple} from '../actions/claimMultiple';

const {WTON_ADDRESS, UniswapStaker_Address, TOS_ADDRESS} = DEPLOYED;

type ClaimRewardProps = {
  rewards: any[];
  tokens: any[];
};
const themeDesign = {
  border: {
    light: 'solid 1px #e7edf3',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
  borderDashed: {
    light: 'dashed 1px #dfe4ee',
    dark: 'dashed 1px #535353',
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

interface Token {
  amount: string;
  symbol: string;
  token: string;
  claimable: any;
}

export const ClaimReward: FC<ClaimRewardProps> = ({rewards, tokens}) => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<number>(0);
  const [contractClaimable, setContractClaimable] = useState<number>(0);
  // const [requestAmount, setRequestAmout] = useState<string>('0');
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [disableClaimButton, setDisableClaimButton] = useState<boolean>(true);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  const [symbol, setSymbol] = useState<string>('');
  const [claimTokens, setClaimTokens] = useState<any[]>([]);
  const [claimButtonText, setClaimButtonText] = useState<string>('Claim');

  useEffect(() => {
    const getTokenList = async () => {
      const rewardTokens = [
        ...Array.from(
          new Set(
            rewards.map((reward) =>
              ethers.utils.getAddress(reward.rewardToken),
            ),
          ),
        ),
      ];
      if (rewardTokens.length !== 0) {
        let tokensArray: any = [];
        await Promise.all(
          rewardTokens.map(async (token) => {
            const symbol = await getTokenFromContract(token);
            tokensArray.push({
              symbol,
              token,
            });
          }),
        );

        setTokenList(tokensArray);
        tokensArray.forEach((token: any, index: number) => {
          getClaimable(token, index);
        });
      }
    };
    getTokenList();
  }, [rewards, account, library, transactionType, blockNumber]);

  const getClaimable = async (token: any, index: number) => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }

    const uniswapStakerContract = new Contract(
      UniswapStaker_Address,
      STAKERABI.abi,
      library,
    );

    const signer = getSigner(library, account);
    let claimable = await uniswapStakerContract
      .connect(signer)
      .rewards(token.token, account);

    setContractClaimable(claimable);

    let claimableParsed =
      token.symbol === 'WTON'
        ? Number(
            ethers.utils.formatUnits(claimable.toString(), 27),
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })
        : Number(ethers.utils.formatEther(claimable.toString())).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
            },
          );

    // Adding claimable amt to each object in tokenList.
    let tokenObj = token;
    tokenObj.amount = claimableParsed;
    tokenObj.claimable = claimable;
    let newTokenList = tokenList;
    newTokenList[index] = tokenObj;
    setTokenList(newTokenList);
  };

  const getTokenFromContract = async (address: string) => {
    const symbolContract = await getTokenSymbol(address, library);
    return symbolContract;
  };

  // const changeToken = (token: string) => {
  //   const selected = tokenList.find(
  //     (tok: any) =>
  //       ethers.utils.getAddress(tok.token) === ethers.utils.getAddress(token),
  //   );
  //   setSymbol(selected.symbol);
  // };

  useEffect(() => {
    const pagenumber = parseInt(
      ((tokens.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [tokens]);

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return tokens.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const changePage = (pageNumber: number) => {
    setPageIndex(pageNumber);
    getPaginationGroup();
  };

  const editClaimTokens = (e: any) => {
    const token = JSON.parse(e.target.value);
    const newClaimTokens = claimTokens;
    const index = claimTokens.indexOf(token.token);
    if (index === -1) {
      newClaimTokens.push(token.token);
      setClaimTokens(newClaimTokens);
      // changeToken(token.token);
      if (token.amount !== '0.00') {
        setDisableClaimButton(false);
      }
    } else if (index > -1) {
      newClaimTokens.splice(index, 1);
      setClaimTokens(newClaimTokens);
    }

    let currentAmount = claimableAmount;
    if (index > -1) {
      currentAmount -= Number(token.amount);
    } else {
      currentAmount += Number(token.amount);
    }
    setClaimableAmount(currentAmount);
  };

  useEffect(() => {
    if (claimTokens.length <= 1) {
      setClaimButtonText('Claim');
    } else if (claimTokens.length > 1) {
      setClaimButtonText('Claim All Selected');
    }

    if (claimableAmount === 0 || claimTokens.length === 0) {
      setDisableClaimButton(true);
    }

    // Not sure why this dependency needs ".length". Without it, the dependency won't trigger.
  }, [claimTokens.length]);

  const getPaginationGroup = () => {
    let start = Math.floor((pageIndex - 1) / 5) * 5;

    const group = new Array(5).fill(1).map((_, idx) => start + idx + 1);
    return group;
  };

  return (
    <Flex justifyContent={'center'} flexDir={'column'}>
      <Box w={'100%'} px={'15px'}>
        <Text
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize={'20px'}
          mb={'18px'}>
          Claim
        </Text>
        <Flex alignItems={'center'} h={'125px'} mb={'1rem'}>
          {/* <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'134px'}>
            Reward Token
          </Text> */}
          <CheckboxGroup size={'sm'}>
            <Stack direction={['row', 'column']} w={'100%'}>
              {tokenList.map((token: any, index: number) => {
                return (
                  <Flex
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    w={'100%'}
                    key={index}>
                    <Checkbox
                      value={JSON.stringify(token)}
                      onChange={editClaimTokens}
                      colorScheme={'blue'}
                      iconColor="white">
                      {token.symbol}
                    </Checkbox>
                    <Text fontSize={'15px'}>
                      {token.amount} {token.symbol}
                    </Text>
                  </Flex>
                );
              })}
            </Stack>
          </CheckboxGroup>
          {/* <Select
            h={'30px'}
            color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
            fontSize={'12px'}
            onChange={(e) => {
              changeToken(e.target.value);
            }}
            w={'120px'}>
            {tokenList.map((token: any, index: number) => {
              // const tokenType = checkTokenType(token);
              return (
                <option value={token.token} key={index}>
                  {token.symbol}
                </option>
              );
            })}
          </Select> */}
        </Flex>
        {/* <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'134px'}>
            Claimable Amount
          </Text>
          <Flex
            w={'121px'}
            justifyContent="end"
            display={'flex'}
            alignItems={'baseline'}>
            <Text
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              fontWeight={'bold'}
              textAlign="right"
              fontSize={'15px'}
              mr={'2px'}>
              {selectedTokens.indexOf(WTON_ADDRESS) > -1
                ? // {ethers.utils.getAddress(selectedToken) ===
                  // ethers.utils.getAddress(WTON_ADDRESS)
                  Number(
                    ethers.utils.formatUnits(claimableAmount.toString(), 27),
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : Number(
                    ethers.utils.formatEther(claimableAmount.toString()),
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
              {/* {Number(ethers.utils.formatEther(claimableAmount.toString())).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })} 
            </Text>
            <Text
              textAlign="right"
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'10px'}>
              {symbol}
            </Text>
          </Flex>
        </Flex> */}
        {/* <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'134px'}>
            Request Amount
          </Text>
          <Flex
            justifyContent={'center'}
            w={'120px'}
            alignItems={'center'}
            h={'30px'}
            border={themeDesign.border[colorMode]}
            borderRadius={'4px'}
            px={'10px'}>
            <NumberInput
              value={requestAmount}
              max={claimableAmount}
              onChange={(value) => {
                setRequestAmout(value);
              }}
              borderColor={'transparent'}
              _focus={{
                borderColor: 'transparent',
              }}
              _active={{
                borderColor: 'transparent',
              }}
              _hover={{
                borderColor: 'transparent',
              }}
              focusBorderColor="transparent">
              <NumberInputField
                focusBorderColor="transparent"
                pl={'0px'}
                pr={'5px'}
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
                textAlign={'right'}
                color={colorMode === 'light' ? '#86929d' : '#818181'}
                _hover={{
                  borderColor: 'transparent',
                }}
              />
            </NumberInput>
            <Text
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'10px'}
              ml={'2px'}>
              {symbol}
            </Text>
          </Flex>
        </Flex> */}
        <Flex
          width={'100%'}
          justifyContent={'center'}
          borderBottom={themeDesign.borderDashed[colorMode]}>
          <Button
            w={'150px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            _hover={{backgroundColor: 'none'}}
            mb={'40px'}
            _disabled={
              colorMode === 'light'
                ? {
                    backgroundColor: 'gray.25',
                    cursor: 'default',
                    color: '#86929d',
                  }
                : {
                    backgroundColor: '#353535',
                    cursor: 'default',
                    color: '#838383',
                  }
            }
            disabled={disableClaimButton}
            mt={'20px'}
            onClick={() => {
              if (claimTokens.length === 1) {
                claim({
                  library: library,
                  userAddress: account,
                  amount: contractClaimable,
                  rewardToken: claimTokens[0],
                });
              } else {
                claimMultiple({
                  library,
                  userAddress: account,
                  tokenList: tokenList,
                });
              }
            }}>
            {claimButtonText}
          </Button>
        </Flex>
      </Box>
      <Box>
        <Flex w={'100%'} borderBottom={themeDesign.border[colorMode]}>
          <Text
            fontFamily={theme.fonts.titil}
            px={'15px'}
            mt="30px"
            fontSize="20px"
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}
            fontWeight="bold"
            pb={'10px'}>
            Withdraw
          </Text>
        </Flex>
        <Flex
          flexWrap={'wrap'}
          flexDirection={'column'}
          px={'20px'}
          pt={'15px'}
          h={'81px'}
          alignItems={'center'}>
          {tokens.length !== 0 ? (
            <Grid templateColumns="repeat(3, 1fr)" gap={'10px'}>
              {getPaginatedData().map((token, index) => {
                return (
                  <Flex
                    key={index}
                    onClick={() => {
                      withdraw({
                        library: library,
                        userAddress: account,
                        tokenID: token,
                      });
                    }}
                    background={'blue.500'}
                    h="30px"
                    px={'15px'}
                    fontSize={'13px'}
                    fontFamily={theme.fonts.roboto}
                    fontWeight={'bold'}
                    borderRadius="19px"
                    justifyContent={'center'}
                    alignItems={'center'}
                    _hover={{cursor: 'pointer'}}>
                    <Text color={'white.100'}>{token}</Text>
                  </Flex>
                );
              })}
            </Grid>
          ) : (
            <Text fontSize={'13px'}>You don't have withdrawable LP tokens</Text>
          )}
        </Flex>
        <Flex
          flexDirection={'row'}
          pb="30px"
          justifyContent={'center'}
          pt="19px"
          mx="15px"
          borderBottom={themeDesign.borderDashed[colorMode]}>
          <Flex>
            <Tooltip label="Previous Page">
              <IconButton
                minW={'24px'}
                h={'24px'}
                bg={colorMode === 'light' ? 'white.100' : 'none'}
                border={
                  colorMode === 'light'
                    ? 'solid 1px #e6eaee'
                    : 'solid 1px #424242'
                }
                color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                borderRadius={4}
                aria-label={'Previous Page'}
                onClick={gotToPreviousPage}
                isDisabled={pageIndex === 1}
                size={'sm'}
                mr={4}
                _active={{background: 'transparent'}}
                _hover={{
                  borderColor: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                  color: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                }}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>
          <Flex>
            {getPaginationGroup().map((groupIndex: number, index: number) => {
              const data = getPaginatedData().length;
              return (
                <Button
                  h="24px"
                  key={index}
                  minW="24px"
                  background="transparent"
                  fontFamily={theme.fonts.roboto}
                  fontSize="13px"
                  fontWeight="normal"
                  color={
                    pageIndex === groupIndex
                      ? themeDesign.buttonColorActive[colorMode]
                      : themeDesign.buttonColorInactive[colorMode]
                  }
                  p="0px"
                  _hover={{
                    background: 'transparent',
                    color: themeDesign.buttonColorActive[colorMode],
                  }}
                  _active={{background: 'transparent'}}
                  disabled={pageOptions < groupIndex}
                  onClick={() => changePage(groupIndex)}>
                  {groupIndex}
                </Button>
              );
            })}
          </Flex>
          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                minW={'24px'}
                h={'24px'}
                border={
                  colorMode === 'light'
                    ? 'solid 1px #e6eaee'
                    : 'solid 1px #424242'
                }
                color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                bg={colorMode === 'light' ? 'white.100' : 'none'}
                borderRadius={4}
                aria-label={'Next Page'}
                onClick={goToNextPage}
                isDisabled={pageIndex === pageOptions}
                size={'sm'}
                ml={4}
                mr={'1.5625em'}
                _active={{background: 'transparent'}}
                _hover={{
                  borderColor: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                  color: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                }}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
