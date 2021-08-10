import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  useTheme,
  Switch,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {PageHeader} from 'components/PageHeader';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
  StakeInLayer2Modal,
  UnStakeFromLayer2Modal,
  WithdrawalOptionModal,
  SwapModal,
} from './StakeOptionModal';
import {WalletInformation} from './components/WalletInformation';
import {ManageModal} from './StakeOptionModal/Manage/index';
import {formatStartTime} from 'utils/timeStamp';
import {useState} from 'react';
import {getTotalStakers, getUserBalance} from 'client/getUserBalance';
//@ts-ignore
import {useEffect} from 'react';
import {LoadingDots} from 'components/Loader/LoadingDots';
import {useUser} from 'hooks/useUser';
import {getEarnedTon} from './utils/getEarnedTon';

type GetDateTimeType =
  | 'sale-start'
  | 'sale-end'
  | 'mining-start'
  | 'mining-end';

type GetDateProp = {
  time: string | undefined;
  currentBlock: number;
  contractAddress: string;
  type: GetDateTimeType;
};

const GetDate = ({time, currentBlock, contractAddress, type}: GetDateProp) => {
  const {colorMode} = useColorMode();
  const [date, setDate] = useState('');

  const fetchDate = async () => {
    try {
      const result = await formatStartTime(time, currentBlock);
      setDate(result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDate();
    return () => {
      setDate('');
    };
    /*eslint-disable*/
  }, [time, currentBlock]);

  return (
    <>
      {date === '' ? (
        <LoadingDots />
      ) : (
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}
          w="100%">
          {date}
        </Text>
      )}
    </>
  );
};

export const Staking = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'period',
        accessor: 'period',
      },
      {
        Header: 'total staked',
        accessor: 'stakeBalanceTON',
      },
      {
        Header: 'Earning Per TON',
        accessor: 'earning_per_ton',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({row}: {row: any}) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <IconClose /> : <IconOpen />}
          </span>
        ),
      },
    ],
    [],
  );

  const GetTotalStaker = ({contractAddress, totalStakers}: any) => {
    const {colorMode} = useColorMode();
    const [totalStaker, setTotalStaker] = useState('-');
    const {account, library} = useUser();
    const getlInfo = async () => {
      const res = await getTotalStakers(contractAddress, library);
      if (res === undefined) {
        return setTotalStaker('0');
      }
      setTotalStaker(res);
    };

    useEffect(() => {
      if (account !== undefined) {
        getlInfo();
      } else {
        setTotalStaker(totalStakers);
      }
    }, []);

    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Text fontSize={'15px'} color="gray.400">
          Total Stakers
        </Text>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}>
          {totalStaker === '-' ? <LoadingDots></LoadingDots> : totalStaker}
        </Text>
      </Flex>
    );
  };

  const GetBalance = ({
    title,
    contractAddress,
    setStakeValance,
    status,
  }: any) => {
    const {colorMode} = useColorMode();
    const [balance, SetBalance] = useState('-');
    const {account, library} = useUser();
    const [toggle, setToggle] = useState('Earned TOS');

    useEffect(() => {
      getEarnedTon({contractAddress, library});
    }, []);

    useEffect(() => {
      const getBalance = async () => {
        try {
          const result = await getUserBalance(contractAddress);
          if (title === 'My staked') {
            //@ts-ignore
            return SetBalance(result?.totalStakedBalance);
          }

          const totalClaimedAmount =
            Number(result?.rewardTosBalance) + Number(result?.claimedBalance);
          //@ts-ignore
          SetBalance(totalClaimedAmount.toFixed(2));
        } catch (e) {}
      };

      if (account !== undefined) {
        getBalance();
      }
      return () => {
        SetBalance('-');
      };
      /*eslint-disable*/
    }, [account]);

    if (account === undefined) {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Text fontSize={'15px'} color="gray.400">
            {title}
          </Text>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance}
          </Text>
        </Flex>
      );
    }

    if (title === 'My staked') {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Text fontSize={'15px'} color="gray.400">
            {title}
          </Text>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance === '-' ? <LoadingDots></LoadingDots> : balance}
            {balance !== '-' ? (
              title === 'My staked' ? (
                <span> TON</span>
              ) : (
                <span> TOS</span>
              )
            ) : null}
          </Text>
        </Flex>
      );
    }

    if (status !== 'end') {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Flex>
            <Text fontSize={'15px'} color="gray.400" mr={2} _hover={{}}>
              {toggle}
            </Text>
          </Flex>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance === '-' ? <LoadingDots></LoadingDots> : balance}
            {balance !== '-' ? (
              title === 'My staked' ? (
                <span> TON</span>
              ) : (
                <span> TOS</span>
              )
            ) : null}
          </Text>
        </Flex>
      );
    }

    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Flex>
          <Text fontSize={'15px'} color="gray.400" mr={2} _hover={{}}>
            {toggle}
          </Text>
          <Switch
            onChange={() =>
              setToggle(toggle === 'Earned TOS' ? 'Earned TON' : 'Earned TOS')
            }
            // defaultChecked={true}
            value={0}></Switch>
        </Flex>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}
          h="30px">
          {balance === '-' ? <LoadingDots></LoadingDots> : balance}
          {balance !== '-' ? (
            toggle === 'Earned TOS' ? (
              <span> TOS</span>
            ) : (
              <span> TON</span>
            )
          ) : null}
        </Text>
      </Flex>
    );
  };

  const renderRowSubComponent = useCallback(
    ({row}) => {
      const {account, contractAddress, fetchBlock, library, status} =
        row.original;
      return (
        <Flex
          w="100%"
          m={0}
          justifyContent={'space-between'}
          alignItems="center"
          p="70px"
          border={'none'}>
          <Flex flexDir={'column'} justifyContent={'space-between'} h={'100%'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                {data[row.id]?.status === 'sale'
                  ? 'Sale Starting Day'
                  : 'Mining Starting Day'}
              </Text>
              <Text w="210px">
                <GetDate
                  time={
                    data[row.id]?.status === 'sale'
                      ? data[row.id]?.saleStartTime
                      : data[row.id]?.miningStartTime
                  }
                  currentBlock={fetchBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale'
                      ? 'sale-start'
                      : 'mining-start'
                  }></GetDate>
              </Text>
              <Text w="210px" color="gray.400" fontSize={'0.813em'}>
                Block Num.{' '}
                {data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleStartTime
                  : data[row.id]?.miningStartTime}
              </Text>
            </Flex>
            <GetTotalStaker
              contractAddress={contractAddress}
              totalStakers={data[row.id]?.totalStakers}></GetTotalStaker>
            <GetBalance
              title={'My staked'}
              contractAddress={contractAddress}></GetBalance>
          </Flex>

          <Box p={0} w={'450px'} borderRadius={'10px'} alignSelf={'flex-start'}>
            <WalletInformation dispatch={dispatch} data={data[row.id]} />
          </Box>

          <Flex flexDir={'column'} h={'100%'} justifyContent={'space-between'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                {data[row.id]?.status === 'sale'
                  ? 'Sale Closing Day'
                  : 'Mining Closing Day'}
              </Text>
              <Text w="220px">
                <GetDate
                  time={
                    data[row.id]?.status === 'sale'
                      ? data[row.id]?.saleEndTime
                      : data[row.id]?.miningEndTime
                  }
                  currentBlock={fetchBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale' ? 'sale-end' : 'mining-end'
                  }></GetDate>
              </Text>
              <Text w="210px" color="gray.400" fontSize={'0.813em'}>
                Block Num.{' '}
                {data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleEndTime
                  : data[row.id]?.miningEndTime}
              </Text>
            </Flex>

            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                Contract
              </Text>
              <Link
                fontSize={'20px'}
                fontWeight={'bold'}
                // color={GetColor() === 'light' ? 'black.300' : 'white.200'}
                isExternal={true}
                outline={'none'}
                _focus={{
                  outline: 'none',
                }}
                href={`${appConfig.explorerLink}${
                  data[row.id]?.contractAddress
                }`}>
                {shortenAddress(data[row.id]?.contractAddress)}
              </Link>
            </Flex>
            <GetBalance
              title={'Earned TOS'}
              contractAddress={contractAddress}
              status={data[row.id]?.status}
            />
          </Flex>
        </Flex>
      );
    },
    /* eslint-disable */
    [data, dispatch, appConfig.explorerLink],
  );

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Staking'}
            subtitle={
              'Put your tokens into TONStarter and earn reward without losing principal'
            }
            secondSubTitle={'TON base unit principal'}
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          <StakingTable
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={data}
            isLoading={loading === 'pending' ? true : false}
          />
        </Box>
      </Container>
      <StakeOptionModal />
      <UnstakeOptionModal />
      <ClaimOptionModal />
      <ManageModal />
      <StakeInLayer2Modal />
      <UnStakeFromLayer2Modal />
      <WithdrawalOptionModal />
      <SwapModal />
    </Fragment>
  );
};
