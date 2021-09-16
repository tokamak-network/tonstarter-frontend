import {Flex, Text, useColorMode, useTheme, Box} from '@chakra-ui/react';

export const Utility = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const themeDesign = {
    fontColor: {
      light: 'gray.250',
      dark: 'white.100',
    },
    bg: {
      light: 'white.100',
      dark: 'black.200',
    },
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px #535353',
    },
  };

  return (
    <Flex justifyContent="space-around" w="100%" flexDir="column" mt="55px">
      <Text
        color={themeDesign.fontColor[colorMode]}
        fontSize={'1.250em'}
        fontWeight={'bold'}
        mb="15px">
        Utility
      </Text>
      <Flex justifyContent="space-between">
        <Box mr={'60px'}>
          <Text
            fontFamily={theme.fonts.roboto}
            color={themeDesign.fontColor[colorMode]}
            fontWeight={'bold'}
            fontSize={'md'}>
            Get Dividends
          </Text>
          <Text color={'gray.400'} fontSize={'sm'} w={180}>
            You can get dividends from Starter project
          </Text>
        </Box>
        <Box mr={'60px'}>
          <Text
            fontFamily={theme.fonts.roboto}
            color={themeDesign.fontColor[colorMode]}
            fontWeight={'bold'}
            fontSize={'md'}>
            Join Governance
          </Text>
          <Text color={'gray.400'} fontSize={'sm'} w={170}>
            You can decide listings of projects for TONStarter
          </Text>
        </Box>
        <Box mr={'60px'}>
          <Text
            fontFamily={theme.fonts.roboto}
            color={themeDesign.fontColor[colorMode]}
            fontWeight={'bold'}
            fontSize={'md'}>
            Access Exclusive Sales
          </Text>
          <Text color={'gray.400'} fontSize={'sm'} w={180}>
            You can join exclusive token sales in TONStarter
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
