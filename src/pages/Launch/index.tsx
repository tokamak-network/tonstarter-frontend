import {Flex, useTheme, Button, Grid, GridItem, Text} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import MainScreen from '@Launch/MainScreen';
import useWeb3Token from '@Launch/hooks/useWeb3Token';
import {Link, useRouteMatch} from 'react-router-dom';
import {fetchProjects} from '@Launch/launch.reducer';
import {useAppDispatch} from 'hooks/useRedux';
import LaunchPage from '@Launch/LaunchPage';

const OpenCampagin = () => {
  const {account} = useActiveWeb3React();
  // const {web3Token} = useWeb3Token();
  const dispatch = useAppDispatch();

  const [projectsData, setProjectsData] = useState<any>(undefined);
  const [originData, setOriginData] = useState<any>(undefined);

  // const {data, isLoading, error} = useQuery(
  //   ['test'],
  //   () =>
  //     axios.get(fetchCampaginURL, {
  //       headers: {
  //         account,
  //       },
  //     }),
  //   {
  //     enabled: !!account,
  //     //refetch every 10min
  //     refetchInterval: 600000,
  //   },
  // );

  // useEffect(() => {
  //   if (data) {
  //     const {data: datas} = data;
  //     dispatch(fetchProjects({data: datas}));
  //     setProjectsData(
  //       Object.keys(datas).map((k) => {
  //         return {name: datas[k].projectName, key: k};
  //       }),
  //     );
  //   }
  // }, [data, dispatch]);

  // useEffect(() => {
  //   console.log('--data--');
  //   console.log(data);
  // }, [data]);

  const match = useRouteMatch();
  const {url} = match;

  //test

  // if (isLoading) {
  //   return <div>loading..</div>;
  // }

  return (
    <Flex flexDir="column" mt={'78px'} alignItems="center">
    
      {/* <MainScreen></MainScreen> */}
      <LaunchPage />
    </Flex>
  );
};

export default OpenCampagin;
