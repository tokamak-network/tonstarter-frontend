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

              <Flex mb={'20px'}>
                <Box d="flex" flexDir="column" w={'135px'}>
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
                <Box d="flex" flexDir="column" w={'99px'}>
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
                    ROI
                  </Text>
                  <Box d="flex" justifyContent="space-between">
                    <Flex alignItems="baseline">
                      <Text
                        {...STATER_STYLE.mainText({
                          colorMode,
                          fontSize: 20,
                        })}>
                        300
                      </Text>
                      <Text>%</Text>
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
                  <Text
                    mr={1}
                    {...STATER_STYLE.progress.mainText({
                      colorMode,
                      fontSize: 13,
                    })}>
                    Public Sale
                  </Text>
                  <Box
                    w={'12px'}
                    h={'3px'}
                    bg={'blue.100'}
                    borderRadius={10}
                    mr={'25px'}></Box>
                  <Text
                    mr={1}
                    {...STATER_STYLE.progress.mainText({
                      colorMode,
                      fontSize: 13,
                    })}>
                    current
                  </Text>
                  <Box
                    w={'12px'}
                    h={'3px'}
                    bg={'#2bb415'}
                    borderRadius={10}
                    mr={'20px'}></Box>
                </Flex>
                <Flex
                  {...{
                    ...STATER_STYLE.subTextBlack({colorMode, fontSize: 12}),
                  }}>
                  <Text mr={1}>$1</Text>
                  <Text mr={1}>/</Text>
                  <Text> $3</Text>
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
