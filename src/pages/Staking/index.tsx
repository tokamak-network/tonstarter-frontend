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
  useTheme
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppSelector} from 'hooks/useRedux';
import React, {FC, Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {selectStakes} from './staking.reducer';
import {useColorMode} from '@chakra-ui/react';

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
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Container maxW={'sm'}  >
      <Box
        textAlign={'center'}
        py={10}
        px={5}
        bg={colorMode === 'light' ? theme.colors.white[100] : 'transparent'}
      boxShadow="base"
      rounded={15}
      borderWidth={colorMode === 'light' ? 0 : 1}
      borderColor={theme.colors.gray[75]}>
        <Heading>{user.balance.toString()} TON</Heading>
        <Box py={5}>
          <Text>Available in wallet</Text>
        </Box>
        <Grid templateColumns={'repeat(2, 1fr)'} gap={6}>
          <Button bg={theme.colors.yellow[200]}  color={'black'} onClick={() => onOpenStakeOptionModal()}>
            Stake
          </Button>
          <Button bg={theme.colors.yellow[200]}  color={'black'} onClick={() => onOpenUnstakeOptionModal()}>
            Unstake
          </Button>
          <Button bg={theme.colors.yellow[200]}  color={'black'} onClick={() => onOpenClaimOptionModal()}>
            Claim
          </Button>
          <Button bg={theme.colors.yellow[200]}  color={'black'} onClick={() => onOpenManageOptionModal()}>
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
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Period',
        accessor: 'period',
      },
      // {
      //   Header: 'APY',
      //   accessor: 'apy',
      // },
      {
        Header: 'Total Staked',
        accessor: 'stakeBalanceTON',
      },
      {
        Header: 'Earning Per Block',
        accessor: 'earning_per_block',
      },
      {
        Header: 'My Staked',
        accessor: 'mystaked',
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
  const onStakeSubmitted = useCallback(value => {}, []);
  const onClaimSubmitted = useCallback(async value => {
    // @ts-ignore
    // dispatch(claimStake({account, value, library} as any));
  }, []);
  const onUnstakeSubmitted =useCallback(value => {}, []);
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
          <Box p={8} >
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
          <StakeOptionModal
            isOpen={isStakeModalOpen}
            balance={user.balance}
            payToken={data[row.id]?.token}
            saleStartBlock= {data[row.id]?.saleStartBlock}
            address={data[row.id]?.contractAddress}
            stakeStartBlock= {data[row.id]?.stakeStartBlock}
            onClose={onCloseStakeOptionModal}
            onSubmit={onStakeSubmitted}
          />
          <UnstakeOptionModal
            balance={data[row.id]?.mystaked}
            stakeEndBlock= {data[row.id]?.stakeEndBlock}
            address={data[row.id]?.contractAddress}
            isOpen={isUnstakeModalOpen}
            onClose={onCloseUnstakeOptionModal}
            onSubmit={onUnstakeSubmitted}
          />
          <ClaimOptionModal
            isOpen={isClaimModalOpen}
            balance={user.balance}
            stakeStartBlock= {data[row.id]?.stakeStartBlock}
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
        </Box>
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
        <Box  py={20}>
          <PageHeader
            title={'FLD Starter'}
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
