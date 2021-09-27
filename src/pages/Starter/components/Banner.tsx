import {Flex, Image, Text, Box, useTheme} from '@chakra-ui/react';
import bannerImg from 'assets/images/starter/banner2x.png';

export const Banner = () => {
  const theme = useTheme();
  const {TitilliumWeb, roboto, poppins} = theme.fonts;
  return (
    <Flex pos="relative">
      <Image src={bannerImg}></Image>
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
