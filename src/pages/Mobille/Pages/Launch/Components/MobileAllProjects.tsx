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
//   import FeaturedProjects from '../components/FeaturedProjects';
import MobileProjectCard from './MobileProjectCard';
import {useActiveWeb3React} from 'hooks/useWeb3';
// import {allProjectsData} from './FakeData';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
// import LaunchGuide from './LaunchGuide';
import {fetchCampaginURL} from 'constants/index';
import {useQuery} from 'react-query';
import axios from 'axios';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchProjects} from '@Launch/launch.reducer';

const MobileAllProjects = () => {
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
    ['launchProjects'],
    () =>
      axios.get(fetchCampaginURL, {
        headers: {
          account,
        },
      }),
    {
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
    <Flex
      flexDir={'column'}
      // justifyContent={'center'}
      alignItems={'center'}
      w={'100%'}>
      <Text
        color={colorMode === 'light' ? '#3d495d' : '#fff'}
        fontSize={'20px'}
        fontFamily={theme.fonts.titil}
        fontWeight="bold">
        All Projects
      </Text>
      <Flex
        h={'32px'}
        mt={'10px'}
        px={'20px'}
        w={'100%'}
        flexDir={'row'}
        alignItems={'center'}
        mb={'12px'}
        justifyContent="space-between">
        <Flex
          alignItems={'center'}
          fontSize={'12px'}
          fontFamily={theme.fonts.fld}
          color={colorMode === 'light' ? '#304156' : '#848c98'}
        >
          <Text fontWeight={'bold'}>{projectsData.length}</Text>
          <Text ml={'2px'}> Results</Text>
        </Flex>

        <Select
          w={'110px'}
          h={'32px'}
          mr={1}
          color={colorMode === 'light' ? ' #3e495c' : '#f3f4f1'}
          bg={colorMode === 'light' ? 'white.100' : 'none'}
          boxShadow={
            colorMode === 'light' ? '0 1px 1px 0 rgba(96, 97, 112, 0.14)' : ''
          }
          border={colorMode === 'light' ? '' : 'solid 1px #424242'}
          borderRadius={4}
          size={'sm'}
          // value={pageLimit}
          fontFamily={theme.fonts.roboto}
          //
          fontSize={'13px'}>
          <option value={'Latest'}>Latest</option>
          <option value={'Oldest'}>Oldest</option>
          <option value={'Started'}>Started</option>
          <option value={'Ended'}>Ended</option>
          {/* {[3, 6, 9, 12].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))} */}
        </Select>
      </Flex>
      {projectsData.length !== 0 ? (
        <Grid templateColumns="repeat(1, 1fr)" gap={'20px'}>
          {projectsData.map((project: any, index: number) => {
            return <MobileProjectCard project={project} index={index} />;
          })}
        </Grid>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export default MobileAllProjects;
