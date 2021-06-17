import {
  Container,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppSelector} from 'hooks/useRedux';
import React, {FC, Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {selectStakes} from './staking.reducer';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
} from './StakeOptionModal';
import {selectApp} from 'store/app/app.reducer';
import {selectUser} from 'store/app/user.reducer';
import {PageHeader} from 'components/PageHeader';
import {ManageModal} from './StakeOptionModal/manage';
type WalletInformationProps = {
  onOpenStakeOptionModal: Function;
  onOpenClaimOptionModal: Function;
  onOpenUnstakeOptionModal: Function;
  onOpenManageOptionModal: Function;
  user: {
    balance: string;
  };
};
const WalletInformation: FC<WalletInformationProps> = ({
  onOpenStakeOptionModal,
  onOpenClaimOptionModal,
  onOpenManageOptionModal,
  onOpenUnstakeOptionModal,
  user,
}) => {
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
          <Button colorScheme="blue" onClick={() => onOpenStakeOptionModal()}>
            Stake
          </Button>
          <Button colorScheme="blue" onClick={() => onOpenUnstakeOptionModal()}>
            Unstake
          </Button>
          <Button colorScheme="blue" onClick={() => onOpenClaimOptionModal()}>
            Claim
          </Button>
          <Button colorScheme="blue" onClick={() => onOpenManageOptionModal()}>
            Manage
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};
export const Staking = () => {
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);
  const {data: user} = useAppSelector(selectUser);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const {
    isOpen: isClaimModalOpen,
    onClose: onCloseClaimOptionModal,
    onOpen: onOpenClaimOptionModal,
  } = useDisclosure();
  const {
    isOpen: isStakeModalOpen,
    onClose: onCloseStakeOptionModal,
    onOpen: onOpenStakeOptionModal,
  } = useDisclosure();
  const {
    isOpen: isUnstakeModalOpen,
    onClose: onCloseUnstakeOptionModal,
    onOpen: onOpenUnstakeOptionModal,
  } = useDisclosure();
  const {
    onOpen: onOpenManageOptionModal,
    onClose: onCloseManageOptionModal,
    isOpen: isManageModalOpen,
  } = useDisclosure();
  const onEndSale = useCallback(() => {}, []);
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
  const onStakeSubmitted = useCallback((value) => {}, []);
  const onClaimSubmitted = useCallback(async (value) => {
    // @ts-ignore
    // dispatch(claimStake({account, value, library} as any));
  }, []);
  const onUnstakeSubmitted = useCallback((value) => {}, []);
  const renderRowSubComponent = useCallback(
    ({row}) => {
      console.log(data);

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
              onOpenStakeOptionModal={onOpenStakeOptionModal}
              onOpenClaimOptionModal={onOpenClaimOptionModal}
              onOpenManageOptionModal={onOpenManageOptionModal}
              onOpenUnstakeOptionModal={onOpenUnstakeOptionModal}
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
          <StakeOptionModal
            isOpen={isStakeModalOpen}
            balance={user.balance}
            payToken={data[row.id]?.token}
            saleStartBlock={data[row.id]?.saleStartBlock}
            address={data[row.id]?.contractAddress}
            stakeStartBlock={data[row.id]?.stakeStartBlock}
            onClose={onCloseStakeOptionModal}
            onSubmit={onStakeSubmitted}
          />
          <UnstakeOptionModal
            balance={data[row.id]?.mystaked}
            stakeEndBlock={data[row.id]?.stakeEndBlock}
            address={data[row.id]?.contractAddress}
            isOpen={isUnstakeModalOpen}
            onClose={onCloseUnstakeOptionModal}
            onSubmit={onUnstakeSubmitted}
          />
          <ClaimOptionModal
            isOpen={isClaimModalOpen}
            balance={user.balance}
            stakeStartBlock={data[row.id]?.stakeStartBlock}
            address={data[row.id]?.contractAddress}
            onClose={onCloseClaimOptionModal}
            onSubmit={onClaimSubmitted}
          />
          <ManageModal
            isOpen={isManageModalOpen}
            onClose={onCloseManageOptionModal}
            balance={user.balance}
            onOpenClaimOptionModal={onOpenClaimOptionModal}
            onEndSale={onEndSale}
            onOpenStakeOptionModal={onOpenStakeOptionModal}
            onOpenUnstakeOptionModal={onOpenUnstakeOptionModal}
          />
        </Flex>
      );
    },
    [
      appConfig.explorerLink,
      data,
      isClaimModalOpen,
      isManageModalOpen,
      isStakeModalOpen,
      isUnstakeModalOpen,
      onClaimSubmitted,
      onCloseClaimOptionModal,
      onCloseManageOptionModal,
      onCloseStakeOptionModal,
      onCloseUnstakeOptionModal,
      onEndSale,
      onOpenClaimOptionModal,
      onOpenManageOptionModal,
      onOpenStakeOptionModal,
      onOpenUnstakeOptionModal,
      onStakeSubmitted,
      onUnstakeSubmitted,
      user,
    ],
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
    </Fragment>
  );
};
