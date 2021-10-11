import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Avatar,
  Progress,
} from '@chakra-ui/react';
import {checkTokenType} from 'utils/token';
import {Circle} from 'components/Circle';
import {Link, useRouteMatch} from 'react-router-dom';
import {ActiveProjectType} from '@Starter/types';
import starterActions from '../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import moment from 'moment';

type ActiveProjectProp = {
  activeProject: ActiveProjectType[];
};

export const ActiveProject = (props: any) => {
  const {activeProject} = props;
  const {colorMode} = useColorMode();
  const {library} = useActiveWeb3React();
  const theme = useTheme();
  const match = useRouteMatch();

  const {STATER_STYLE} = theme;
  const {url} = match;

  const [view, setView] = useState(false);

  return (
    <Flex flexDir="column">
      {view && (
        <Text
          {...STATER_STYLE.header({colorMode})}
          alignSelf="center"
          mb={'30px'}>
          Active Projects
        </Text>
      )}
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {activeProject.map((project: any) => {
          const tokenType = checkTokenType(
            '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
          );
          const nowTimeStamp = moment().unix();

          if (nowTimeStamp > project.timeStamps.endOpenSaleTime) {
            return null;
          }

          setView(true);

          return (
            <Link to={`${url}/active/${project.name}`}>
              <Box {...STATER_STYLE.containerStyle({colorMode})}>
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
                  <Flex alignItems="center">
                    <Circle
                      bg={project.isExclusive ? '#f95359' : '#2ea2f8'}></Circle>
                    <Text
                      {...{
                        ...STATER_STYLE.subTextBlack({
                          colorMode,
                          fontSize: 16,
                        }),
                      }}
                      ml={'7px'}>
                      {project.isExclusive ? 'Exclusive Sale' : 'Open Sale'}
                    </Text>
                  </Flex>
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
                <Box
                  d="flex"
                  flexDir="row"
                  justifyContent="space-between"
                  mb={'5px'}>
                  <Flex alignItems="center">
                    <Text
                      mr={2}
                      {...STATER_STYLE.progress.mainText({colorMode})}>
                      Progress
                    </Text>
                    <Text
                      {...STATER_STYLE.progress.percent({
                        colorMode,
                        isZero: true,
                      })}>
                      0%
                    </Text>
                  </Flex>
                  <Flex>
                    <Text>{project.totalRaise}</Text>
                    <Text>/</Text>
                    <Text>{project.tokenFundRaisingTargetAmount}</Text>
                  </Flex>
                </Box>
                <Box mb={'30px'}>
                  <Progress value={80} borderRadius={10} h={'6px'}></Progress>
                </Box>
                <Flex justifyContent="space-between">
                  <Box d="flex" flexDir="column">
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
                      Participants
                    </Text>
                    <Text
                      mr={1}
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 20,
                      })}>
                      10,000
                    </Text>
                  </Box>
                  <Box d="flex" flexDir="column">
                    <Text
                      {...STATER_STYLE.mainText({
                        colorMode,
                        fontSize: 14,
                      })}>
                      Exchange Ratio
                    </Text>
                    <Box d="flex" justifyContent="space-between">
                      <Flex alignItems="baseline">
                        <Text
                          {...STATER_STYLE.mainText({
                            colorMode,
                            fontSize: 20,
                          })}>
                          {project.projectTokenRatio}
                        </Text>
                        <Text>TON</Text>
                      </Flex>
                      <Flex alignItems="center">=</Flex>
                      <Flex alignItems="baseline">
                        <Text
                          {...STATER_STYLE.mainText({
                            colorMode,
                            fontSize: 20,
                          })}>
                          {project.projectFundingTokenRatio}
                        </Text>
                        <Text>{project.tokenName}</Text>
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Link>
          );
        })}
      </Grid>
    </Flex>
  );
};
