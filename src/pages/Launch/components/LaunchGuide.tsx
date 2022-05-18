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
import {useCallback, useEffect, useState} from 'react';
import {PageHeader} from 'components/PageHeader';
import {useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import ProjectCard from '../components/ProjectCard';
// import {launchGuideData} from '../components/FakeData';
import LaunchGuideA from 'assets/launch/guide/GuideA.png';
import LaunchGuideB from 'assets/launch/guide/GuideB.png';
import LaunchGuideC from 'assets/launch/guide/GuideC.png';
import {IconTelegram} from 'components/Icons/IconTelegram';
import {IconGithub} from 'components/Icons/IconGithub';
import {IconMedium} from 'components/Icons/IconMedium';
import {IconTwitter} from 'components/Icons/IconTwitter';
import {IconDiscord} from 'components/Icons/IconDiscord';
import {IconYoutube} from 'components/Icons/IconYoutube';
const LaunchGuide = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const launchGuideData = [
    {
      title: 'What is Open Campaign?',
      link: 'https://google.com',
      src: LaunchGuideA,
      socialName: 'Youtube',
      socialIcon: IconYoutube,
    },
    {
      title: 'How to Create Projects?',
      link: 'https://google.com',
      src: LaunchGuideB,
      socialName: 'Youtube',
      socialIcon: IconYoutube,
    },
    {
      title: 'What are the Differences?',
      link: 'https://google.com',
      src: LaunchGuideC,
      socialName: 'Medium',
      socialIcon: IconMedium,
    },
  ];
  return (
    <Flex flexDir={'column'} justifyContent={'center'} w={'100%'} my={'50px'}>
      <Box display={'flex'} justifyContent={'center'} mb={'20px'}>
        <Text
          fontSize={'32px'}
          fontFamily={theme.fonts.titil}
          fontWeight={'bold'}
          color={colorMode === 'dark' ? '#fff' : '#3d495d'}>
          Launch Guide
        </Text>
      </Box>
      <Flex justifyContent={'center'}>
        <Grid templateColumns="repeat(3, 1fr)" gap={30}>
          {launchGuideData.map((guide, index) => {
            return (
              <Flex flexDirection={'column'}>
                <Link
                  href={guide.link}
                  target="blank"
                  _focus={{border: 'none'}}>
                  <Image src={guide.src} h={'212px'} w={'378px'}></Image>
                </Link>

                <Text
                  fontFamily={theme.fonts.fld}
                  fontSize={'20px'}
                  color={colorMode === 'light' ? '#7e8993' : '#fff'}
                  mt={'20px'}>
                  {guide.title}
                </Text>
                <Flex flexDir={'row'}>
                  <guide.socialIcon
                    color={colorMode === 'light' ? '#7e8993' : '#fff'}
                  />
                  <Text
                    ml={'5px'}
                    fontSize={'13px'}
                    color={colorMode === 'light' ? '#7e8993' : '#fff'}>
                    {guide.socialName}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default LaunchGuide;
