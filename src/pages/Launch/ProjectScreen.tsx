import {Flex, Box, Text, Button} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {PageHeader} from 'components/PageHeader';
import {Project} from './components/Projects/Project';
import {useModal} from 'hooks/useModal';
import CreateRewardsProgramModal from './components/modals/CreateRewardsProgram';
import DownloadModal from './components/modals/Download';
import {useRouteMatch} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectLaunch, setHashKey} from '@Launch/launch.reducer';
const ProjectScreen = () => {
  const {openAnyModal} = useModal();
  const history = useHistory();

  const goBackToList = useCallback(() => {
    history.push('/opencampagin');
  }, []);
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[3];
  const dispatch = useAppDispatch();
console.log('isExist',isExist);
const {
  //@ts-ignore
  params: {id},
} = match;
  const {
    data: {projects, hashKey},
  } = useAppSelector(selectLaunch);

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
        //   onClick={() => openAnyModal('Launch_CreateRewardProgram', {})}
        onClick={() => goBackToList()}
          >
          Back to List
        </Button>
        <Button
        mt={'20px'}
          w={'180px'}
          h={'45px'}
          bg={'#257eee'}
          fontSize={'14px'}
          color={'white.100'}
          onClick={() => openAnyModal('Launch_CreateRewardProgram', {})}
        // onClick={() => goBackToList()}
          >
          Create Reward Program
        </Button>
      </Flex>
      <CreateRewardsProgramModal />
      <DownloadModal/>
    </Flex>
  );
};

export default ProjectScreen;
