import {Image} from '@chakra-ui/image';
import {Box, Container, Flex, Link, Text, useTheme} from '@chakra-ui/react';
import TelegramIconLight from 'assets/svgs/telegram-s-icon.svg';
import TelegramIconDark from 'assets/svgs/telegram-s-icon-w.svg';
// import DiscordIcon from 'assets/svgs/discord-s-icon.svg';
// import FacebookIcon from 'assets/svgs/facebook-s-icon.svg';
import GitHubIconLight from 'assets/svgs/github-s-icon.svg';
import GitHubIconDark from 'assets/svgs/github-s-icon-w.svg';
// import LinkedInIcon from 'assets/svgs/linkedin-s-icon.svg';
import MediumIconLight from 'assets/svgs/medium-s-icon.svg';
import MediumIconDark from 'assets/svgs/medium-s-icon-w.svg';
import TwitterIconLit from 'assets/svgs/Twitter-icon.svg';
import TwitterIconDark from 'assets/svgs/Twitter-s-icon-w.svg';
// import YoutubeIcon from 'assets/svgs/youtube-s-icon.svg';
import {useColorMode} from '@chakra-ui/react';
import emailIcon from 'assets/svgs/email.svg';

const socialLinks = [
  {
    title: 'Telegram',
    iconLight: TelegramIconLight,
    iconDark: TelegramIconDark,
    href: 'https://t.me/tokamak_network/',
    isExternal: true,
  },
  // {
  //   title: 'Discord',
  //   icon: DiscordIcon,
  //   href: 'https://discord.gg/8wSpJKz',
  //   isExternal: true,
  // },
  {
    title: 'GitHub',
    iconLight: GitHubIconLight,
    iconDark: GitHubIconDark,
    href: 'https://github.com/Onther-Tech/',
    isExternal: true,
  },
  // {
  //   title: 'Facebook',
  //   icon: FacebookIcon,
  //   href: 'https://www.facebook.com/OntherInc/',
  //   isExternal: true,
  // },
  // {
  //   title: 'LinkedIn',
  //   icon: LinkedInIcon,
  //   href: 'https://www.linkedin.com/company/onther-tech/',
  //   isExternal: true,
  // },
  {
    title: 'Twitter',
    iconLight: TwitterIconLit,
    iconDark: TwitterIconDark,
    href: 'https://twitter.com/tokamak_network/',
    isExternal: true,
  },
  {
    title: 'Medium',
    iconLight: MediumIconLight,
    iconDark: MediumIconDark,
    href: 'https://medium.com/onther-tech/',
    isExternal: true,
  },
];
type SocialLinkProps = {
  colorMode: string;
};
const SocialLinks: React.FC<SocialLinkProps> = ({colorMode}) => {
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
            src={colorMode === 'light'? socialLink.iconLight : socialLink.iconDark}
            title={socialLink.title}
          />
        </Link>
      ))}
    </Flex>
  );
};

export const Footer = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  return (
    <Container position="relative" bottom={0} maxW={'full'}>
      <Flex
        flexDirection={{base: 'column', md: 'row'}}
        justifyContent={'space-between'}
        alignItems={'center'}  h={76}>
        <Flex flexGrow={2} direction={{base: 'column', md: 'row'}} alignItems={'center'}>
          <Box mr={{base: 0, md: 5}}>
            <Text color={colorMode === 'light'?theme.colors.gray[700]: theme.colors.white[100] } fontWeight={600} fontSize={14} fontFamily={theme.fonts.body} letterSpacing={'normal'}>
            Seoul Ethereum Meet up
            </Text>
          </Box>
          <Box mr={3} py={{base: 4, md: 0}}>
            <Text color={'gray.400'} fontSize={13} fontFamily={theme.fonts.body} fontWeight={'normal'}>
            10 Anson Road #23-140  International Plaza Singapore
            </Text>
          </Box>
          <Box  mr={{base: 0, md: 3}}>
          <Image src={emailIcon}/>
          </Box>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Text color={colorMode === 'light'?theme.colors.gray[900]: theme.colors.white[100] } fontSize={13} fontFamily={theme.fonts.body} fontWeight={'normal'}>info@onther.io</Text>
          </Box>
          
        </Flex>
        <Box maxW={'full'}>
          <Flex
            py={{base: 4, md: 0}}
            grow={2}
            direction={{base: 'column', lg: 'row'}}
            justifyContent={'flex-end'}
            color={colorMode === 'light'?theme.colors.gray[900]:theme.colors.white[100] }>
            <SocialLinks  colorMode={colorMode} />
            {/* <Flex
              py={{base: 4, lg: 0}}
              justifyContent={{base: 'flex-start', lg: 'center'}}>
              <Text>[Dropdown here]</Text>
            </Flex> */}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};
