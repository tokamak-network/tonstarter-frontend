// MobileLaunchGuide
import {
  Box,
  Image,
  Flex,
  useTheme,
  useColorMode,
  Text,
  Link,
  Heading,
  Grid,
} from '@chakra-ui/react';
// import {launchGuideData} from '../components/FakeData';
// import LaunchGuideA from 'assets/launch/guide/GuideA.png';
import CreateProjectGuide from 'assets/launch/guide/CreateProjectGuide.png';
// import LaunchGuideB from 'assets/launch/guide/GuideB.png';
// import LaunchGuideC from 'assets/launch/guide/GuideC.png';
// import {IconTelegram} from 'components/Icons/IconTelegram';
// import {IconGithub} from 'components/Icons/IconGithub';
// import {IconMedium} from 'components/Icons/IconMedium';
// import {IconTwitter} from 'components/Icons/IconTwitter';
// import {IconDiscord} from 'components/Icons/IconDiscord';
// import {IconYoutube} from 'components/Icons/IconYoutube';
import {LaunchMedium} from 'components/Icons/LaunchMedium';
const MobileLaunchGuide = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const launchGuideData = [
    // {
    //   title: 'What is Open Campaign?',
    //   link: 'https://google.com',
    //   src: LaunchGuideA,
    //   socialName: 'Youtube',
    //   socialIcon: IconYoutube,
    // },
    // {
    //   title: 'How to Create Projects?',
    //   link: 'https://google.com',
    //   src: LaunchGuideB,
    //   socialName: 'Youtube',
    //   socialIcon: IconYoutube,
    // },
    {
      title: 'TONStarter Launch Create Project Guide',
      link: 'https://medium.com/onther-tech/tonstarter-launch-create-project-user-guide-en-kr-82f2ae05c673',
      src: CreateProjectGuide,
      socialName: 'Medium',
      socialIcon: LaunchMedium,
    },
  ];

  return (
    <Flex mt={'40px'} flexDir={'column'} alignItems={'center'} w={'100%'}>
      <Text
        color={colorMode === 'light' ? '#3d495d' : '#fff'}
        fontSize={'20px'}
        fontFamily={theme.fonts.titil}
        fontWeight="bold"
        mb={'19px'}>
        Launch Guide
      </Text>
    
          {launchGuideData.map((guide, index) => {
            return (
              <Flex flexDirection={'column'} justifyContent={'center'} w={'320px'}>
                <Link
                  href={guide.link}
                  target="blank"
                  _focus={{border: 'none'}}>
                  <Image src={guide.src}  h={'180px'} w={'320px'}></Image>
                </Link>

                <Text
                  fontFamily={theme.fonts.fld}
                  fontSize={'20px'}
                  mt={'10px'}
                  fontWeight
                  ='bold'>
                  {guide.title}
                </Text>
                <Flex flexDir={'row'}>
                  {' '}
                  <guide.socialIcon color={'#c7d1d8'}/>
                  <Text ml={'5px'} fontSize={'13px'} color={'#7e8993'}>
                    {guide.socialName}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
      
    
    </Flex>
  );
};

export default MobileLaunchGuide;
