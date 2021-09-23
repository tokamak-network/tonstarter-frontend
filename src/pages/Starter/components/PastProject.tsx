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

type PastProjectProp = {
  pastProject: any[];
};

export const PastProject = (props: PastProjectProp) => {
  const {pastProject} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column">
      <Text
        {...STATER_STYLE.header({colorMode})}
        alignSelf="center"
        mb={'30px'}>
        Past Projects
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={30}>
        {pastProject.map((project) => {
          const tokenType = checkTokenType(
            '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
          );
          return (
            <Box {...STATER_STYLE.containerStyle({colorMode})} h={'259px'}>
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
              <Flex flexDir="column" mb={'15px'}>
                <Text h={'36px'} {...STATER_STYLE.mainText({colorMode})}>
                  {project.name}
                </Text>
              </Flex>

              <Flex justifyContent="space-between" mb={'20px'}>
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
              <Box
                d="flex"
                flexDir="row"
                justifyContent="space-between"
                mb={'5px'}>
                <Flex alignItems="center">
                  <Text mr={1} {...STATER_STYLE.progress.mainText({colorMode})}>
                    Public Sale
                  </Text>
                  <Box
                    w={'12px'}
                    h={'3px'}
                    bg={'blue.100'}
                    borderRadius={10}
                    mr={'20px'}></Box>
                  <Text mr={1} {...STATER_STYLE.progress.mainText({colorMode})}>
                    current
                  </Text>
                  <Box
                    w={'12px'}
                    h={'3px'}
                    bg={'#2bb415'}
                    borderRadius={10}
                    mr={'20px'}></Box>
                </Flex>
                <Flex>
                  <Text>0.00</Text>
                  <Text>/</Text>
                  <Text>5000000</Text>
                </Flex>
              </Box>
              <Box mb={'30px'}>
                <Progress
                  value={80}
                  borderRadius={10}
                  h={'6px'}
                  bg={'#2bb415'}></Progress>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </Flex>
  );
};
