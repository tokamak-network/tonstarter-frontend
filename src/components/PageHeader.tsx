import {FC} from 'react';
import {
  Heading,
  Flex,
  Text,
  Container,
  useTheme,
  useColorMode,
  Image,
  Link,
} from '@chakra-ui/react';
import {useLocation} from 'react-router-dom';
import iconUserGuide from 'assets/images/iconUserGuide.png';


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
  const {pathname} = useLocation();
  const isSimplified =
    pathname.includes('simplified') || pathname.includes('createprojectsimple');
  return (
    <Container pt="70px" maxW={'100%'}>
      <Flex flexDir="column" alignItems="center" justifyContent="center">

        <Heading
          fontSize={'38px'}
          fontWeight={'bold'}
          className={'page-title'}
          lineHeight="1.58"
          color={
            titleColor
              ? titleColor
              : colorMode === 'light'
              ? theme.colors.gray[250]
              : '#ffffff'
          }
          // fontFamily={theme.fonts.titil}
          fontFamily={'Titillium Web'}
          mb="10px">
          {title}
        </Heading>
        <Text
          fontSize={16}
          className={'page-title'}
          color={colorMode === 'light' ? theme.colors.gray[400] : '#9d9ea5'}
          // fontFamily={theme.fonts.titil}
          fontFamily={'Titillium Web, sans-serif'}>
          {subtitle}
        </Text>
        <Text
          fontSize={13}
          fontWeight={'bold'}
          className={'page-title'}
          color={colorMode === 'light' ? theme.colors.gray[400] : '#9d9ea5'}
          // fontFamily={theme.fonts.titil}
          fontFamily="Titillium Web, sans-serif">
          {secondSubTitle}
        </Text>
     
          <Flex mt={'9px'}>
            <Image src={iconUserGuide} w="18px" h="18px" />
            <Link
              isExternal
              ml="6px"
              fontSize="13px"
              fontFamily="Titillium Web, sans-serif"
              color={colorMode === 'dark' ? 'gray.475' : 'gray.400'}
              href="https://tokamaknetwork.gitbook.io/home/v/kor/02-service-guide/tonstarter-launch"
              cursor="pointer">
              User Guide
            </Link>
          </Flex>
        
      </Flex>
    </Container>
  );
};
