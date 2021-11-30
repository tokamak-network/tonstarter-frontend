import {TokenImage} from '@Admin/components/TokenImage';
import {
  Grid,
  GridItem,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
} from '@chakra-ui/react';
import {UpcomingProjectType} from '@Starter/types';
import DoMToken from 'assets/banner/DoM.png';

type UpcomingProjectProp = {
  upcomingProject: UpcomingProjectType[];
};

export const UpcomingProject = (props: UpcomingProjectProp) => {
  const {upcomingProject} = props;
  // const match = useRouteMatch();
  // const {url} = match;

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column">
      <Text
        {...STATER_STYLE.header({colorMode})}
        alignSelf="center"
        mb={'30px'}>
        Upcoming Projects
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {upcomingProject.map((project: UpcomingProjectType) => {
          return (
            <GridItem
              {...STATER_STYLE.containerStyle({colorMode})}
              h={'235px'}
              cursor={'pointer'}
              // _hover={{}}
              onClick={(e) => {
                e.preventDefault();
                window.open(`${project.website}`);
              }}>
              <Flex justifyContent="space-between" mb={15}>
                {/* <TokenImage imageLink={project.tokenSymbolImage}></TokenImage> */}
                <TokenImage imageLink={DoMToken}></TokenImage>
              </Flex>
              <Flex flexDir="column" mb={'25px'}>
                <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
                  {/* {project.name} */}
                  Dragons of Midgard
                </Text>
                <Flex>
                  <Text
                    mr={2}
                    {...STATER_STYLE.subText({colorMode})}
                    color={'gray.150'}>
                    Sale Date
                  </Text>
                  <Text {...STATER_STYLE.subTextBlack({colorMode})}>
                    {/* {project.saleStart} ~ {project.saleEnd} */}
                    2021.12.14. ~ 12.21.
                  </Text>
                </Flex>
              </Flex>
              <Flex>
                <Box d="flex" flexDir="column" mr={'20px'}>
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}
                    color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
                    Total Raise
                  </Text>
                  <Box d="flex" alignItems="baseline">
                    <Text
                      mr={1}
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 20,
                      })}>
                      {project.tokenFundRaisingTargetAmount}
                    </Text>
                    <Text>{project.fundingTokenType}</Text>
                  </Box>
                </Box>
                <Box d="flex" flexDir="column">
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}
                    color={colorMode === 'light' ? 'gray.125' : 'gray.475'}>
                    Sector
                  </Text>
                  <Text
                    mr={1}
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 20,
                    })}>
                    P2E
                  </Text>
                </Box>
              </Flex>
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
};
