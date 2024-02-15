import {Box, Container, Flex, Link, Text, useTheme} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
// import emailIcon from 'assets/svgs/email.svg';
import {IconTelegram} from './Icons/IconTelegram';
import {IconGithub} from './Icons/IconGithub';
import {IconMedium} from './Icons/IconMedium';
import {IconTwitter} from './Icons/IconTwitter';
import {IconDiscord} from './Icons/IconDiscord';

import {EmailIcon} from '@chakra-ui/icons';
import {useModal} from 'hooks/useModal';
const socialLinks = [
  {
    title: 'GitHub',
    icon: IconGithub,
    href: 'https://github.com/tokamak-network/tonstarter-frontend',
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
          <socialLink.icon />
        </Link>
      ))}
    </Flex>
  );
};

export const Footer = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {openAnyModal} = useModal();

  const bgColor = colorMode === 'light' ? 'gray.50' : 'black.200';
  return (
    <Container maxW={'full'} bg={bgColor} pl={'2.5em'} pr={'2.5em'}>
      <Flex
        flexDirection={{base: 'column', md: 'row'}}
        justifyContent={'space-between'}
        alignItems={'center'}
        h={76}>
        <Flex
          flexGrow={2}
          direction={{base: 'column', md: 'row'}}
          alignItems={'center'}></Flex>
        <Box maxW={'full'}>
          <Flex
            py={{base: 4, md: 0}}
            grow={2}
            direction={{base: 'column', lg: 'row'}}
            justifyContent={'flex-end'}>
            <SocialLinks colorMode={colorMode} />
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
