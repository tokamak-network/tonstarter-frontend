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
import useDate from '@Dao/hooks/useDate';
import {motion} from 'framer-motion';
import useAirdropList from '@Dao/hooks/useAirdropList';

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
  const {colorMode} = useColorMode();
  const {account, library} = useActiveWeb3React();
  const [address, setAddress] = useState('-');
  const {airdropList} = useAirdropList();
  const [viewAllTokens, setViewAllTokens] = useState(false);
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

  useEffect(() => {
    let temp: {tokenName: string; amount: string}[] = [];
    airdropList?.map((tokenInfo: any) => {
      if (tokenInfo.amount !== '0.00') {
        return temp.push(tokenInfo);
      }
    });
    setAirdropExistingList(temp);
    setTimeout(() => setLoading(false), 2500);
  }, [airdropList]);

  return (
    <Flex
      w={420}
      // h={'690px'}
      h={'400px'}
      p={0}
      pt="19.5px"
      px={'20px'}
      pb={'19.5px'}
      // pb={'30px'}
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
      <Box h={'68px'} zIndex={1000}>
        <AvailableBalance></AvailableBalance>
      </Box>
      <Box h={'68px'} zIndex={1000}>
        <MyStaked></MyStaked>
      </Box>
      <Box h={'68px'} zIndex={1000}>
        <MySTOS></MySTOS>
      </Box>
    </Flex>
  );
};
