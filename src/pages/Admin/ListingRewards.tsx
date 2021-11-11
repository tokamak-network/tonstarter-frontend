import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo, useState} from 'react';
import {ListRewardTable} from './components/ListRewardTable';
import {ListingRewardTableData} from './types';

export const ListingRewards = () => {
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [projects, setProjects] = useState<ListingRewardTableData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProjectsData() {
      const dummy: ListingRewardTableData[] = [
        {
          pool: 'WTON-TOS',
          rewardToken: 'TOS',
          incentiveKey: {
            rewardToken: '0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd',
            pool: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
            startTime: 1632716437,
            endTime: 1632802837,
            refundee: '0x3b9878Ef988B086F13E5788ecaB9A35E74082ED9',
          },
          start: '2021.09.01 20:00:00',
          end: '2021.09.01 20:00:00',
          allocatedReward: '10,000,000.00',
          stakers: '10',
          status: 'Waiting',
        },
      ];
      setProjects(dummy);
    }
    fetchProjectsData();
  }, [account, library]);

  const dummyData: {
    data: ListingRewardTableData[];
    columns: any;
    isLoading: boolean;
  } = {
    data: projects,
    columns: useMemo(
      () => [
        {
          Header: 'Pool',
          accessor: 'pool',
        },
        {
          Header: 'Reward Token',
          accessor: 'rewardToken',
        },
        {
          Header: 'IncentiveKey',
          accessor: 'incentiveKey',
        },
        {
          Header: 'Start',
          accessor: 'start',
        },
        {
          Header: 'End',
          accessor: 'end',
        },
        {
          Header: 'Allocated Reward',
          accessor: 'allocatedReward',
        },
        {
          Header: 'Stakers',
          accessor: 'stakers',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
      ],
      [],
    ),
    isLoading: loading,
  };

  const {data, columns, isLoading} = dummyData;

  return (
    <Flex mt={'110px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'Listing Reward Programs'}
        subtitle={'Lists the created reward program.'}
      />
      <Flex mt={'60px'}>
        {data.length > 0 ? (
          <ListRewardTable
            data={data}
            columns={columns}
            isLoading={isLoading}></ListRewardTable>
        ) : (
          <div>no data for this account address</div>
        )}
      </Flex>
    </Flex>
  );
};
