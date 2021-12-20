import {Flex, Text, useTheme} from '@chakra-ui/react';
// import bannerImg1X from 'assets/images/starter/Background-img@2x.png';
import {CustomButton} from 'components/Basic/CustomButton';
import bannerImg1X from 'assets/banner/image2.png';

export const Banner = () => {
  const theme = useTheme();
  const {TitilliumWeb, roboto, poppins} = theme.fonts;
  return (
    <Flex
      pos="relative"
      w={'100%'}
      // bgImage={bannerImg1X}
      // backgroundRepeat="no-repeat"
      // backgroundPosition="center"
      style={{height: '510px'}}
      backgroundColor={'#07070A'}
      alignItems="center"
      justifyContent="center">
      <img
        alt={'banner-img'}
        src={bannerImg1X}
        // style={{width: '270px', height: '270px', marginLeft: '1050px'}}
        // style={{width: '135px', height: '135px', marginRight: '1050px'}}

        // style={{ width: '1440px', height: '510px', objectFit: 'cover' }}
      ></img>
      <Flex
        w={'100%'}
        pos="absolute"
        flexDir="column"
        color="white.100"
        alignItems="center">
        <Text
          mb={'32px'}
          fontFamily={TitilliumWeb}
          fontSize={16}
          fontWeight={600}>
          Featured
        </Text>
        <Flex
          flexDir="column"
          alignItems="center"
          fontSize={72}
          fontWeight={600}
          fontFamily={poppins}
          lineHeight={1.14}
          mb={'20px'}>
          <Text>Dragons of Midgard</Text>
          {/* <Text>Coming soon</Text> */}
        </Flex>
        <Flex
          flexDir="column"
          alignItems="center"
          fontSize={22}
          fontFamily={roboto}
          lineHeight={1.55}
          color={'lightgray'}>
          <Text>Playable NFT Collectible PVP game set in the medieval era</Text>
          <Text>in the kingdom of midgard</Text>
        </Flex>
        <Flex
          alignItems="center"
          fontSize={22}
          fontFamily={roboto}
          lineHeight={1.55}
          color={'lightgray'}
          mt={'34px'}
          flexDir={'column'}>
          <Flex mb={'10px'}>
            <CustomButton
              text={'Website'}
              func={(e: any) => {
                e.preventDefault();
                window.open('https://dragonsofmidgard.com/');
              }}></CustomButton>
            <CustomButton
              style={{marginLeft: '10px'}}
              text={'White Paper'}
              func={(e: any) => {
                e.preventDefault();
                window.open(
                  'https://whitepaper.dragonsofmidgard.com/dragons-of-midgard/',
                );
              }}></CustomButton>
          </Flex>
          <Flex>
            {/* <CustomButton
              text={'Discord'}
              func={(e: any) => {
                e.preventDefault();
                window.open('https://dsc.gg/dragonsmidgard');
              }}></CustomButton> */}
            <CustomButton
              style={{marginLeft: '10px'}}
              text={'Telegram(KR)'}
              func={(e: any) => {
                e.preventDefault();
                window.open('https://t.me/DragonsofMidgardOfficialKR');
              }}></CustomButton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
