import {
  Box,
  Flex,
  useTheme,
  Text,
  Grid,
  Heading,
  Select,
  Tooltip,
  Center,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
// import {PageHeader} from 'components/PageHeader';
import {useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import FeaturedProjects from '../components/FeaturedProjects';
import ProjectCard from '../components/ProjectCard';
import {useActiveWeb3React} from 'hooks/useWeb3';
// import {allProjectsData} from './FakeData';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import LaunchGuide from './LaunchGuide';
import {fetchCampaginURL} from 'constants/index';
import {useQuery} from 'react-query';
import axios from 'axios';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchProjects} from '@Launch/launch.reducer';
const AllProjects = () => {
  const theme = useTheme();
  const match = useRouteMatch();
  const {account} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const dispatch = useAppDispatch();
  const [projectsData, setProjectsData] = useState<any>([]);
  const {
    //@ts-ignore
    params: {id},
  } = match;

  const {data, isLoading, error} = useQuery(
    ['test'],
    () =>
      axios.get(fetchCampaginURL, {
        headers: {
          account,
        },
      }),
    {
      enabled: !!account,
      //refetch every 10min
      refetchInterval: 600000,
    },
  );
  const {
    data: {projects},
  } = useAppSelector(selectLaunch);

  useEffect(() => {
    if (data) {
      const {data: datas} = data;
      dispatch(fetchProjects({data: datas}));
      const projects = Object.keys(datas).map((k) => {
        const stat = datas[k].vaults.every((vault: any) => {
          return vault.isSet === true;
        });
        return {key: k, data: datas[k], isSet: stat};
      });

      const filteredProjects = projects.filter(
        (project: any) => project.isSet === true,
      );

      setProjectsData(filteredProjects);
    }
  }, [data, dispatch]);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return projectsData.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const pagenumber = parseInt(
      ((projectsData.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [projectsData, pageLimit, pageLimit]);

  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  return (
    <Flex flexDir={'column'} justifyContent={'center'} w={'100%'} mb={'100px'}>
      {/* <FeaturedProjects /> */}
      <Box display={'flex'} justifyContent={'center'} flexDir={'column'}>
        <Box display={'flex'} justifyContent={'center'} mt={'20px'} mb={'35px'}>
          <Text
            fontSize={'32px'}
            fontWeight={'bold'}
            fontFamily={theme.fonts.titil}
            color={colorMode === 'dark' ? '#fff' : '#3d495d'}>
            All Projects
          </Text>
        </Box>
        <Flex justifyContent={'center'}>
          <Grid templateColumns="repeat(3, 1fr)" gap={30}>
            {getPaginatedData().map((project: any, index: number) => {
              return <ProjectCard project={project} index={index} />;
            })}
          </Grid>
        </Flex>
        <Flex
          flexDirection={'row'}
          h={'25px'}
          alignItems={'center'}
          justifyContent={'end'}
          width={'1200px'}
          margin={'25px auto 0'}>
          <Flex>
            <Tooltip label="Previous Page">
              <IconButton
                minW={'24px'}
                h={'24px'}
                bg={colorMode === 'light' ? 'white.100' : 'none'}
                border={
                  colorMode === 'light'
                    ? 'solid 1px #e6eaee'
                    : 'solid 1px #424242'
                }
                color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                borderRadius={4}
                aria-label={'Previous Page'}
                onClick={gotToPreviousPage}
                isDisabled={pageIndex === 1}
                size={'sm'}
                mr={4}
                _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>
          <Flex
            alignItems="center"
            p={0}
            fontSize={'13px'}
            fontFamily={theme.fonts.roboto}
            color={colorMode === 'light' ? '#3a495f' : '#949494'}>
            <Text flexShrink={0}>
              Page{' '}
              <Text fontWeight="bold" as="span" color={'blue.300'}>
                {pageIndex}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {pageOptions}
              </Text>
            </Text>
          </Flex>
          <Flex>
            <Tooltip label="Next Page">
              <Center>
                <IconButton
                  minW={'24px'}
                  h={'24px'}
                  border={
                    colorMode === 'light'
                      ? 'solid 1px #e6eaee'
                      : 'solid 1px #424242'
                  }
                  color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                  bg={colorMode === 'light' ? 'white.100' : 'none'}
                  borderRadius={4}
                  aria-label={'Next Page'}
                  onClick={goToNextPage}
                  isDisabled={pageIndex === pageOptions}
                  size={'sm'}
                  ml={4}
                  mr={'1.5625em'}
                  _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                  icon={<ChevronRightIcon h={6} w={6} />}
                />
              </Center>
            </Tooltip>
            <Select
              w={'117px'}
              h={'32px'}
              mr={1}
              color={colorMode === 'light' ? ' #3e495c' : '#f3f4f1'}
              bg={colorMode === 'light' ? 'white.100' : 'none'}
              boxShadow={
                colorMode === 'light'
                  ? '0 1px 1px 0 rgba(96, 97, 112, 0.14)'
                  : ''
              }
              border={colorMode === 'light' ? '' : 'solid 1px #424242'}
              borderRadius={4}
              size={'sm'}
              value={pageLimit}
              fontFamily={theme.fonts.roboto}
              onChange={(e) => {
                setPageIndex(1);
                setPageLimit(Number(e.target.value));
              }}>
              {[3, 6, 9, 12].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Box>
      <LaunchGuide />
    </Flex>
  );
};

export default AllProjects;
