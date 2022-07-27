import {Text, Flex, Box, useColorMode, useTheme} from '@chakra-ui/react';

import {FC, useRef} from 'react';
import {useEffect, useMemo, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import {MyProjectTable} from './Projects/MyProjectTable';
import {fetchCampaginURL} from 'constants/index';
import {useQuery} from 'react-query';
import store from 'store';
import axios from 'axios';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchProjects} from '@Launch/launch.reducer';
import {DEPLOYED, BASE_PROVIDER} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import {getSigner} from 'utils/contract';
import * as ProjectTokenABI from 'services/abis/ProjectToken.json';
import {selectTransactionType} from 'store/refetch.reducer';

const MyProjects = () => {
  const theme = useTheme();
  // const match = useRouteMatch();
  const {colorMode} = useColorMode();
  const [projectsData, setProjectsData] = useState<any>([]);
  const dispatch = useAppDispatch();
  const {account, library, chainId} = useActiveWeb3React();
  const [projectsForTable, setProjectsForTable] = useState<any>();
  const starterData = store.getState().starters.data;
  const {ProjectTokenProxy} = DEPLOYED;
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [uriArray, setUriArray] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
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

  const ProjectToken = new Contract(
    ProjectTokenProxy,
    ProjectTokenABI.abi,
    library,
  );
  useEffect(() => {
    async function getData () {
      if (data) {
      if (account === null || account === undefined || library === undefined) {
          return;
        }
        const tokensOfOwner = await ProjectToken.tokensOfOwner(account);
        const uris = await Promise.all(
          tokensOfOwner.map(async (token: any) => {
            const uriObj = await ProjectToken.tokenURIValue(token);
            return {...token, uriObj};
          }),
        ); 

        const {data: datas} = data;
        dispatch(fetchProjects({data: datas}));
        setProjectsForTable(datas);
        const projs = Object.keys(datas).map((k) => {
          const listed = starterData.rawData.some((el) => el.projectKey === k);
          let stat
          if (datas[k].vaults !== undefined) {
            const statss = datas[k].vaults.every((vault: any) => {
              return vault.isSet === true;
            });
            stat = statss
          }
         else {
          stat = false
         }
          const div = document.createElement('div');
          div.innerHTML = datas[k].description;
          const projectURIUnformatted = {
            name: datas[k].projectName,
            description: div.textContent,
            external_url: datas[k].website,
            image: datas[k].tokenSymbolImage,
            attributes: datas[k].vaults?.map((vault: any) => {
              return {
                trait_type: vault.vaultName,
                value: vault.vaultAddress,
              };
            }),
          };
          
          const projectURIFormatted = `${JSON.stringify(projectURIUnformatted)}`;
        const tokenInArray:any = uris.filter((uri:any) => 
          uri.uriObj === projectURIFormatted
        )
        let tokenID;
        
        if (tokenInArray.length !== 0) {
          tokenID = tokenInArray[0]._hex
        }
        else {
          tokenID = null
        }
          return {
            key: k,
            name: datas[k].projectName? datas[k].projectName : '-',
            tokenName: datas[k].tokenName? datas[k].tokenName: '-',
            tokenSymbol: datas[k].tokenSymbol? datas[k].tokenSymbol: '-',
            totalSupply: datas[k].totalSupply?Number(datas[k].totalSupply).toLocaleString(undefined, {
              minimumFractionDigits: 0,
            })  : '-',
            owner: datas[k].ownerAddress,
            saleDate: datas[k].vaults?  [
              datas[k].vaults[0].whitelist?datas[k].vaults[0].whitelist:0,
              datas[k].vaults[0].publicRound2End?datas[k].vaults[0].publicRound2End:0,
            ]:[0,0],
            whiteList: datas[k].vaults?  datas[k].vaults[0].whitelist: 0,
            public2End:datas[k].vaults?   datas[k].vaults[0].publicRound2End:0,
            status: stat,
            project: datas[k],
            listed: listed,
            tokenID:tokenID
          };
        });
        const MyProjs = projs.filter((pro: any) => pro.owner === account);
  
        setProjectsData(MyProjs);
        setIsProcessing(isProcessing && isLoading)
      }
    }
    getData()
  }, [data, dispatch, account,transactionType, blockNumber, library]);

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
    <Flex flexDir={'row'} alignSelf="center" w={'1102px'} h={'100%'}>
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
            isLoading={isProcessing}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default MyProjects;
