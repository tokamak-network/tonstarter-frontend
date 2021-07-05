import {
  Container,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  Link,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {FC, Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {selectUser} from 'store/app/user.reducer';
import {PageHeader} from 'components/PageHeader';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
} from './StakeOptionModal';
import store, {AppDispatch} from 'store';
import {openModal} from 'store/modal.reducer';
import {ManageModal} from './StakeOptionModal/manage';
import {formatStartTime} from 'utils/timeStamp';
import {useState} from 'react';
import {useLocalStorage} from 'hooks/useStorage';
import {useEffect} from 'react';

type WalletInformationProps = {
  dispatch: AppDispatch;
  data: {};
  user: {
    balance: string;
  };
  account: string | undefined;
};

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
  const [localTableValue, setLocalTableValue] = useLocalStorage('table', {});

  useEffect(() => {
    const fetchDate = async () => {
      const result = await formatStartTime(time, currentBlock);
      setDate(result);

      //@ts-ignore
      const localStorage = JSON.parse(window.localStorage.getItem('table'));

      return await setLocalTableValue({
        ...localStorage,
        [contractAddress + type]: result,
      });
    };
    if (
      localTableValue === undefined ||
      localTableValue[contractAddress + type] === undefined
    ) {
      fetchDate();
    } else {
      setDate(localTableValue[contractAddress + type]);
    }
    fetchDate();
  }, []);

  return (
    <Text
      fontSize={'20px'}
      color={colorMode === 'light' ? 'black.300' : 'white.200'}
      fontWeight={'bold'}
      w="100%">
      {date}
    </Text>
  );
};

const WalletInformation: FC<WalletInformationProps> = ({
  user,
  data,
  dispatch,
  account,
}) => {
  const payload = {
    ...data,
    user,
  };
  const {colorMode} = useColorMode();
  const btnDisabled = account === undefined ? true : false;

  return (
    <Container
      maxW={'sm'}
      shadow={'md'}
      borderRadius={'lg'}
      border={
        colorMode === 'light' ? 'solid 1px #f4f6f8' : 'solid 1px #373737'
      }>
      <Box w={'100%'} p={0} textAlign={'center'} py={10} px={5}>
        <Heading color={'blue.300'}>{user.balance.toString()} TON</Heading>
        <Box py={5}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button
            colorScheme="blue"
            isDisabled={btnDisabled}
            color={'white.100'}
            fontSize={'14px'}
            onClick={() => dispatch(openModal({type: 'stake', data: payload}))}>
            Stake
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={btnDisabled}
            color={'white.100'}
            fontSize={'14px'}
            onClick={() =>
              dispatch(openModal({type: 'unstake', data: payload}))
            }>
            Unstake
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={btnDisabled}
            color={'white.100'}
            fontSize={'14px'}
            onClick={() => dispatch(openModal({type: 'claim', data: payload}))}>
            Claim
          </Button>
          <Button
            colorScheme="blue"
            isDisabled={btnDisabled}
            color={'white.100'}
            fontSize={'14px'}
            onClick={() => dispatch(openModal({type: 'manage'}))}>
            Manage
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};

export const Staking = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);
  const {data: user} = useAppSelector(selectUser);
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
      // {
      //   Header: 'APY',
      //   accessor: 'apy',
      // },
      {
        Header: 'total staked',
        accessor: 'stakeBalanceTON',
      },
      {
        Header: 'Earning Per Block',
        accessor: 'earning_per_block',
      },
      // {
      //   Header: 'My Staked',
      //   accessor: 'mystaked',
      // },
      // {
      //   Header: 'Earned',
      //   accessor: 'totalRewardAmount',
      // },
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

  const GetText = ({title, content}: any) => {
    const {colorMode} = useColorMode();
    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Text fontSize={'15px'} color="gray.400">
          {title}
        </Text>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}>
          {content}
        </Text>
      </Flex>
    );
  };

  // const GetColor = () => {
  //   const {colorMode} = useColorMode();
  //   return colorMode;
  // };

  const renderRowSubComponent = useCallback(
    ({row}) => {
      const {account, contractAddress} = row.original;
      const currentBlock = store.getState().appConfig.data.blockNumber;
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
                  currentBlock={currentBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale'
                      ? 'sale-start'
                      : 'mining-start'
                  }></GetDate>
              </Text>
            </Flex>
            <GetText
              title={'Total Staker'}
              content={data[row.id]?.totalStakers}></GetText>
            <GetText
              title={'My staked'}
              content={data[row.id]?.mystaked}></GetText>
          </Flex>

          <Box p={0} w={'450px'} borderRadius={'10px'} alignSelf={'flex-start'}>
            <WalletInformation
              dispatch={dispatch}
              data={data[row.id]}
              user={user}
              account={account}
            />
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
                  currentBlock={currentBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale' ? 'sale-end' : 'mining-end'
                  }></GetDate>
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
            <GetText
              title={'Earned'}
              content={data[row.id]?.myearned}></GetText>
          </Flex>
        </Flex>
      );
    },
    [data, dispatch, user, appConfig.explorerLink],
  );

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'TON Starter'}
            subtitle={
              'Put your tokens into TON Starter and earn reward without losing principal'
            }
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
    </Fragment>
  );
};
