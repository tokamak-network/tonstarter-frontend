import {Box, Button, Flex, useTheme, Link, Text} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {PageHeader} from 'components/PageHeader';
import {useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import AllProjects from '@Launch/components/AllProjects';
import MyProjects from '@Launch/components/MyProjects';

const LaunchPage = () => {
  const [showAllProjects, setShowAllProjects] = useState<boolean>(true);
  const theme = useTheme();
  const match = useRouteMatch();
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {
    data: {projects},
  } = useAppSelector(selectLaunch);
  const {url} = match;

  // console.log('--gogo--');
  // console.log(id);
  // console.log(projects);

  // useEffect(() => {
  //   console.log(projects);
  // }, [projects]);

  //   let historyObj = useHistory();

  //   useEffect(() => {
  //     //@ts-ignore
  //     const unBlock = historyObj.block((loc, action) => {
  //       if (action === 'POP') {
  //         return window.confirm('Are you sure you want to go back?');
  //       }
  //     });
  //     return () => unBlock();
  //   }, [historyObj]);

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={'50px'}
      mb={'100px'}>
      <Flex
        alignItems={'space-between'}
        flexDirection={'column'}
        height={'200px'}>
        <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
          <PageHeader
            title={'Launch'}
            subtitle={'Make your own token and create a token economy.'}
          />
        </Flex>
        <Flex justifyContent={'center'} w={'100%'}>
          <Link to={`${url}/createproject`}>
            <Button bg={'blue.100'} color="white.100">
              Create Project
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Flex justifyContent={'space-between'} paddingX={'20%'} mb={'100px'}>
        <Flex alignItems={'center'} flexDir="column">
          <Text color={'yellow'}>Total Staked</Text>
          <Text>2,646,790.91 TON</Text>
        </Flex>
        <Flex alignItems={'center'} flexDir="column">
          <Text color={'yellow'}>Total Value Locked</Text>
          <Text>2,646,790.91 TON</Text>
        </Flex>
        <Flex alignItems={'center'} flexDir="column">
          <Text color={'yellow'}>Total Staked</Text>
          <Text>2,646,790.91 TON</Text>
        </Flex>
      </Flex>

      <Box display={'flex'} justifyContent={'center'}>
        <Button
          w={'70px'}
          h={'26px'}
          bg={'transparent'}
          border={'solid 1px #d7d9df'}
          borderRadius={'3px 0px 0px 3px'}
          fontSize={'12px'}
          fontFamily={theme.fonts.roboto}
          _hover={{background: 'transparent'}}
          _active={{
            background: 'transparent',
            border: 'solid 1px #2a72e5',
            color: '#2a72e5',
          }}
          onClick={() => {
            setShowAllProjects(true);
          }}
          isActive={showAllProjects}>
          All
        </Button>
        <Button
          w={'70px'}
          h={'26px'}
          bg={'transparent'}
          border={'solid 1px #d7d9df'}
          borderRadius={'0px 3px 3px 0px'}
          fontSize={'12px'}
          _hover={{
            background: 'transparent',
            border: 'solid 1px #2a72e5',
            color: '#2a72e5',
          }}
          _active={{
            background: 'transparent',
            border: 'solid 1px #2a72e5',
            color: '#2a72e5',
          }}
          onClick={() => {
            setShowAllProjects(false);
          }}
          isActive={!showAllProjects}>
          My
        </Button>
      </Box>
      {showAllProjects ? <AllProjects /> : <MyProjects />}
    </Flex>
  );
};

export default LaunchPage;
