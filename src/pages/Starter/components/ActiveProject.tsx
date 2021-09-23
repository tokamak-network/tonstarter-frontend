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

type ActiveProjectProp = {
  activeProject: any[];
};

export const ActiveProject = (props: ActiveProjectProp) => {
  const {activeProject} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column">
      <Text
        {...STATER_STYLE.header({colorMode})}
        alignSelf="center"
        mb={'30px'}>
        Active Projects
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {activeProject.map((project) => {
          const tokenType = checkTokenType(
            '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
          );
          return (
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
                  <Circle bg={project.isOpen ? '#2ea2f8' : '#f95359'}></Circle>
                  <Text
                    fontSize={'16px'}
                    color="gray.125"
                    fontWeight={600}
                    ml={'7px'}>
                    Exclusive Sale
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
                  <Text mr={2} {...STATER_STYLE.progress.mainText({colorMode})}>
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
                  <Text>0.00</Text>
                  <Text>/</Text>
                  <Text>5000000</Text>
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
                        1
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
                        1
                      </Text>
                      <Text>EVE</Text>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Flex>
  );
};
