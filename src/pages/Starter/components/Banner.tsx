import {Flex} from '@chakra-ui/react';
import {CustomButton} from 'components/Basic/CustomButton';
import bannerImg1X from 'assets/banner/Lyda.png';

export const Banner = () => {
  // const theme = useTheme();
  // const {TitilliumWeb, roboto, poppins} = theme.fonts;
  return (
    <Flex
      pos="relative"
      w={'100%'}
      // bgImage={bannerImg1X}
      // backgroundRepeat="no-repeat"
      // backgroundPosition="center"
      // style={{height: '510px'}}
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
        alignItems="center"
        mt={'195px'}>
        <CustomButton
          style={{
            width: '140px',
            height: '35px',
            borderRadius: '19px',
            background: 'none',
            border: '1px solid #ffffff',
            marginLeft: '15px',
          }}
          text={'Coming Soon'}
          func={(e: any) => {
            e.preventDefault();
            window.open('http://lyda.so');
          }}></CustomButton>
        {/* <Grid templateColumns="repeat(2, 1fr)" gap={3} mt={'34px'}>
          <CustomButton
            text={'Website'}
            func={(e: any) => {
              e.preventDefault();
              window.open('https://dragonsofmidgard.com/');
            }}></CustomButton>
          <CustomButton
            text={'White Paper'}
            func={(e: any) => {
              e.preventDefault();
              window.open(
                'https://whitepaper.dragonsofmidgard.com/dragons-of-midgard/',
              );
            }}></CustomButton>
          <CustomButton
            text={'Telegram(KR)'}
            func={(e: any) => {
              e.preventDefault();
              window.open('https://t.me/DragonsofMidgardOfficialKR');
            }}></CustomButton>
        </Grid> */}
      </Flex>
    </Flex>
  );
};
