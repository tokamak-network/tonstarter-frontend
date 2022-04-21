import {Flex, Box, Text, Button} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {PageHeader} from 'components/PageHeader';
import {Project} from './components/Projects/Project';
import {useModal} from 'hooks/useModal';
import CreateRewardsProgramModal from './components/modals/CreateRewardsProgram';
const ProjectScreen = () => {
  const {openAnyModal} = useModal();
  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={100}
      mb={'100px'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Project'}
          subtitle={'Make Your Own Token and Create Token Economy'}
        />
        <Flex mt={'60px'} mb={'50px'}>
          <Project name={'Project Name'} />
        </Flex>
        <Button
          w={'180px'}
          h={'45px'}
          bg={'#257eee'}
          fontSize={'14px'}
          color={'white.100'}
          onClick={() => openAnyModal('Launch_CreateRewardProgram', {})}>
          List
        </Button>
      </Flex>
      <CreateRewardsProgramModal />
    </Flex>
  );
};

export default ProjectScreen;
