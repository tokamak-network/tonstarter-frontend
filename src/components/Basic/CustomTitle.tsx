import {Text, useColorMode} from '@chakra-ui/react';

type CustomTitleProp = {
  title: string;
  fontSize?: string;
  subTitle?: boolean;
};

export const CustomTitle = (prop: CustomTitleProp) => {
  const {title, fontSize, subTitle} = prop;
  const {colorMode} = useColorMode();

  if (subTitle) {
    return (
      <Text
        fontSize={fontSize}
        fontWeight={600}
        color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
        {title}
      </Text>
    );
  }

  return (
    <Text
      fontSize={fontSize}
      fontWeight={600}
      color={colorMode === 'light' ? 'black.300' : 'white.100'}>
      {title}
    </Text>
  );
};
