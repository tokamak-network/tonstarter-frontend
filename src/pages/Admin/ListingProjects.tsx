import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import {PageHeader} from 'components/PageHeader';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useMemo, useState} from 'react';
import {ListTable} from './components/ListTable';
import {DistributeModal} from './components/DistributeModal';
import {fetchStarterURL} from 'constants/index';
import AdminActions from './actions';
import moment from 'moment';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import {LoadingComponent} from 'components/Loading';

export const ListingProjects = () => {
  const {account, library} = useActiveWeb3React();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: {timeStamp},
  } = useAppSelector(selectTransactionType);

  useEffect(() => {
    async function fetchProjectsData() {
      const starterReq = await fetch(fetchStarterURL)
        .then((res) => res.json())
        .then((result) => result);

      const starterData = starterReq.datas;
      const nowTimeStamp = moment().unix();

      const adminAccount = '';

      // const filteredStarterData =
      //   adminAccount === account
      //     ? starterData
      //     : starterData.filter((data: AdminObject) => {
      //         return data.adminAddress === account;
      //     });

      const filteredStarterData = starterData;

      const res = await Promise.all(
        filteredStarterData.map(async (data: any) => {
          console.log('--data--');
          console.log(data);
          const {
            endAddWhiteTime,
            endExclusiveTime,
            endDepositTime,
            saleContractAddress,
          } = data;
          const saleAmount =
            data.name === 'DOOR OPEN'
              ? await AdminActions.getSaleAmount({
                  library,
                  address: saleContractAddress,
                })
              : '';
          const checkStep =
            endAddWhiteTime > nowTimeStamp
              ? 'Whitelist'
              : endExclusiveTime > nowTimeStamp
              ? 'Public Round 1'
              : endDepositTime > nowTimeStamp
              ? 'Public Round 2'
              : 'Claim';
          return {...data, status: checkStep, saleAmount};
        }),
      );
      if (res[0] !== undefined) {
        setProjects(res);
        return setLoading(false);
      } else {
        setProjects([]);
        return setLoading(false);
      }
    }
    fetchProjectsData();
  }, [account, library, timeStamp]);

  const dummyData: {
    data: any[];
    columns: any;
    isLoading: boolean;
  } = {
    data: projects,
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
    isLoading: loading,
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
        {isLoading === true && <LoadingComponent></LoadingComponent>}
        {data.length > 0 && isLoading === false && (
          <ListTable
            data={data}
            columns={columns}
            isLoading={isLoading}></ListTable>
        )}
      </Flex>
      <DistributeModal></DistributeModal>
    </Flex>
  );
};
