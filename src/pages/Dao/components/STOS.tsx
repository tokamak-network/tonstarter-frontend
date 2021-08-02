import {Flex, Text, useColorMode, useTheme, Box} from '@chakra-ui/react';
import {AvailableBalance} from './AvailableBalance';
import {MyStaked} from './MyStaked';
import {MySTOS} from './MySTOS';
import {shortenAddress} from 'utils';
import {useEffect} from 'react';
import {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectUser} from 'store/app/user.reducer';
import {useUser} from 'hooks/useUser';
import {getTosStakeList} from './utils';
import {selectTransactionType} from 'store/refetch.reducer';

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

// type TosStakeList = [
//   {
//     lockId: string;
//     periodWeeks: number;
//     periodDays: number;
//     end: boolean;
//     lockedBalance: string;
//   },
// ];

export const STOS = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {signIn, account, library} = useUser();
  const [address, setAddress] = useState('-');
  const {data} = useAppSelector(selectUser);
  const [stakeList, setStakeList] = useState<any[]>([]);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  useEffect(() => {
    async function getStakeList() {
      const res = await getTosStakeList({account, library});
      if (res) {
        setStakeList(res);
      }
    }
    if (account !== undefined) {
      setAddress(shortenAddress(account));
      getStakeList();
    } else {
      setAddress('-');
    }
  }, [account, library]);

  useEffect(() => {
    async function getStakeList() {
      const res = await getTosStakeList({account, library});
      if (res) {
        setStakeList(res);
      }
    }
    if (transactionType === 'Dao') {
      getStakeList();
    }
    /*eslint-disable*/
  }, [transactionType, blockNumber]);

  console.log(stakeList);

  return (
    <Flex
      w={420}
      h={'430px'}
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
          Staking TOS and get sTOS.
        </Text>
      </Flex>
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        mt="30px"
        mb="36px">
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
      <Box mb={'20px'}>
        <AvailableBalance signIn={signIn} userData={data}></AvailableBalance>
      </Box>
      <Box mb={'20px'}>
        <MyStaked
          signIn={signIn}
          userData={data}
          stakeList={stakeList}
          transactionType={transactionType}
          blockNumber={blockNumber}></MyStaked>
      </Box>
      <MySTOS signIn={signIn} userData={data} stakeList={stakeList}></MySTOS>
    </Flex>
  );
};
