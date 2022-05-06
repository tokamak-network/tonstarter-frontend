import {FC} from 'react';
import {
  Heading,
  Flex,
  Text,
  Container,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';

type HeadProps = {
  title?: string;
  subtitle?: string;
  secondSubTitle?: string;
  titleColor?: string;
};

export const PageHeader: FC<HeadProps> = ({
  title,
  titleColor,
  subtitle,
  secondSubTitle,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Container pt={12} maxW={'100%'}>
      <Flex flexDir="column" alignItems="center" justifyContent="center">
        <Heading
          fontWeight={'bold'}
          fontSize={'38'}
          className={'page-title'}
          color={
            titleColor
              ? titleColor
              : colorMode === 'light'
              ? theme.colors.gray[250]
              : '#ffffff'
          }
          fontFamily={theme.fonts.titil}
          mb="10px">
          {title}
        </Heading>
        <Text
          fontSize={16}
          className={'page-title'}
          color={colorMode === 'light' ? theme.colors.gray[400] : '#9d9ea5'}
          fontFamily={theme.fonts.titil}>
          {subtitle}
        </Text>
        <Text
          fontSize={13}
          fontWeight={'bold'}
          className={'page-title'}
          color={colorMode === 'light' ? theme.colors.gray[400] : '#9d9ea5'}
          fontFamily={theme.fonts.titil}>
          {secondSubTitle}
        </Text>
      </Flex>
    </Container>
  );
};
