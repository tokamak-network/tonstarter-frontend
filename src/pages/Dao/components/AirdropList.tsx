import {Flex, Text, useColorMode, useTheme, Box} from '@chakra-ui/react';
import {DEPLOYED} from 'constants/index';
import {useEffect, useState} from 'react';
import {convertNumber} from 'utils/number';
import {useBlockNumber} from 'hooks/useBlock';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import {useContract} from 'hooks/useContract';
import moment from 'moment';
import {Contract} from '@ethersproject/contracts';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {useActiveWeb3React} from 'hooks/useWeb3';

export const AirdropList = () => {
  const {blockNumber} = useBlockNumber();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {LockTOSDividend_ADDRESS} = DEPLOYED;
  const LOCKTOS_DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
  );
  const {library} = useActiveWeb3React();
  const [airdropList, setAirdropList] = useState<
    {tokenName: string; amount: string}[] | undefined
  >(undefined);
  const [timeStamp, setTimeStamp] = useState<string>('');

  const themeDesign = {
    fontColor: {
      light: 'gray.250',
      dark: 'white.100',
    },
    bg: {
      light: 'white.100',
      dark: 'black.200',
    },
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px #535353',
    },
  };

  const {LockTOS_ADDRESS, TOS_ADDRESS} = DEPLOYED;

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
    console.log('--tokens--');
    console.log(tokens);
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
          amount: convertNumber({amount: tokenAmount.toString()}) as string,
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
    //GET NEXT THUR
    //Which is lock period for sTOS
    const dayINeed = 4; // for Thursday
    const today = moment().isoWeekday();
    const thisWed = moment().isoWeekday(dayINeed).format('YYYY-MM-DD');
    const nextWed = moment()
      .add(1, 'weeks')
      .isoWeekday(dayINeed)
      .format('YYYY-MM-DD');
    if (today === dayINeed || today < dayINeed) {
      return setTimeStamp(thisWed);
    } else {
      return setTimeStamp(nextWed);
    }
  }, []);

  return (
    <Flex justifyContent="space-around" w="100%" flexDir="column" mt="55px">
      <Flex alignItems="end" mb="15px">
        <Text
          color={themeDesign.fontColor[colorMode]}
          fontSize={'1.250em'}
          fontWeight={'bold'}>
          Distributed List{' '}
        </Text>
        {/* <Text color={'gray.400'} fontSize={'1.000em'} ml={1} pb={'1px'}>
          {timeStamp} 00:00:00 (UTC)
        </Text> */}
      </Flex>
      <Flex justifyContent="space-between">
        <Box>
          <Text color={'gray.400'} fontSize={'1.000em'}>
            {timeStamp} 00:00:00 (UTC)
          </Text>
          <Flex>
            {airdropList?.map((tokenInfo, index: number) => {
              if (tokenInfo.amount === '0.00') {
                return null;
              }
              return (
                <Flex alignItems="center">
                  <Text
                    fontFamily={theme.fonts.roboto}
                    color={themeDesign.fontColor[colorMode]}
                    mr={'10px'}
                    fontWeight={'bold'}
                    fontSize={'1.125em'}>
                    {tokenInfo.amount}
                    <span style={{fontSize: '0.813em', marginLeft: '5px'}}>
                      {tokenInfo.tokenName}
                    </span>
                  </Text>
                  {index < airdropList.length - 1 && (
                    <span
                      style={{
                        fontSize: '1em',
                        marginRight: '10px',
                        paddingTop: '5px',
                      }}>
                      |
                    </span>
                  )}
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
