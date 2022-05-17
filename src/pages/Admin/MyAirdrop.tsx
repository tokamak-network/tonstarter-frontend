import {useEffect, useMemo, useState} from 'react';
import {selectDao} from '../Dao/dao.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {Flex, Text, Button, useTheme, useColorMode} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {ListRewardTable} from './components/ListRewardTable';
import {RewardData, ListingRewardTableData} from './types';
import AdminActions from './actions';
import {shortenAddress} from 'utils';
import {convertTimeStamp} from 'utils/convertTIme';
import moment from 'moment';
import {convertNumber} from 'utils/number';
import {DistributeTable} from './components/DistributeTable';
import {AirdropClaimTable} from './components/AirdropClaimTable';
import {AirdropClaimModal} from './components/AirdropClaimModal';
import {AirdropDistributeModal} from './components/AirdropDistributeModal';
import {
  getUserTOSStaked,
  getUserSTOSBalance,
  getUserTONStaked,
} from 'client/getUserBalance';

export const MyAirdrop = () => {
  const {account, library} = useActiveWeb3React();
  const [address, setAddress] = useState<string>('');
  const [projects, setProjects] = useState<ListingRewardTableData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [distributeButton, setDistributeButton] = useState<boolean>(false);
  const [userStakedTos, setUserStakedTos] = useState('-');
  const [userStakedSTos, setUserStakedSTos] = useState('-');
  const [isEnd, setIsEnd] = useState(true);
  const {
    data: {tosStakeList: stakeList},
  } = (useAppSelector as any)(selectDao);
  const filteredStakeList = stakeList.filter((e: any) => e.end === false);

  const {colorMode} = useColorMode();

  const theme = useTheme();

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
    borderRight: {
      light: 'solid 1px #f4f6f8',
      dark: 'solid 1px #363636',
    },
    fontAddressColor: {
      light: 'black.300',
      dark: 'white.200',
    },
  };

  // Get account address and shorten it
  useEffect(() => {
    getUserTONStaked({account, library});
    if (account && library) {
      setAddress(shortenAddress(account));
    } else {
      setAddress('-');
    }
  }, [account, library]);

  // Get TOS balance
  useEffect(() => {
    async function getTosBalance() {
      const res = await getUserTOSStaked({account, library});
      console.log('res: ', res);
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

  return (
    <Flex mt={'110px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'My Airdrop'}
        subtitle={'You can claim and distribute airdrop tokens'}
      />
      <Flex
        my={'60px'}
        p={'15px 35px'}
        borderRadius={'10px'}
        border={themeDesign.borderRight[colorMode]}>
        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          borderRight={themeDesign.borderRight[colorMode]}
          px="55px">
          <Text
            fontSize="0.750em"
            color="#86929d"
            fontFamily={theme.fonts.roboto}>
            Address
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            fontWeight={'bold'}
            fontSize={'20px'}
            color={themeDesign.fontColorTitle[colorMode]}>
            {address}
          </Text>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          borderRight={themeDesign.borderRight[colorMode]}
          px="55px">
          <Text
            fontSize="0.750em"
            color="#86929d"
            fontFamily={theme.fonts.roboto}>
            My Staked TON
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            fontWeight={'bold'}
            fontSize={'20px'}
            color={themeDesign.fontColorTitle[colorMode]}>
            1,000.00 TON
          </Text>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          borderRight={themeDesign.borderRight[colorMode]}
          px="55px">
          <Text
            fontSize="0.750em"
            color="#86929d"
            fontFamily={theme.fonts.roboto}>
            My Staked TOS
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            fontWeight={'bold'}
            fontSize={'20px'}
            color={themeDesign.fontColorTitle[colorMode]}>
            {userStakedTos} TOS
          </Text>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          px="55px">
          <Text
            fontSize="0.750em"
            color="#86929d"
            fontFamily={theme.fonts.roboto}>
            My sTOS
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            fontWeight={'bold'}
            fontSize={'20px'}
            color={themeDesign.fontColorTitle[colorMode]}>
            {userStakedSTos} sTOS
          </Text>
        </Flex>
      </Flex>
      <Flex>
        <Button
          w={'160px'}
          h={'38px'}
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
          w={'160px'}
          h={'38px'}
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
      {distributeButton ? <DistributeTable /> : <AirdropClaimTable />}
      <AirdropClaimModal></AirdropClaimModal>
      <AirdropDistributeModal></AirdropDistributeModal>
    </Flex>
  );
};
