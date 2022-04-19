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
import {featuredProjectsData} from '../components/FakeData';

const FeaturedProjects = () => {
  const theme = useTheme();

  return (
    <Flex flexDir={'column'} justifyContent={'center'} w={'100%'} my={'50px'}>
      <Box display={'flex'} justifyContent={'center'} mb={'20px'}>
        <Heading as="h2" fontSize={'2xl'}>
          Featured Projects
        </Heading>
      </Box>
      <Flex justifyContent={'center'}>
        <Grid templateColumns="repeat(3, 1fr)" gap={30}>
          {featuredProjectsData.map((project, index) => {
            return <ProjectCard project={project} index={index} />;
          })}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default FeaturedProjects;
