import {Box, Button, Flex, useTheme, Text} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {PageHeader} from 'components/PageHeader';
import {useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';

const MyProjects = () => {
  const theme = useTheme();
  const match = useRouteMatch();
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {
    data: {projects},
  } = useAppSelector(selectLaunch);

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={100}
      mb={'100px'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader title={'Projects'} />
      </Flex>
      <Box display={'flex'} justifyContent={'center'}>
        <Text>My Projects</Text>
      </Box>
    </Flex>
  );
};

export default MyProjects;
