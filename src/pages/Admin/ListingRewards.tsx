import {Flex} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo, useState} from 'react';
import {ListRewardTable} from './components/ListRewardTable';
import {RewardData, ListingRewardTableData} from './types';
import AdminActions from './actions';
import {convertTimeStamp} from 'utils/convertTIme';
import moment from 'moment';
import {convertNumber} from 'utils/number';

export const ListingRewards = () => {
  const {account, library} = useActiveWeb3React();
  const [projects, setProjects] = useState<ListingRewardTableData[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjectsData() {
      const rewardData = await AdminActions.getRewardData();

      if (!rewardData) {
        return setProjects([]);
      }

      const filteredRewardData: ListingRewardTableData[] = rewardData.map(
        (data: RewardData) => {
          const {
            poolName,
            rewardToken,
            incentiveKey,
            startTime,
            endTime,
            allocatedReward,
          } = data;

          const convertedAllocatedReward = convertNumber({
            amount: allocatedReward,
            localeString: true,
          });
          const nowTimeStamp = moment().unix();
          const status =
            nowTimeStamp < startTime
              ? 'Waiting'
              : nowTimeStamp < endTime
              ? 'On progress'
              : 'Closed';

          return {
            pool: poolName,
            rewardToken,
            incentiveKey,
            start: convertTimeStamp(startTime),
            end: convertTimeStamp(endTime),
            allocatedReward: convertedAllocatedReward || 'fail to load',
            stakers: '10',
            status,
          };
        },
      );

      setProjects(filteredRewardData);
      setLoading(false);
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
