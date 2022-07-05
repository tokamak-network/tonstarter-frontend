import {
  Flex,
  Box,
  Text,
  Button,
  useColorMode,
  useTheme,
  Image,
  IconButton,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {PageHeader} from 'components/PageHeader';
import {ChevronUpIcon} from '@chakra-ui/icons';
//   import {Project} from './components/Projects/Project';
import {useModal} from 'hooks/useModal';
//   import CreateRewardsProgramModal from './components/modals/CreateRewardsProgram';
//   import DownloadModal from './components/modals/Download';
import {useRouteMatch} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectLaunch, setHashKey, fetchProjects} from '@Launch/launch.reducer';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {LoadingComponent} from 'components/Loading';
import Back from 'assets/svgs/Back.svg';
import BackWhite from 'assets/svgs/BackWhite.svg';
import {MobileProject} from './Components/MobileProject';

const MobileProjectScreen = () => {
  const {openAnyModal} = useModal();
  const history = useHistory();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account} = useActiveWeb3React();
  const [project, setProject] = useState<any>();
  const goBackToList = useCallback(() => {
    history.push('/launch');
  }, []);
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[3];
  const dispatch = useAppDispatch();

  const {
    //@ts-ignore
    params: {name},
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

  useEffect(() => {
    if (data) {
      const {data: datas} = data;
      dispatch(fetchProjects({data: datas}));
      setProject(datas[name]);
    }
  }, [data, dispatch]);

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: '#2a72e5',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };
  console.log(project);

  useEffect(() => {
    dispatch(setHashKey({data: isExist === 'project' ? undefined : isExist}));
  }, []);
  // const project = projects[name];
  return (
    <Flex  px={'20px'} flexDir={'column'}>
      <Grid templateColumns="repeat(3, 1fr)" w={'100%'} h={'68px'}>
        <GridItem display={'flex'} alignItems="center">
          <Button
            bg="transparent"
            p={'0px'}
            h={'30px'}
            w={'30px'}
            _focus={{bg: 'transparent'}}
            _active={{bg: 'transparent'}} onClick={() => goBackToList()}>
            <Image src={colorMode === 'light' ? Back : BackWhite} />
          </Button>
        </GridItem>
        <GridItem display={'flex'} alignItems={'center'} justifyContent='center'>
          {project ? (
            <Text
              fontFamily={theme.fonts.fld}
              fontSize="22px"
              textAlign={'center'} color={colorMode=== 'light'? '#3e495c':'#fff'}>
              {project.projectName}
            </Text>
          ) : (
            <></>
          )}
        </GridItem>
        <GridItem></GridItem>
      </Grid>
      {project?  <MobileProject project={project} /> : <LoadingComponent />}
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

export default MobileProjectScreen;
