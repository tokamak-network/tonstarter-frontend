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
import {FC, Fragment, useCallback, useEffect, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {fetchStakes, selectStakes} from './staking.reducer';
import {useContract} from 'hooks/useContract';
import {REACT_APP_STAKE1_PROXY} from 'constants/index';
import * as StakeLogic from 'services/abis/Stake1Logic.json';
import {useWeb3React} from '@web3-react/core';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
} from './StakeOptionModal';
import {selectApp} from 'store/app/app.reducer';
import {useHistory} from 'react-router';

type WalletInformationProps = {
  onOpenStakeOptionModal: Function;
  onOpenClaimOptionModal: Function;
  onOpenUnstakeOptionModal: Function;
  onOpenManageOptionModal: Function;
};

const WalletInformation: FC<WalletInformationProps> = ({
  onOpenStakeOptionModal,
  onOpenClaimOptionModal,
  onOpenManageOptionModal,
  onOpenUnstakeOptionModal,
}) => {
  return (
    <Container maxW={'sm'}>
      <Box
        textAlign={'center'}
        py={10}
        px={5}
        shadow={'md'}
        borderRadius={'lg'}>
        <Heading>1,000 TON</Heading>
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
  const stakeRegistryContract = useContract(
    REACT_APP_STAKE1_PROXY,
    StakeLogic.abi,
  );

  const router = useHistory();
  console.log(router);
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const {library} = useWeb3React();

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
    // isOpen: isManageModalOpen,
    // onClose: onCloseManageOptionModal,
    onOpen: onOpenManageOptionModal,
  } = useDisclosure();

  useEffect(() => {
    dispatch(fetchStakes({contract: stakeRegistryContract, library}) as any);
  }, [stakeRegistryContract, dispatch, library]);

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
        accessor: 'total_staked',
      },
      {
        Header: 'Earning Per Block',
        accessor: 'earning_per_block',
      },
      {
        Header: 'Staked',
        accessor: 'staked',
      },
      {
        Header: 'Earned',
        accessor: 'earned',
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
              <Text>{data[row.id]?.saleStartBlock}</Text>
            </Box>
            <Box>
              <Text fontWeight={'bold'}>Closing day</Text>
              <Text>{data[row.id]?.stakeEndBlock}</Text>
            </Box>
          </Flex>
          <Box p={8}>
            <WalletInformation
              onOpenStakeOptionModal={onOpenStakeOptionModal}
              onOpenClaimOptionModal={onOpenClaimOptionModal}
              onOpenManageOptionModal={onOpenManageOptionModal}
              onOpenUnstakeOptionModal={onOpenUnstakeOptionModal}
            />
          </Box>
          <Flex
            px={{base: 3, md: 20}}
            py={{base: 1, md: 10}}
            justifyContent={'space-between'}>
            <Box>
              <Text fontWeight={'bold'}>Total stakers</Text>
              <Text textAlign={'center'}>100</Text>
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
    ],
  );

  return (
    <Fragment>
      <Head title={'Staking'} />
      <Container maxW={'8xl'}>
        <Box>
          <Text fontWeight={'medium'} fontSize={'xl'}>
            Staking
          </Text>
          <Text>
            Put your tokens into FLD and earn without losing principal
          </Text>
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
        onClose={onCloseStakeOptionModal}
      />
      <UnstakeOptionModal
        isOpen={isUnstakeModalOpen}
        onClose={onCloseUnstakeOptionModal}
      />
      <ClaimOptionModal
        isOpen={isClaimModalOpen}
        onClose={onCloseClaimOptionModal}
      />
    </Fragment>
  );
};
