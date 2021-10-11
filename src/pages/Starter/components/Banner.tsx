import {Flex, Image, Text, useTheme} from '@chakra-ui/react';
import bannerImg from 'assets/images/starter/banner2x.png';
import bannerImg1X from 'assets/images/starter/Background_img.png';

export const Banner = () => {
  const theme = useTheme();
  const {TitilliumWeb, roboto, poppins} = theme.fonts;
  return (
    <Flex
      pos="relative"
      w={'100%'}
      h={'510px'}
      bgImage={bannerImg1X}
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundColor={'#0F1115'}>
      {/* <Image src={bannerImg1X} w={'100%'} h={'510px'} objectFit="cover"></Image> */}
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
          <Text>First Metaverse NFT</Text>
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          fontSize={22}
          fontFamily={roboto}
          lineHeight={1.55}
          color={'lightgray'}>
          <Text>NFT Designed to Distribute Value to Fandom</Text>
          <Text>Virtual Human</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
