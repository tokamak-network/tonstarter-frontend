import {Flex, Box} from '@chakra-ui/react';
import {Banner} from './components/Banner';
import {ActiveProject} from './components/ActiveProject';
import {PastProject} from './components/PastProject';
import {UpcomingProject} from './components/UpcomingProject';
import {
  ActiveProjectType,
  UpcomingProjectType,
  PastProjectType,
} from '@Starter/types';
import store from 'store';
import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';

export const StarterMain = () => {
  const starterData = store.getState().starters.data;
  const {chainId} = useActiveWeb3React();
  const [activeProject, setActiveProject] = useState<ActiveProjectType[]>([]);
  const [upcomingProject, setUpcomingProject] = useState<UpcomingProjectType[]>(
    [],
  );
  const [pastProject, setPastProject] = useState<PastProjectType[]>([]);

  useEffect(() => {
    if (starterData) {
      const {activeProjects, upcomingProjects, pastProjects} = starterData;
      setActiveProject(activeProjects);
      setUpcomingProject(upcomingProjects);
      setPastProject(pastProjects);
    }
  }, [starterData, chainId]);

  return (
    <Flex flexDir="column" w={'100%'} alignItems="center">
      <Flex mb={'60px'} w={'100%'}>
        <Banner></Banner>
      </Flex>
      <Flex px={353} flexDir="column" alignItems="center">
        {activeProject.length > 0 && (
          <Box mb={'80px'}>
            <ActiveProject activeProject={activeProject}></ActiveProject>
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
      </Flex>
    </Flex>
  );
};
