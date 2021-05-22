import {
  Container,
  Box,
  Text,
  Heading,
  Button,
  Grid,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {StakeOptionModal} from './StakeOptionModal';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {FC, Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {fetchStakes, selectStakes} from './staking.reducer';
import {useContract} from 'hooks/useContract';
import {REACT_APP_STAKE_PROXY} from 'constants/index';
import * as StakeLogic from 'services/abis/Stake1Logic.json';
import {useWeb3React} from '@web3-react/core';

type WalletInformationProps = {
  onOpenStakeOptionModal: Function;
};

const WalletInformation: FC<WalletInformationProps> = ({
  onOpenStakeOptionModal,
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
          <Button
            colorScheme="blue"
            onClick={() =>
              onOpenStakeOptionModal({
                title: 'Stake',
              })
            }>
            Stake
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              onOpenStakeOptionModal({
                title: 'Unstake',
              })
            }>
            Unstake
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              onOpenStakeOptionModal({
                title: 'Claim',
                subtitle: `You can claim xxx and earn xxx`,
              })
            }>
            Claim
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              onOpenStakeOptionModal({
                title: 'Manage',
              })
            }>
            Manage
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};

export const Staking = () => {
  const stakeRegistryContract = useContract(
    REACT_APP_STAKE_PROXY,
    StakeLogic.abi,
  );

  const dispatch = useAppDispatch();
  const {data, loading} = useAppSelector(selectStakes);
  const {library} = useWeb3React();

  const {isOpen, onClose, onOpen} = useDisclosure();
  const [stakeOption, setStakeOption] = useState<{
    title: string;
    subtitle: string;
  }>({
    title: '',
    subtitle: '',
  });
  useEffect(() => {
    dispatch(fetchStakes({contract: stakeRegistryContract, library}) as any);
  }, [stakeRegistryContract, dispatch, library]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'symbol',
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

  const handleStakeOptionSelect = useCallback(
    ({title, subtitle}: {title: string; subtitle: string}) => {
      setStakeOption({title, subtitle});
      onOpen();
    },
    [onOpen],
  );

  const renderRowSubComponent = useCallback(
    ({row}) => {
      console.log(data[row.id]);
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
              onOpenStakeOptionModal={handleStakeOptionSelect}
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
              <Text>{shortenAddress(data[row.id]?.contractAddress)}</Text>
            </Box>
          </Flex>
        </Box>
      );
    },
    [data, handleStakeOptionSelect],
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
        stakeOption={stakeOption}
        isOpen={isOpen}
        form={{
          size: 10,
          variant: '',
        }}
        onClose={onClose}
      />
    </Fragment>
  );
};
