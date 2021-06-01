import {Box, Flex, Button, Stack, Image, useTheme} from '@chakra-ui/react';
import React from 'react';
import {shortenAddress} from 'utils';
import {ThemeSwitcher} from './ThemeSwitcher';
import {NavLink} from 'react-router-dom';
import {css, Global} from '@emotion/react';
import {useColorMode} from '@chakra-ui/react'
import logoLight from 'assets/svgs/fld_bi.svg';
import logoDark from 'assets/svgs/fldw_bi.svg';


type HeaderProps = {
  walletopen: () => void;
  account: string | undefined | null;
};

type MenuLinksProps = {
  walletopen: () => void;
  account: string | undefined | null;
  isOpen: boolean;
};

export const Header: React.FC<HeaderProps> = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const toggle = () => setIsOpen(!isOpen);
  const theme = useTheme();
  return (
    <NavBarContainer {...props}>
      <Flex justifyContent={'space-between'}>
      <Image className={'header-image'} src={colorMode === "light" ? logoLight : logoDark} w={191} h={5} alt="FLD Logo"/>
      <MenuItems isOpen={isOpen} {...props} />
      </Flex>
      <MenuToggle toggle={toggle} isOpen={isOpen} />
     
      <MenuLinks isOpen={isOpen} {...props} />
    </NavBarContainer>
  );
};

const CloseIcon = () => (
  <svg
    width="24"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor">
    <title>Close</title>
    <path d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor">
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => {
  return (
    <Box display={{base: 'block', md: 'none'}} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuLinks: React.FC<MenuLinksProps> = ({isOpen, account, walletopen}) => {
  return (
    <Box
      display={{base: isOpen ? 'block' : 'none', md: 'block'}}
      flexBasis={{base: '100%', md: 'auto'}}>
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}>
        <Button  borderWidth={1}
        borderColor={'currentcolor'} w={136} h={35} fontSize={15} fontWeight={600} onClick={walletopen} rounded={18} bg={'!currentcolor'}>
          {account ? shortenAddress(account) : 'Connect wallet'}
        </Button>
        <ThemeSwitcher />
      </Stack>
    </Box>
  );
};

const MenuItems: React.FC<MenuLinksProps> = ({isOpen}) => {

  return (
    <Box
      display={{base: isOpen ? 'block' : 'none', md: 'block'}}
      flexBasis={{base: '100%', md: 'auto'}}
      mx={100}>
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}>
        <NavLink to="/" exact className={'link'} activeClassName={'active'}>
          FLD Starter
        </NavLink>
        {/* <NavLink to="/pools" className={'link'} activeClassName={'active'}>
          Pools
        </NavLink> */}
        <NavLink to="/staking" className={'link'} activeClassName={'active'}>
          Staking
        </NavLink>
        {/* <Link to="/starter">Starter</Link>
    <Link to="/dao">Dao</Link> */}
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({children, ...rest}: {children: any}) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      px={8}
      py={4}
      {...rest}>
      {children}
    </Flex>
  );
};
