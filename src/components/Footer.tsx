import {Image} from '@chakra-ui/image';
import {Box, Container, Flex, Link, Text, Grid} from '@chakra-ui/layout';
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
    <Flex direction={'row'} mr={3}>
      {socialLinks.map((socialLink, index) => (
        <Link
          href={socialLink.href}
          isExternal={socialLink.isExternal}
          mr={{base: 4, lg: 6}}
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
    <Container maxW={'full'} py={{base: 0, md: 4}}>
      <Flex
        flexDirection={{base: 'column', md: 'row'}}
        justifyContent={'space-between'}>
        <Flex flexGrow={2} direction={{base: 'column', md: 'row'}}>
          <Box mr={{base: 0, md: 3}}>
            <Text fontWeight={'bold'} letterSpacing={'normal'}>
              ONTHER PTE.LTD.
            </Text>
          </Box>
          <Box mr={3} py={{base: 3, md: 0}}>
            <Text color={'gray.400'}>
              10 Anson Road #23-140 International Plaza Singapore
            </Text>
          </Box>
          <Box>
            <Text>info@onther.io</Text>
          </Box>
        </Flex>
        <Box maxW={'full'}>
          <Flex
            py={{base: 4, md: 0}}
            grow={2}
            direction={{base: 'column', lg: 'row'}}
            justifyContent={'flex-end'}>
            <SocialLinks />
            <Flex
              py={{base: 4, lg: 0}}
              justifyContent={{base: 'flex-start', lg: 'center'}}>
              <Text>[Dropdown here]</Text>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};
