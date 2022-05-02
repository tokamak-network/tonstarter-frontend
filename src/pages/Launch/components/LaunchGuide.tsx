import {
  Box,
  Image,
  Flex,
  useTheme,
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
import { IconYoutube } from 'components/Icons/IconYoutube';
const LaunchGuide = () => {
  const theme = useTheme();
  const launchGuideData = [
    {
      title: 'What is Open Campaign?',
      link: 'https://google.com',
      src: LaunchGuideA,
      socialName: 'Youtube',
      socialIcon: IconYoutube
    },
    {
      title: 'How to Create Projects?',
      link: 'https://google.com',
      src: LaunchGuideB,
      socialName: 'Youtube',
      socialIcon: IconYoutube
    },
    {
      title: 'What are the Differences?',
      link: 'https://google.com',
      src: LaunchGuideC,
      socialName: 'Medium',
      socialIcon: IconMedium
    },
  ];
  return (
    <Flex flexDir={'column'} justifyContent={'center'} w={'100%'} my={'50px'}>
      <Box display={'flex'} justifyContent={'center'} mb={'20px'}>
        <Heading as="h2" fontSize={'2xl'}>
          Launch Guide
        </Heading>
      </Box>
      <Flex justifyContent={'center'}>
        <Grid templateColumns="repeat(3, 1fr)" gap={30}>
          {launchGuideData.map((guide, index) => {
            return (
              <Flex flexDirection={'column'} mx={'10px'}>
                <Link href={guide.link} target='blank' _focus={{border:'none'}}>
                <Image src={guide.src} h={'212px'} w={'378px'}></Image>
                </Link>
            
               <Text fontFamily={theme.fonts.fld} fontSize={'20px'} mt={'20px'}>{guide.title}</Text>
               <Flex flexDir={'row'}>
              <guide.socialIcon/>
              <Text ml={'5px'} fontSize={'13px'}>{guide.socialName}</Text>
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
