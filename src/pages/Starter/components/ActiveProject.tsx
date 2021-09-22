import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Text,
  Flex,
  Avatar,
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
  console.log(theme);

  return (
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
                <Circle bg={'#f95359'}></Circle>
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
            <Box d="flex" flexDir="row" justifyContent="space-between">
              <Flex alignItems="center">
                <Text mr={2} {...STATER_STYLE.progress.mainText({colorMode})}>
                  Progress
                </Text>
                <Text
                  {...STATER_STYLE.progress.percent({colorMode, isZero: true})}>
                  0%
                </Text>
              </Flex>
              <Flex>
                <Text>0.00</Text>
                <Text>/</Text>
                <Text>5000000</Text>
              </Flex>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};
