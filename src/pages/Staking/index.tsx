import {
  Container,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  Link,
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
import {AppDispatch} from 'store';
import {openModal} from 'store/modal.reducer';
import {ManageModal} from './StakeOptionModal/manage';

type WalletInformationProps = {
  dispatch: AppDispatch;
  data: {};
  user: {
    balance: string;
  };
};
const WalletInformation: FC<WalletInformationProps> = ({
  user,
  data,
  dispatch,
}) => {
  const payload = {
    ...data,
    user,
  };

  return (
    <Container maxW={'sm'}>
      <Box
        textAlign={'center'}
        py={10}
        px={5}
        shadow={'md'}
        borderRadius={'lg'}>
        <Heading>{user.balance.toString()} TON</Heading>
        <Box py={5}>
          <Text>Available in wallet</Text>
        </Box>
        <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button
            colorScheme="blue"
            onClick={() => dispatch(openModal({type: 'stake', data: payload}))}>
            Stake
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              dispatch(openModal({type: 'unstake', data: payload}))
            }>
            Unstake
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => dispatch(openModal({type: 'claim', data: payload}))}>
            Claim
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              dispatch(openModal({type: 'manage', data: payload}))
            }>
            Manage
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};
export const Staking = () => {
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
  const renderRowSubComponent = useCallback(
    ({row}) => {
      return (
        <Flex
          mt={0}
          w={'100%'}
          h={'500px'}
          justifyContent={'space-between'}
          alignItems="center">
          <Flex
            px={{base: 3, md: 20}}
            py={{base: 1, md: 10}}
            flexDir={'column'}
            justifyContent={'space-between'}
            h={'100%'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontWeight={'bold'}>Starting Day</Text>
              <Text>{data[row.id]?.startTime}</Text>
            </Flex>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontWeight={'bold'}>Closing day</Text>
              <Text>{data[row.id]?.endTime}</Text>
            </Flex>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontWeight={'bold'}>Total stakers</Text>
              <Text>{data[row.id]?.totalStakers}</Text>
            </Flex>
          </Flex>
          <Box p={8} w={'450px'}>
            <WalletInformation
              dispatch={dispatch}
              data={data[row.id]}
              user={user}
            />
          </Box>
          <Flex
            px={{base: 3, md: 20}}
            py={{base: 1, md: 10}}
            flexDir={'column'}
            justifyContent={'space-between'}
            h={'100%'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontWeight={'bold'}>My staked</Text>
              <Text>{data[row.id]?.mystaked}</Text>
            </Flex>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontWeight={'bold'}>My Earned</Text>
              <Text>{data[row.id]?.totalRewardAmount}</Text>
            </Flex>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontWeight={'bold'}>Contract</Text>
              <Link
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
              'Put your tokens into FLD and earn without losing principal'
            }
          />
        </Box>
        <Box>
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
