import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';

export const ExclusiveSale = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column">
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mb={'5px'}>
        Exclusive Sale Whitelist
      </Text>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'11px'}
        m={0}>
        Period Information
      </Text>
      <Box>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
          2021.10.1~10.4
        </Text>
      </Box>
    </Flex>
  );
};
