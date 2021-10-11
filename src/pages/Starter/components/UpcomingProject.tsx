import {
  Grid,
  GridItem,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import {checkTokenType} from 'utils/token';
// import { useRouteMatch} from 'react-router-dom';

type UpcomingProjectProp = {
  upcomingProject: any[];
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
        {upcomingProject.map((project) => {
          const tokenType = checkTokenType(
            '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
          );
          return (
            // <Link to={`${url}/upcoming/${project.name}`}>
            <GridItem {...STATER_STYLE.containerStyle({colorMode})} h={'235px'}>
              <Flex justifyContent="space-between" mb={15}>
                <Avatar
                  src={tokenType.symbol}
                  backgroundColor={tokenType.bg}
                  bg="transparent"
                  color="#c7d1d8"
                  name="T"
                  h="48px"
                  w="48px"
                />
              </Flex>
              <Flex flexDir="column" mb={'25px'}>
                <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
                  {project.name}
                </Text>
                <Flex>
                  <Text mr={2} {...STATER_STYLE.subText({colorMode})}>
                    Sale Date
                  </Text>
                  <Text {...STATER_STYLE.subTextBlack({colorMode})}>
                    {project.saleStart} ~ {project.saleEnd}
                  </Text>
                </Flex>
              </Flex>
              <Flex>
                <Box d="flex" flexDir="column" mr={'20px'}>
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}>
                    Total Raise
                  </Text>
                  <Box d="flex" alignItems="baseline">
                    <Text
                      mr={1}
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 20,
                      })}>
                      10,000,000
                    </Text>
                    <Text>TON</Text>
                  </Box>
                </Box>
                <Box d="flex" flexDir="column">
                  <Text
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 14,
                    })}>
                    Sector
                  </Text>
                  <Text
                    mr={1}
                    {...STATER_STYLE.mainText({
                      colorMode,
                      fontSize: 20,
                    })}>
                    DeFI
                  </Text>
                </Box>
              </Flex>
            </GridItem>
            // </Link>
          );
        })}
      </Grid>
    </Flex>
  );
};
