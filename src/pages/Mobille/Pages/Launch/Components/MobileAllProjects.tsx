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
  Icon,
  Button,
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
import {ChevronRightIcon, ChevronLeftIcon,ChevronUpIcon} from '@chakra-ui/icons';
import MobileLaunchGuide from './MobileLaunchGuide';
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
    const startIndex = 0;
    const endIndex = startIndex + pageLimit * pageIndex;
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
          color={colorMode === 'light' ? '#304156' : '#848c98'}>
          <Text fontWeight={'bold'}>{projectsData.length}</Text>
          <Text ml={'2px'}> Results</Text>
        </Flex>

        <Select
          w={'110px'}
          h={'32px'}
          border={'3px solid red'}
          mr={1}
          color={colorMode === 'light' ? ' #3e495c' : '#f3f4f1'}
          bg={colorMode === 'light' ? 'white.100' : 'none'}
          boxShadow={
            colorMode === 'light' ? '0 1px 1px 0 rgba(96, 97, 112, 0.14)' : ''
          }
          // border={colorMode === 'light' ? '' : 'solid 1px #424242'}
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
          {getPaginatedData().map((project: any, index: number) => {
            return <MobileProjectCard project={project} index={index} />;
          })}
        </Grid>
      ) : (
        <></>
      )}
      {pageIndex !== pageOptions ? (
        <Button
          w={'320px'}
          mt={'10px'}
          justifyContent={'center'}
          alignItems={'center'}
          border={
            colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #535353'
          }
          borderRadius={'15px'}
          fontSize={'16px'}
          fontFamily={theme.fonts.fld}
          bg={colorMode === 'light' ? '#fff' : 'transparent'}
          color={colorMode === 'light' ? '#86929d' : '#dee4ef'}
          _focus={{}}
          _active={{}}
          onClick={() => setPageIndex(pageIndex + 1)}>
          MORE +
        </Button>
      ) : (
        <></>
      )}
      <MobileLaunchGuide />
      <Flex justifyContent={'flex-end'} w={'320px'} mb={'20px'} mt={'-10px'}>
        <Box
          h={'40px'}
          w={'40px'}
          border={
            colorMode === 'light' ? 'none' : '1px solid #535353'
          }
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderRadius='50%'
          boxShadow= '0 2px 5px 0 rgba(61, 73, 93, 0.1)'
          bg={colorMode === 'light' ? '#fff' : 'transparent'} 
          onClick={()=> window.scrollTo(0, 0)}>
            <ChevronUpIcon h={'2em'} w={'2em'}/>
          </Box>
      </Flex>
    </Flex>
  );
};

export default MobileAllProjects;
