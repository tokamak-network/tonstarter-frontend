import {
  Box,
  Button,
  Flex,
  useTheme,
  Text,
  Link,
  Heading,
  Grid,
} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {PageHeader} from 'components/PageHeader';
import {useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import ProjectCard from '../components/ProjectCard';
import {launchGuideData} from '../components/FakeData';

const LaunchGuide = () => {
  const theme = useTheme();

  return (
    <Flex flexDir={'column'} justifyContent={'center'} w={'100%'} my={'50px'}>
      <Box display={'flex'} justifyContent={'center'} mb={'20px'}>
        <Heading as="h2" fontSize={'2xl'}>
          Launch Guide
        </Heading>
      </Box>
      <Flex justifyContent={'center'}>
        <Grid templateColumns="repeat(3, 1fr)" gap={30}>
          {launchGuideData.map((guide, index) => {
            return (
              <Flex
                border={'2px solid gray'}
                padding={'30px'}
                flexDirection={'column'}
                mx={'10px'}>
                <Flex>Guide....</Flex>
                <Flex flexDirection={'column'}>
                  <Text>{guide.title}</Text>
                  <Link href={guide.link}>{guide.link}</Link>
                </Flex>
              </Flex>
            );
          })}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default LaunchGuide;
