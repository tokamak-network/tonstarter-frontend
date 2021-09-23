import {Flex, Box} from '@chakra-ui/react';
import {Banner} from './components/Banner';
import {ActiveProject} from './components/ActiveProject';
import {PastProject} from './components/PastProject';
import {UpcomingProject} from './components/UpcomingProject';
import {I_StarterProject} from '@Starter/types';

export const StarterMain = () => {
  const activeProject: I_StarterProject[] = [
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
  ];
  const upcomingProject: I_StarterProject[] = [
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
  ];
  const pastProject: I_StarterProject[] = [
    {
      name: 'Realm',
      saleStart: '2021.11.5',
      saleEnd: '2021.11.5',
      isOpen: true,
    },
  ];
  return (
    <Flex flexDir="column">
      <Flex mb={'60px'}>
        <Banner></Banner>
      </Flex>
      <Flex px={353} flexDir="column">
        <Box mb={'80px'}>
          <ActiveProject activeProject={activeProject}></ActiveProject>
        </Box>
        <Box mb={'80px'}>
          <UpcomingProject upcomingProject={upcomingProject}></UpcomingProject>
        </Box>
        <Box mb={'100px'}>
          <PastProject pastProject={pastProject}></PastProject>
        </Box>
      </Flex>
    </Flex>
  );
};
