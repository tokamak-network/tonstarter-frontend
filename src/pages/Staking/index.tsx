import {
  Container,
  Center,
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
import {selectUser, User} from 'store/app/user.reducer';
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
import store, {AppDispatch} from 'store';
import {openModal, closeModal} from 'store/modal.reducer';
import {ManageModal} from './StakeOptionModal/Manage/index';
import {formatStartTime} from 'utils/timeStamp';
import {useState} from 'react';
import {Stake} from './staking.reducer';
import {fetchManageModalPayload} from './utils';
import {ModalType} from 'store/modal.reducer';
import {LoadingComponent} from 'components/Loading';
import {
  getTotalStakers,
  getUserBalance,
  getUserTonBalance,
} from 'client/getUserBalance';
//@ts-ignore
import {Dot} from 'react-animated-dots';
import {useEffect} from 'react';
import {closeSale} from './actions';

type WalletInformationProps = {
  dispatch: AppDispatch;
  data: Stake;
  user: User;
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

const LoadingDots = () => {
  return (
    <Flex h={30}>
      <Dot>·</Dot>
      <Dot>·</Dot>
      <Dot>·</Dot>
    </Flex>
  );
};

const GetDate = ({time, currentBlock, contractAddress, type}: GetDateProp) => {
  const {colorMode} = useColorMode();
  const [date, setDate] = useState('');
  useMemo(async () => {
    const result = await formatStartTime(time, currentBlock);
    setDate(result);
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

const WalletInformation: FC<WalletInformationProps> = ({
  user,
  data,
  dispatch,
  account,
}) => {
  const {colorMode} = useColorMode();
  const [loading, setLoading] = useState(false);
  const [userTonBalance, setUserTonBalance] = useState<string>('');
  const [stakeDisabled, setStakeDisabled] = useState(true);
  const [unstakeDisabled, setUnstakeDisabled] = useState(true);
  const [claimDisabled, setClaimDisabled] = useState(true);
  const [manaDisabled, setManageDisabled] = useState(true);
  const btnDisabled = account === undefined ? true : false;
  const currentBlock: number = Number(data.fetchBlock);
  const miningStart: number = Number(data.miningStartTime);
  const miningEnd: number = Number(data.miningEndTime);

  const btnDisabledStake = () => {
    console.log(account === undefined || miningStart > currentBlock);
    return account === undefined || miningStart < currentBlock
      ? setStakeDisabled(false)
      : setStakeDisabled(false);
  };

  const btnDisabledUnstake = () => {
    return account === undefined || currentBlock < miningEnd
      ? setUnstakeDisabled(true)
      : setUnstakeDisabled(false);
  };

  const btnDisabledClaim = () => {
    return account === undefined || !data.saleClosed
      ? setClaimDisabled(true)
      : setClaimDisabled(false);
  };

  const manageDisableClaim = () => {
    return account === undefined || !data.saleClosed
      ? setManageDisabled(true)
      : setManageDisabled(false);
  };

  useEffect(() => {
    btnDisabledStake();
    btnDisabledUnstake();
    btnDisabledClaim();
    manageDisableClaim();
    /*eslint-disable*/
  }, [account, data, dispatch]);

  const modalPayload = async (data: any) => {
    const result = await fetchManageModalPayload(
      data.library,
      data.account,
      data.contractAddress,
      data.vault,
    );

    return result;
  };

  const getWalletTonBalance = async () => {
    const result = await getUserTonBalance({
      account: user.address,
      library: user.library,
    });
    if (result) {
      const trimNum = Number(result).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      });
      setUserTonBalance(trimNum);
    }
  };

  const modalData = useCallback(async (modal: ModalType) => {
    setLoading(true);
    let payload;

    try {
      if (modal === 'manage' || modal === 'claim') {
        const payloadModal = await modalPayload(data);
        payload = {
          ...data,
          ...payloadModal,
          user,
        };
      } else {
        payload = {
          ...data,
          user,
        };
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }

    setLoading(false);
    dispatch(openModal({type: modal, data: payload}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (user.address !== undefined) {
    getWalletTonBalance();
  }

  const theme = useTheme();
  const {btnStyle} = theme;

  return (
    <Container
      maxW={'sm'}
      shadow={'md'}
      borderRadius={'lg'}
      border={
        colorMode === 'light' ? 'solid 1px #f4f6f8' : 'solid 1px #373737'
      }>
      <Box w={'100%'} p={0} textAlign={'center'} py={10} px={5}>
        <Heading color={'blue.300'}>{userTonBalance} TON</Heading>
        <Box py={5}>
          <Text fontSize={'15px'} color={'gray.400'}>
            Available in wallet
          </Text>
        </Box>
        <Grid pos="relative" templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button
            {...(stakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={stakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('stake')}>
            Stake
          </Button>
          <Button
            {...(unstakeDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={unstakeDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('unstake')}>
            Unstake
          </Button>
          <Button
            {...(claimDisabled === true
              ? {...btnStyle.btnDisable({colorMode})}
              : {...btnStyle.btnAble()})}
            isDisabled={claimDisabled}
            fontSize={'14px'}
            opacity={loading === true ? 0.5 : 1}
            onClick={() => modalData('claim')}>
            Claim
          </Button>
          {manaDisabled === true ? (
            <Button
              {...(btnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={btnDisabled}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() =>
                data.miningEndTime !== undefined
                  ? closeSale({
                      userAddress: account,
                      vaultContractAddress: data.vault,
                      miningEndTime: data.miningEndTime,
                      library: user.library,
                      handleCloseModal: dispatch(closeModal()),
                    })
                  : null
              }>
              End Sale
            </Button>
          ) : (
            <Button
              {...(btnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              isDisabled={btnDisabled}
              fontSize={'14px'}
              opacity={loading === true ? 0.5 : 1}
              onClick={() => modalData('manage')}>
              Manage
            </Button>
          )}

          {loading === true ? (
            <Flex
              pos="absolute"
              zIndex={100}
              w="100%"
              h="100%"
              alignItems="cneter"
              justifyContent="center">
              <Center>
                <LoadingComponent></LoadingComponent>
              </Center>
            </Flex>
          ) : null}
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

  const GetTotalStaker = ({contractAddress}: any) => {
    const {colorMode} = useColorMode();
    const [totalStaker, setTotalStaker] = useState('-');
    const getlInfo = async () => {
      const res = await getTotalStakers(contractAddress);
      setTotalStaker(res);
    };
    getlInfo();
    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Text fontSize={'15px'} color="gray.400">
          Total Staker
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

  const GetBalance = ({title, contractAddress, user}: any) => {
    const {colorMode} = useColorMode();
    const [balance, SetBalance] = useState('-');
    const getBalance = async () => {
      const result = await getUserBalance(contractAddress);

      if (title === 'My staked') {
        //@ts-ignore
        return SetBalance(result.totalStakedBalance);
      }
      //@ts-ignore
      SetBalance(result.rewardTosBalance);
    };

    if (user.address !== undefined) {
      getBalance();
    }

    if (user.address === undefined) {
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
  };

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
              <Text w="210px" color="gray.400" fontSize={'0.813em'}>
                Block Num.{' '}
                {data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleStartTime
                  : data[row.id]?.miningStartTime}
              </Text>
            </Flex>
            <GetTotalStaker contractAddress={contractAddress}></GetTotalStaker>
            <GetBalance
              title={'My staked'}
              contractAddress={contractAddress}
              user={user}></GetBalance>
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
              title={'Earned'}
              contractAddress={contractAddress}
              user={user}></GetBalance>
          </Flex>
        </Flex>
      );
    },
    /* eslint-disable */
    [data, dispatch, user, appConfig.explorerLink],
  );

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'6xl'}>
        <Box py={20}>
          <PageHeader
            title={'Staking'}
            subtitle={
              'Put your tokens into FLD and earn reward without losing principal'
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
      <StakeInLayer2Modal />
      <UnStakeFromLayer2Modal />
      <WithdrawalOptionModal />
      <SwapModal />
    </Fragment>
  );
};
