import {useEffect, useMemo, useState, Dispatch, SetStateAction} from 'react';
import {
  Flex,
  Text,
  Button,
  Link,
  useTheme,
  useColorMode,
  Grid,
  GridItem,
  Box
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {
  ChevronUpIcon,
} from '@chakra-ui/icons';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {shortenAddress} from 'utils';
import {BASE_PROVIDER} from 'constants/index';
import {selectDao} from '@Dao/dao.reducer';
import {
  getUserTOSStaked,
  getUserSTOSBalance,
  getUserStakedTonBalance,
} from 'client/getUserBalance';
import {MobileAirDropDistributeTable} from './Components/MobileAirDropDistributeTable';
import { MobileAirdropClaimTable } from './Components/MobileAirdropClaimTable';

const MobileAirDrop = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [address, setAddress] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');
  const [distributeButton, setDistributeButton] = useState<boolean>(false);
  const [userStakedTos, setUserStakedTos] = useState('-');
  const [userStakedTon, setUserStakedTon] = useState('-');
  const [userStakedSTos, setUserStakedSTos] = useState('-');
  const [isEnd, setIsEnd] = useState(true);
  const {
    data: {tosStakeList: stakeList},
  } = (useAppSelector as any)(selectDao);
  const filteredStakeList = stakeList.filter((e: any) => e.end === false);
  const network = BASE_PROVIDER._network.name;

  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };

  const themeDesign = {
    fontColorTitle: {
      light: '#304156',
      dark: '#fff',
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
      light: '#fff',
      dark: 'black.200',
    },
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px rgba(96, 97, 112, 0.16)',
    },
    borderRight: {
      light: 'solid 1px #f4f6f8',
      dark: 'solid 1px #323232',
    },
    headerBorder: {
      light: 'none',
      dark: 'solid 1px #535353',
    },
    fontAddressColor: {
      light: 'black.300',
      dark: 'white.200',
    },
  };
  // Get account address and shorten it
  useEffect(() => {
    if (account && library) {
      setAddress(shortenAddress(account));
      setFullAddress(account);
    } else {
      setAddress('-');
    }
  }, [account, library]);

  // Get TOS balance
  useEffect(() => {
    async function getTosBalance() {
      const res = await getUserTOSStaked({account, library});
      if (res !== undefined) {
        setUserStakedTos(res);
      }
    }
    if (account) {
      getTosBalance();
      setIsEnd(true);
      stakeList.map((stake: any) => {
        if (stake.end === true && stake.endTime > 0) {
          return setIsEnd(false);
        }
        return null;
      });
    } else {
      setUserStakedTos('-');
    }
  }, [account, library, stakeList]);

  // Get sTOS balance
  useEffect(() => {
    async function getSTosBalance() {
      const res = await getUserSTOSBalance({account, library});
      if (res !== undefined) {
        setUserStakedSTos(res);
      }
    }
    if (account) {
      getSTosBalance();
    } else {
      setUserStakedSTos('-');
    }
    /*eslint-disable*/
  }, [account, library, stakeList]);

  useEffect(() => {
    async function getStakedTonBalance() {
      const res = await getUserStakedTonBalance({account, library});
      if (res !== undefined) {
        setUserStakedTon(res);
      }
    }
    if (account) {
      getStakedTonBalance();
    } else {
      setUserStakedTon('-');
    }
    /*eslint-disable*/
  }, [account, library, stakeList]);

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      px={'20px'}
      mt={'20px'}>
      <Grid
        h={'100%'}
        bg={colorMode === 'light' ? '#fff' : 'transparent'}
        boxShadow={
          colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
        }
        border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
        borderRadius="15px">
        <GridItem
          px={'20px'}
          h="60px"
          justifyContent={'center'}
          alignItems={'center'}
          display="flex"
          borderBottom={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
          }>
          <Text style={leftText}>
            You can claim and distribute airdrop tokens
          </Text>
        </GridItem>
        <GridItem
          style={gridItemStyle}
          borderBottom={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
          }>
          <Text style={leftText}>Address</Text>
          <Link
            isExternal
            style={rightText}
            _hover={{textDecoration: 'none'}}
            href={
              network === 'rinkeby'
                ? `https://rinkeby.etherscan.io/address/${fullAddress}`
                : network !== 'rinkeby'
                ? `https://etherscan.io/address/${fullAddress}`
                : ''
            }>
            {' '}
            {address}
          </Link>
        </GridItem>
        <GridItem
          style={gridItemStyle}
          borderBottom={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
          }>
          <Text style={leftText}>My Staked TON</Text>
          <Text style={rightText}>
            {Number(userStakedTon).toLocaleString()} TON
          </Text>
        </GridItem>
        <GridItem
          style={gridItemStyle}
          borderBottom={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
          }>
          <Text style={leftText}>My Staked TOS</Text>
          <Text style={rightText}>
            {Number(userStakedTos).toLocaleString()} TOS
          </Text>
        </GridItem>
        <GridItem style={gridItemStyle}>
          <Text style={leftText}>My sTOS</Text>
          <Text style={rightText}>
            {Number(userStakedSTos).toLocaleString()} sTOS
          </Text>
        </GridItem>
      </Grid>
      <Flex justifyContent={'center'} mt='35px'>
        <Button
          w={'110px'}
          h={'33px'}
          border={themeDesign.border[colorMode]}
          borderRadius={'3px 0px 0px 3px'}
          fontSize={'14px'}
          fontFamily={theme.fonts.fld}
          bg={'transparent'}
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
          onClick={() => {
            setDistributeButton(false);
          }}
          isActive={!distributeButton}>
          Airdrop Claim
        </Button>
        <Button
          w={'110px'}
          h={'33px'}
          bg={'transparent'}
          border={themeDesign.border[colorMode]}
          borderRadius={'0px 3px 3px 0px'}
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
          onClick={() => {
            setDistributeButton(true);
          }}
          isActive={distributeButton}>
          Distribute
        </Button>
      </Flex>
      {distributeButton ? <MobileAirDropDistributeTable /> : <MobileAirdropClaimTable />}
      <Flex justifyContent={'flex-end'} w={'100%'} mb={'20px'} mt={'-15px'}>
        <Box
          h={'40px'}
          w={'40px'}
          border={colorMode === 'light' ? 'none' : '1px solid #535353'}
          display={'flex'}
          zIndex={100}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius="50%"
          boxShadow="0 2px 5px 0 rgba(61, 73, 93, 0.1)"
          bg={colorMode === 'light' ? 'rgba(61, 73, 93, 0.1)' : 'rgba(34, 34, 34, 0.8)'}
          onClick={() => window.scrollTo(0, 0)}>
          <ChevronUpIcon h={'2em'} w={'2em'} />
        </Box>
      </Flex>
    </Flex>
  );
};
export default MobileAirDrop;
