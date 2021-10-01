import {Flex, Box} from '@chakra-ui/react';
import {Banner} from './components/Banner';
import {ActiveProject} from './components/ActiveProject';
import {PastProject} from './components/PastProject';
import {UpcomingProject} from './components/UpcomingProject';
import {
  I_StarterProject,
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
  const [activeProject, setActiveProject] = useState<
    ActiveProjectType[] | undefined
  >(undefined);
  const [upcomingProject, setUpcomingProject] = useState<
    UpcomingProjectType[] | undefined
  >(undefined);
  const [pastProject, setPastProject] = useState<PastProjectType[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const {activeProjects, upcomingProjects, pastProjects} = starterData;
    setActiveProject(activeProjects);
    setUpcomingProject(upcomingProjects);
    setPastProject(pastProjects);
  }, [starterData, chainId]);

  return (
    <Flex flexDir="column" w={'100%'} alignItems="center">
      <Flex mb={'60px'} w={'100%'}>
        <Banner></Banner>
      </Flex>
      <Flex px={353} flexDir="column" alignItems="center">
        {activeProject && (
          <Box mb={'80px'}>
            <ActiveProject activeProject={activeProject}></ActiveProject>
          </Box>
        )}
        {upcomingProject && (
          <Box mb={'80px'}>
            <UpcomingProject
              upcomingProject={upcomingProject}></UpcomingProject>
          </Box>
        )}
        {pastProject && (
          <Box mb={'100px'}>
            <PastProject pastProject={pastProject}></PastProject>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
