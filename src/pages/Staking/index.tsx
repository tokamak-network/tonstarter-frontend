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
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {FC, Fragment, useCallback, useEffect, useMemo} from 'react';
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
  } = useDisclosure();



  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Period',
        accessor: 'period',
      },
      {
        Header: 'APY',
        accessor: 'apy',
      },
      {
        Header: 'Total Staked',
        accessor: 'balance',
      },
      {
        Header: 'Earning Per Block',
        accessor: 'earning_per_block',
      },
      {
        Header: 'My Staked',
        accessor: 'staked',
      },
      {
        Header: 'Earned',
        accessor: 'totalRewardAmount',
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

  const renderRowSubComponent = useCallback(
    ({row}) => {
      return (
        <Box mt={0}>
          <Flex
            px={{base: 3, md: 20}}
            py={{base: 1, md: 10}}
            justifyContent={'space-between'}>
            <Box>
              <Text fontWeight={'bold'}>Starting Day</Text>
              <Text>{data[row.id]?.startTime}</Text>
            </Box>
            <Box>
              <Text fontWeight={'bold'}>Closing day</Text>
              <Text>{data[row.id]?.endTime}</Text>
            </Box>
            
          </Flex>
          <Box p={8}>
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
            justifyContent={'space-between'}>
            <Box>
              <Text fontWeight={'bold'}>Total stakers</Text>
              <Text textAlign={'center'}>{data[row.id]?.totalStakers}</Text>
            </Box>
            <Box>
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
            </Box>
          </Flex>
        </Box>
      );
    },
    [
      appConfig.explorerLink,
      data,
      onOpenClaimOptionModal,
      onOpenManageOptionModal,
      onOpenStakeOptionModal,
      onOpenUnstakeOptionModal,
      user,
    ],
  );

  const onClaimSubmitted = useCallback(async value => {
    // @ts-ignore
    // dispatch(claimStake({account, value, library} as any));
  }, []);

  const onStakeSubmitted = useCallback(value => {}, []);

  const onUnstakeSubmitted = useCallback(e => {
    e.preventDefault();
  }, []);

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'6xl'}>
        <Box>
          <PageHeader
            title={'FLD Starter'}
            subtitle={
              'Put your tokens into FLD and earn without losing principal'
            }
          />
        </Box>

        <Box py={20}>
          <StakingTable
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={data}
            isLoading={loading === 'pending' ? true : false}
          />
        </Box>
      </Container>
      <StakeOptionModal
        isOpen={isStakeModalOpen}
        balance={user.balance}
        onClose={onCloseStakeOptionModal}
        onSubmit={onStakeSubmitted}
      />
      <UnstakeOptionModal
        isOpen={isUnstakeModalOpen}
        balance={user.balance}
        onClose={onCloseUnstakeOptionModal}
        onSubmit={onUnstakeSubmitted}
      />
      <ClaimOptionModal
        isOpen={isClaimModalOpen}
        balance={user.balance}
        onClose={onCloseClaimOptionModal}
        onSubmit={onClaimSubmitted}
      />
    </Fragment>
  );
};
