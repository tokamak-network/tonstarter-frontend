import {Flex, Box, Center} from '@chakra-ui/react';
import {Banner} from './components/Banner';
import {ActiveProject} from './components/ActiveProject';
import {PastProject} from './components/PastProject';
import {UpcomingProject} from './components/UpcomingProject';
import {MyProject} from './components/MyProject';
import {
  ActiveProjectType,
  UpcomingProjectType,
  PastProjectType,
} from '@Starter/types';
import store from 'store';
import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {LoadingComponent} from 'components/Loading';
import {useBlockNumber} from 'hooks/useBlock';

export const StarterMain = () => {
  const starterData = store.getState().starters.data;
  const {chainId, account} = useActiveWeb3React();
  const [activeProject, setActiveProject] = useState<ActiveProjectType[]>([]);
  const [upcomingProject, setUpcomingProject] = useState<UpcomingProjectType[]>(
    [],
  );
  const [pastProject, setPastProject] = useState<PastProjectType[]>([]);
  const [myProject, setMyProject] = useState<any[]>([]);
  const [pending, setPending] = useState<boolean>(true);
  const {blockNumber} = useBlockNumber();

  useEffect(() => {
    if (starterData) {
      const {activeProjects, upcomingProjects, pastProjects, myProjects} =
        starterData;
      if (
        activeProjects.length > 0 ||
        upcomingProjects.length > 0 ||
        pastProjects.length > 0
      ) {
        setActiveProject(activeProjects);
        setUpcomingProject(upcomingProjects);
        setPastProject(pastProjects);
        setMyProject(myProjects);
        setPending(false);
      }
    }
  }, [starterData, chainId, blockNumber]);

  return (
    <Flex flexDir="column" w={'100%'} alignItems="center" h={'100vh'}>
      <Flex mb={'60px'} w={'100%'}>
        <Banner></Banner>
      </Flex>
      {/* {pending === true ? (
        <Center>
          <LoadingComponent />
        </Center>
      ) : null}
      <Flex px={353} flexDir="column" alignItems="center" mt={'80px'}>
        {activeProject.length > 0 && (
          <Box mb={'80px'}>
            <ActiveProject activeProject={activeProject}></ActiveProject>
          </Box>
        )}
        {account && myProject.length > 0 && (
          <Box mb={'80px'}>
            <MyProject myProject={myProject}></MyProject>
          </Box>
        )}
        {upcomingProject.length > 0 && (
          <Box mb={'80px'}>
            <UpcomingProject
              upcomingProject={upcomingProject}></UpcomingProject>
          </Box>
        )}
        {pastProject.length > 0 && (
          <Box mb={'100px'}>
            <PastProject pastProject={pastProject}></PastProject>
          </Box>
        )}
      </Flex> */}
    </Flex>
  );
};
