import {Flex, Box, Button} from '@chakra-ui/react';
import {Banner} from './components/Banner';
import {ActiveProject} from './components/ActiveProject';
import {PastProject} from './components/PastProject';
import {UpcomingProject} from './components/UpcomingProject';
import {I_StarterProject} from '@Starter/types';
import {NavLink, useRouteMatch} from 'react-router-dom';

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
      isOpen: false,
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
  const match = useRouteMatch('/');
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
        <Box >
          <NavLink
            to="/starteredit"
            className={match?.isExact ? 'link-match' : 'link'}
            style={{zIndex: 100}}>
            Edit Starter
          </NavLink>
        </Box>
      </Flex>
    </Flex>
  );
};
