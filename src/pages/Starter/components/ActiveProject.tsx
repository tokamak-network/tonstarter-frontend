import {
  Grid,
  Box,
  useColorMode,
  useTheme,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import {STATER_STYLE, STATER_TEXT} from 'theme';
import {checkTokenType} from 'utils/token';
import {Circle} from 'components/Circle';

type ActiveProjectProp = {
  activeProject: any[];
};

export const ActiveProject = (props: ActiveProjectProp) => {
  const {activeProject} = props;
  const {colorMode} = useColorMode();
  const {main} = STATER_TEXT;
  const {containerStyle} = STATER_STYLE;
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={30}>
      {activeProject.map((project) => {
        const tokenType = checkTokenType(
          '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
        );
        return (
          <Box {...containerStyle({colorMode})}>
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
              <Circle bg={'#f95359'}></Circle>
            </Flex>
            {main({colorMode, text: project.name})}
          </Box>
        );
      })}
    </Grid>
  );
};
