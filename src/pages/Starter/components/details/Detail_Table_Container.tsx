import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';

type DetailTableContainerProp = {
  title: string;
  data: {key: string; value: string}[];
  breakPoint: number;
  w?: number;
};

const fontSize = 15;

export const DetailTableContainer = (prop: DetailTableContainerProp) => {
  const {title, data, breakPoint, w} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;
  return (
    <Box
      {...STATER_STYLE.containerStyle({colorMode})}
      w={w || 582}
      h={'100%'}
      _hover=""
      cursor=""
      fontSize={15}
      p={0}>
      <Text
        {...STATER_STYLE.subText({colorMode, fontSize})}
        {...STATER_STYLE.table.container()}
        pt={'23px'}
        pb={'18px'}>
        {title}
      </Text>
      {data.map((item, index) => {
        return (
          <Flex
            {...STATER_STYLE.table.container({
              isLast: index >= breakPoint - 1 ? true : false,
            })}
            justifyContent="space-between">
            <Text {...STATER_STYLE.mainText({colorMode, fontSize})}>
              {item.key}
            </Text>
            <Text {...STATER_STYLE.mainText({colorMode, fontSize})}>
              {item.value}
            </Text>
          </Flex>
        );
      })}
    </Box>
  );
};
