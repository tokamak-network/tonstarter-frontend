import {Flex, Image, Text, useTheme} from '@chakra-ui/react';
import bannerImg from 'assets/images/starter/banner2x.png';
import bannerImg1X from 'assets/images/starter/Background-img@2x.png';
import {CustomButton} from 'components/Basic/CustomButton';

export const Banner = () => {
  const theme = useTheme();
  const {TitilliumWeb, roboto, poppins} = theme.fonts;
  return (
    <Flex
      pos="relative"
      w={'100%'}
      h={'100vh'}
      // bgImage={bannerImg1X}
      // backgroundRepeat="no-repeat"
      // backgroundPosition="center"
      backgroundColor={'#101216'}
      alignItems="center"
      justifyContent="center">
      <img
        alt={'banner-img'}
        src={bannerImg1X}
        style={{width: '1440px', height: '510px', objectFit: 'cover'}}></img>
      <Flex
        w={'100%'}
        pos="absolute"
        flexDir="column"
        color="white.100"
        alignItems="center">
        <Text
          mt={'90px'}
          mb={'32px'}
          fontFamily={TitilliumWeb}
          fontSize={16}
          fontWeight={600}>
          Featured Sales
        </Text>
        <Flex
          flexDir="column"
          alignItems="center"
          fontSize={72}
          fontWeight={600}
          fontFamily={poppins}
          lineHeight={1.14}
          mb={'20px'}>
          <Text>DOOROPEN</Text>
          <Text>Coming soon</Text>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          fontSize={22}
          fontFamily={roboto}
          lineHeight={1.55}
          color={'lightgray'}>
          <Text>First Metaverse NFT with Virtual Humans</Text>
          <Text>Virtual Human</Text>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          fontSize={22}
          fontFamily={roboto}
          lineHeight={1.55}
          color={'lightgray'}
          mt={'34px'}>
          <CustomButton
            text={'Website'}
            func={(e: any) => {
              e.preventDefault();
              window.open('https://dooropen.space/');
            }}></CustomButton>
        </Flex>
      </Flex>
    </Flex>
  );
};
