import {Text, Flex, Box, useColorMode, useTheme} from '@chakra-ui/react';

import {FC, useRef} from 'react';
import {useEffect, useMemo, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import {MyProjectTable} from './Projects/MyProjectTable';
import {fetchCampaginURL} from 'constants/index';
import {useQuery} from 'react-query';
import axios from 'axios';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchProjects} from '@Launch/launch.reducer';
const MyProjects = () => {
  const theme = useTheme();
  // const match = useRouteMatch();
  const {colorMode} = useColorMode();
  const [projectsData, setProjectsData] = useState<any>([]);
  const dispatch = useAppDispatch();
  const {account} = useActiveWeb3React();
  const [projectsForTable, setProjectsForTable] = useState<any>();
  const datalll = [
    {
      name: 'Dragons of midgard',
      tokenName: 'Dragons Token',
      tokenSymbol: 'DoM',
      totalSupply: 1000000,
      saleDate: [1650007071, 1650259507],
      status: 'Listed on TONStarter',
      action: 'Edit',
    },
  ];
  const {data, isLoading, error} = useQuery(
    ['test'],
    () =>
      axios.get(fetchCampaginURL, {
        headers: {
          account,
        },
      }),
    {
      enabled: !!account,
      //refetch every 10min
      refetchInterval: 600000,
    },
  );
  const {
    data: {projects},
  } = useAppSelector(selectLaunch);

  useEffect(() => {
    if (data) {
      const {data: datas} = data;
      dispatch(fetchProjects({data: datas}));
      setProjectsForTable(datas);
      const projs = Object.keys(datas).map((k) => {
        const stat = datas[k].vaults.every((vault: any) => {
          return vault.isSet === true;
        });
        return {
          key: k,
          name: datas[k].projectName,
          tokenName: datas[k].tokenName,
          tokenSymbol: datas[k].tokenSymbol,
          totalSupply: datas[k].totalSupply,
          owner: datas[k].ownerAddress,
          saleDate: [
            datas[k].vaults[0].whitelist,
            datas[k].vaults[0].publicRound2End,
          ],
          whiteList: datas[k].vaults[0].whitelist,
          public2End: datas[k].vaults[0].publicRound2End,
          status: stat,
          project: datas[k],
        };
      });
      const MyProjs = projs.filter((pro: any) => pro.owner === account);
      console.log('MyProjs', MyProjs);

      setProjectsData(MyProjs);
    }
  }, [data, dispatch, account]);

  const columns = useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'name',
      },
      {
        Header: 'Token Name',
        accessor: 'tokenName',
      },
      {
        Header: 'Token Symbol',
        accessor: 'tokenSymbol',
      },
      {
        Header: 'Token Supply',
        accessor: 'totalSupply',
      },
      {
        Header: 'Sale Date',
        accessor: 'saleDate',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        accessor: 'action',
      },
      // {
      //   Header: 'Key',
      //   accessor: 'key',
      // },
    ],
    [],
  );

  return (
    <Flex
      flexDir={'row'}
      alignSelf="center"
      w={'1102px'}
      h={'100%'}
      mt={'30px'}>
      <Box display={'flex'} flexDir={'column'}>
        <Text
          ml={'30px'}
          fontSize={'20px'}
          fontWeight={600}
          fontFamily={theme.fonts.roboto}
          color={colorMode === 'light' ? '#304156' : 'white.100'}>
          Owned Projects
        </Text>
        <Box mt={'20px'}>
          <MyProjectTable
            projects={projectsForTable}
            data={projectsData}
            columns={columns}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default MyProjects;
