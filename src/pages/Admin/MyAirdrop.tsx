import {Flex, Text, Button, useTheme, useColorMode} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo, useState} from 'react';
import {ListRewardTable} from './components/ListRewardTable';
import {RewardData, ListingRewardTableData} from './types';
import AdminActions from './actions';
import {convertTimeStamp} from 'utils/convertTIme';
import moment from 'moment';
import {convertNumber} from 'utils/number';
import {DistributeTable} from './components/DistributeTable';
import {AirdropClaimTable} from './components/AirdropClaimTable';
import {AirdropClaimModal} from './components/AirdropClaimModal';
import {AirdropDistributeModal} from './components/AirdropDistributeModal';

export const MyAirdrop = () => {
  const {account, library} = useActiveWeb3React();
  const [projects, setProjects] = useState<ListingRewardTableData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [distributeButton, setDistributeButton] = useState<boolean>(false);
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

  //   useEffect(() => {
  //     async function fetchProjectsData() {
  //       const rewardData = await AdminActions.getRewardData();

  //       if (!rewardData) {
  //         return setProjects([]);
  //       }

  //       const filteredRewardData: ListingRewardTableData[] = rewardData.map(
  //         (data: RewardData) => {
  //           const {
  //             poolName,
  //             rewardToken,
  //             incentiveKey,
  //             startTime,
  //             endTime,
  //             allocatedReward,
  //           } = data;

  //           const convertedAllocatedReward = convertNumber({
  //             amount: allocatedReward,
  //             localeString: true,
  //           });
  //           const nowTimeStamp = moment().unix();
  //           const status =
  //             nowTimeStamp < startTime
  //               ? 'Waiting'
  //               : nowTimeStamp < endTime
  //               ? 'On progress'
  //               : 'Closed';

  //           return {
  //             pool: poolName,
  //             rewardToken,
  //             incentiveKey,
  //             start: convertTimeStamp(startTime),
  //             end: convertTimeStamp(endTime),
  //             allocatedReward: convertedAllocatedReward || 'fail to load',
  //             stakers: '10',
  //             status,
  //           };
  //         },
  //       );

  //       setProjects(filteredRewardData);
  //       setLoading(false);
  //     }
  //     fetchProjectsData();
  //   }, [account, library]);

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
            Ox9B21...d938
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
            1,000.00 TOS
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
            2.35 sTOS
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
