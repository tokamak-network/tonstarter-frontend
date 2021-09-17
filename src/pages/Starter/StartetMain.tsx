import {Flex} from '@chakra-ui/react';
import {UpcomingProject} from './components/UpcomingProject';

export const StarterMain = () => {
  return (
    <Flex flexDir="column">
      <Flex h={510}>banner</Flex>
      <Flex>
        <UpcomingProject></UpcomingProject>
      </Flex>
    </Flex>
  );
};
