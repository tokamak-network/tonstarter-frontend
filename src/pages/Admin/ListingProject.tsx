import {Flex, Box, useColorMode, useTheme} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useMemo} from 'react';
import {ListTable} from './components/ListTable';
import {DistributeModal} from './components/DistributeModal';
import {ListingTableData} from './types';

export const ListingProject = () => {
  const theme = useTheme();
  const {library} = useActiveWeb3React();

  const dummyData: {
    data: ListingTableData[];
    columns: any;
    isLoading: boolean;
  } = {
    data: [
      {
        contractAddress: '0x865200f8172bf55f99b53A8fa0E26988b94dfBbE',
        adminAddress: '0x8c595DA827F4182bC0E3917BccA8e654DF8223E1',
        name: 'DOC Project',
        token: 'DOC',
        saleStart: '2021 09 01 20:00:00',
        saleEnd: '2021 09 01 20:00:00',
        saleAmount: '2021 09 01 20:00:00',
        fundingRaised: '50,000,000.00',
        status: 'Add Whitelist',
        btn: {
          address: '',
        },
      },
    ],
    columns: useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Token',
          accessor: 'token',
        },
        {
          Header: 'Sale Start',
          accessor: 'saleStart',
        },
        {
          Header: 'Sale End',
          accessor: 'saleEnd',
        },
        {
          Header: 'Sale Amount',
          accessor: 'saleAmount',
        },
        {
          Header: 'Funding Raised',
          accessor: 'fundingRaised',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
        {
          Header: 'Airdrop',
          accessor: 'airdrop',
        },
      ],
      [],
    ),
    isLoading: false,
  };

  const {data, columns, isLoading} = dummyData;

  return (
    <Flex mt={'110px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'Listing Projects'}
        subtitle={
          'It shows the names of the projects, their tokens and their current sales.'
        }
      />
      <Flex mt={'60px'}>
        <ListTable
          data={data}
          columns={columns}
          isLoading={isLoading}></ListTable>
      </Flex>
      <DistributeModal></DistributeModal>
    </Flex>
  );
};
