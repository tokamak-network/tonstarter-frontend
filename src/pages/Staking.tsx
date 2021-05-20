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
import {Head} from 'components/SEO';
import {StakeOptionModal} from 'components/StakeOptionModal';
import {Table} from 'components/Table';
import {data} from 'make';
import {FC, Fragment, useCallback, useMemo, useState} from 'react';
import {shortenAddress} from 'utils';

type WalletInformationProps = {
  onOpenStakeOptionModal: Function;
};

const WalletInformation: FC<WalletInformationProps> = ({
  onOpenStakeOptionModal,
}) => {
  return (
    <Container maxW={'sm'}>
      <Box textAlign={'center'} borderRadius={'lg'}>
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
  const {isOpen, onClose, onOpen} = useDisclosure();
  const [stakeOption, setStakeOption] = useState<{
    title: string;
    subtitle: string;
  }>({
    title: '',
    subtitle: '',
  });
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
            {row.isExpanded ? '👇' : '👉'}
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
    ({row}) => (
      <Box borderWidth={1} mt={0}>
        <Flex
          px={{base: 3, md: 20}}
          py={{base: 1, md: 10}}
          justifyContent={'space-between'}>
          <Box>
            <Text fontWeight={'bold'}>Starting Day</Text>
          </Box>
          <Box>
            <Text fontWeight={'bold'}>Closing day</Text>
          </Box>
        </Flex>
        <Box p={12}>
          <WalletInformation onOpenStakeOptionModal={handleStakeOptionSelect} />
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
            <Text>
              {shortenAddress('0x0000000000000000000000000000000000000000')}
            </Text>
          </Box>
        </Flex>
      </Box>
    ),
    [handleStakeOptionSelect],
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
          <Table
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={data}
          />
        </Box>
      </Container>
      <StakeOptionModal
        stakeOption={stakeOption}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Fragment>
  );
};
