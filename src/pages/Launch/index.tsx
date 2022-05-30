import {Flex} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {fetchProjects} from '@Launch/launch.reducer';
import {useAppDispatch} from 'hooks/useRedux';
import LaunchPage from '@Launch/LaunchPage';

const OpenCampagin = () => {
  const {account} = useActiveWeb3React();
  // const {web3Token} = useWeb3Token();
  const dispatch = useAppDispatch();

  const [projectsData, setProjectsData] = useState<any>(undefined);
  const [originData, setOriginData] = useState<any>(undefined);
  const [numProjects, setNumProjects] = useState<number>(0);

  const {data, isLoading, error} = useQuery(
    ['launchProjects'],
    () =>
      axios.get(fetchCampaginURL, {
        headers: {
          account,
        },
      }),
    {
      enabled: !!account,
      refetchInterval: 600000,
    },
  );

  useEffect(() => {
    if (data) {
      const {data: datas} = data;
      dispatch(fetchProjects({data: datas}));
      const projects = Object.keys(datas).map((k) => {
        const stat = datas[k].vaults.every((vault: any) => {
          return vault.isSet === true;
        });
        return {name: datas[k].projectName, key: k,isSet: stat}
      })
      const filteredProjects = projects.filter(
        (project: any) => project.isSet === true,
      );

      setNumProjects(filteredProjects.length)
      setProjectsData(projects);
    }
  }, [data, dispatch]);

  const match = useRouteMatch();
  const {url} = match;

  //test
  
  // if (isLoading) {
  //   return <div>loading..</div>;
  // }
  return (
    <Flex flexDir="column" mt={'78px'} alignItems="center">
      <LaunchPage numPairs={numProjects+4}/>
    </Flex>
  );
};

export default OpenCampagin;
