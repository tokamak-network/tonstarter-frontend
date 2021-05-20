import {Image} from '@chakra-ui/image';
import {Box, Container, Flex, Link, Text} from '@chakra-ui/layout';
import TelegramIcon from 'assets/svgs/telegram-s-icon.svg';
import DiscordIcon from 'assets/svgs/discord-s-icon.svg';
import FacebookIcon from 'assets/svgs/facebook-s-icon.svg';
import GitHubIcon from 'assets/svgs/github-s-icon.svg';
import LinkedInIcon from 'assets/svgs/linkedin-s-icon.svg';
import MediumIcon from 'assets/svgs/medium-s-icon.svg';
import TwitterIcon from 'assets/svgs/twitter-s-icon.svg';
import YoutubeIcon from 'assets/svgs/youtube-s-icon.svg';

const socialLinks = [
  {
    title: 'Telegram',
    icon: TelegramIcon,
    href: 'https://t.me/tokamak_network/',
    isExternal: true,
  },
  {
    title: 'Discord',
    icon: DiscordIcon,
    href: 'https://discord.gg/8wSpJKz',
    isExternal: true,
  },
  {
    title: 'GitHub',
    icon: GitHubIcon,
    href: 'https://github.com/Onther-Tech/',
    isExternal: true,
  },
  {
    title: 'Facebook',
    icon: FacebookIcon,
    href: 'https://www.facebook.com/OntherInc/',
    isExternal: true,
  },
  {
    title: 'LinkedIn',
    icon: LinkedInIcon,
    href: 'https://www.linkedin.com/company/onther-tech/',
    isExternal: true,
  },
  {
    title: 'Medium',
    icon: MediumIcon,
    href: 'https://medium.com/onther-tech/',
    isExternal: true,
  },
  {
    title: 'Twitter',
    icon: TwitterIcon,
    href: 'https://twitter.com/tokamak_network/',
    isExternal: true,
  },
  {
    title: 'Youtube',
    icon: YoutubeIcon,
    href: 'https://www.youtube.com/channel/UCF6vtIKF_0QQVRG983czVEQ/',
    isExternal: true,
  },
];

const SocialLinks = () => {
  return (
    <Flex
      // w={'sm'}
      grow={1}
      direction={'row'}
      justifyContent={'center'}
      // justifyContent={{base: 'space-between', lg: 'space-around'}}
    >
      {socialLinks.map((socialLink, index) => (
        <Link
          href={socialLink.href}
          isExternal={socialLink.isExternal}
          mr={6}
          key={index}>
          <Image
            w={6}
            src={socialLink.icon}
            alt={socialLink.title}
            title={socialLink.title}
          />
        </Link>
      ))}
    </Flex>
  );
};

export const Footer = () => {
  return (
    <Container maxW={'8xl'} py={{base: 0, lg: 4}}>
      <Flex
        maxW={'full'}
        direction={{base: 'column', lg: 'row'}}
        justifyContent={'space-between'}>
        <Flex
          grow={1}
          direction={{base: 'column', lg: 'row'}}
          justifyContent={'space-between'}
          w={'xl'}
          alignItems={{base: 'flex-start', lg: 'center'}}>
          <Box flexGrow={1}>
            <Text fontWeight={'bold'} letterSpacing={'normal'}>
              ONTHER PTE.LTD.
            </Text>
          </Box>
          <Box flexGrow={1}>
            <Text color={'gray.400'}>
              10 Anson Road #23-140 International Plaza Singapore
            </Text>
          </Box>
          <Box flexGrow={1}>
            <Text>info@onther.io</Text>
          </Box>
        </Flex>
        <Flex
          py={{base: 4, lg: 0}}
          grow={3}
          direction={{base: 'column', lg: 'row'}}
          w={'sm'}
          justifyContent={'center'}>
          <SocialLinks />
          <Flex
            py={{base: 4, lg: 0}}
            flexGrow={1}
            justifyContent={{base: 'flex-start', lg: 'center'}}>
            <Text>[Dropdown here]</Text>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
