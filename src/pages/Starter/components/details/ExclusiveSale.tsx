import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {DetailCounter} from './Detail_Counter';

export const ExclusiveSale = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column" pt={'70px'} pl={'45px'}>
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mb={'5px'}>
        Exclusive Sale
      </Text>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'11px'}
        m={0}>
        Period Information
      </Text>
      <Box d="flex" {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
        <Text mr={'25px'}>2021.10.1~10.4</Text>
        {/* <DetailCounter></DetailCounter> */}
      </Box>
    </Flex>
  );
};
