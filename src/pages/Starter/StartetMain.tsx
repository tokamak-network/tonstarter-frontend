import {Flex} from '@chakra-ui/react';
import {ActiveProject} from './components/ActiveProject';
import {PastProject} from './components/PastProject';
import {UpcomingProject} from './components/UpcomingProject';

export const StarterMain = () => {
  const activeProject = [
    {
      name: 'Realm',
    },
  ];
  return (
    <Flex flexDir="column">
      <Flex h={510}>banner</Flex>
      <Flex px={363}>
        <Flex>
          <ActiveProject activeProject={activeProject}></ActiveProject>
        </Flex>
        <Flex>
          <UpcomingProject></UpcomingProject>
        </Flex>
        <Flex>
          <PastProject></PastProject>
        </Flex>
      </Flex>
    </Flex>
  );
};
