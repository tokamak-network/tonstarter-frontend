import {
  Box,
  Flex,
  Button,
  Stack,
  Image,
  useTheme,
  CircularProgress,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import {shortenAddress} from 'utils';
import {ThemeSwitcher} from './ThemeSwitcher';
import {NavLink, useRouteMatch} from 'react-router-dom';
import logoLight from 'assets/svgs/fld_bi_white.svg';
import logoGray from 'assets/svgs/fld_bi_gray.svg';
import {useAppSelector} from 'hooks/useRedux';
import {selectTxType} from 'store/tx.reducer';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {Menu, MenuButton, MenuList, MenuItem} from '@chakra-ui/react';

type HeaderProps = {
  walletopen: () => void;
  account: string | undefined | null;
};

type MenuLinksProps = {
  walletopen: () => void;
  account: string | undefined | null;
  isOpen: boolean;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {colorMode} = useColorMode();
  const toggle = () => setIsOpen(!isOpen);
  const match = useRouteMatch('/');

  return (
    <NavBarContainer {...props}>
      <Flex justifyContent={'space-between'}>
        <NavLink to="/">
          <Image
            src={
              match?.isExact
                ? logoLight
                : colorMode === 'light'
                ? logoGray
                : logoLight
            }
            color="white.200"
            w={'11.375em'}
            h={'1.5625em'}
            alt="TON Starter Logo"
          />
        </NavLink>
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
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const match = useRouteMatch('/');
  const {tx} = useAppSelector(selectTxType);
  const dispatch = useDispatch();

  const airdropModalOpen = async () => {
    dispatch(openModal({type: 'airdrop', data: {}}));
  };

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
        <Button
          border="solid 1px #d7d9df"
          color={
            colorMode === 'dark'
              ? theme.colors.gray[0]
              : match?.isExact
              ? account
                ? theme.colors.gray[225]
                : 'white.100'
              : theme.colors.gray[175]
          }
          w={136}
          h={35}
          fontSize={15}
          fontWeight={600}
          onClick={walletopen}
          rounded={18}
          bg={
            colorMode === 'dark'
              ? 'black.200'
              : match?.isExact
              ? account
                ? 'white.100'
                : 'blue.200'
              : 'transparent'
          }
          zIndex={100}
          _hover={{}}>
          {account ? (
            tx === true ? (
              <Text
                fontFamily={theme.fonts.roboto}
                fontWeight={100}
                fontSize={'14px'}
                ml={'18px'}
                pt={'1px'}>
                Tx PENDING
              </Text>
            ) : (
              shortenAddress(account)
            )
          ) : (
            'Connect wallet'
          )}
          {tx === true ? (
            <CircularProgress
              isIndeterminate
              size={4}
              zIndex={100}
              color="blue.500"
              pos="absolute"
              left={'14px'}></CircularProgress>
          ) : null}
        </Button>
        {account ? (
          <Button
            w={'7.875rem'}
            h={'2.188rem'}
            style={{marginLeft: '15px'}}
            marginLeft="15px"
            p={0}
            bg={
              colorMode === 'dark'
                ? 'black.200'
                : match?.isExact
                ? 'blue.200'
                : '#2a72e5'
            }
            borderWidth={
              colorMode === 'light' && match?.isExact === false ? '' : 1
            }
            borderColor={
              colorMode === 'dark' ? '#d7d9df' : match?.isExact ? '#a6d0ff' : ''
            }
            borderRadius={'19px'}
            color={
              colorMode === 'dark'
                ? theme.colors.gray[0]
                : match?.isExact
                ? 'white.100'
                : 'white.100'
            }
            onClick={airdropModalOpen}
            fontWeight={500}
            fontSize={'15px'}
            _hover={{}}
            _active={{backgroundColor: 'none'}}>
            Airdrop Claim
          </Button>
        ) : null}
        <ThemeSwitcher style={{marginLeft: '20px'}} />
      </Stack>
    </Box>
  );
};

const MenuItems: React.FC<MenuLinksProps> = ({isOpen}) => {
  // const theme = useTheme();
  const match = useRouteMatch('/');
  return (
    <Box
      display={{base: isOpen ? 'block' : 'none', md: 'block'}}
      flexBasis={{base: '100%', md: 'auto'}}
      ml={100}>
      <Stack
        spacing={8}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'column', 'column', 'row']}
        pt={[4, 4, 0, 0]}>
        <NavLink
          to="/staking"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}>
          Staking
        </NavLink>
        <NavLink
          to="/pools"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}>
          Pools
        </NavLink>
        <NavLink
          to="/dao"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}>
          DAO
        </NavLink>
        <NavLink
          to="/starter"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}>
          Starter
        </NavLink>
        {/* <Tooltip
          hasArrow
          placement="top"
          label="Coming Soon"
          color={theme.colors.white[100]}
          bg={theme.colors.gray[375]}> */}

        {/* </Tooltip> */}
        <NavLink
          to="/"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}
          onClick={(e) => {
            e.preventDefault();
            window.open(
              'https://github.com/Onther-Tech/tonstarter-docs/blob/main/whitepaper/TONStarter%20Whitepaper.md',
            );
          }}>
          <Text className={match?.isExact ? 'link-match' : 'link'}>
            WhitePaper
          </Text>
        </NavLink>
        <NavLink
          to="/"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}
          onClick={(e) => {
            e.preventDefault();
            window.open(
              'https://medium.com/onther-tech/wton-tos-lp-staking-reward-system-en-kr-881e57ec0568',
            );
          }}>
          <Text className={match?.isExact ? 'link-match' : 'link'}>Guide</Text>
        </NavLink>
        {/* <NavLink
          to="/admin"
          className={match?.isExact ? 'link-match' : 'link'}
          style={{zIndex: 100}}>
          Admin
        </NavLink> */}
        <Menu>
          <MenuButton>
            <Text className={match?.isExact ? 'link-match' : 'link'}>
              Admin
            </Text>
          </MenuButton>
          <MenuList
            pos={'absolute'}
            left={'-33px'}
            top={'15px'}
            minW={'124px'}
            w={'124px'}
            h={'74px'}
            p={0}
            fontSize={13}
            background={'#ffffff'}>
            <NavLink
              to="/admin/createproject"
              activeStyle={{background: '#ffffff', color: '#1c1c1c'}}
              style={{background: '#ffffff', color: '#1c1c1c'}}>
              <MenuItem
                _hover={{color: 'blue.100', bg: 'none'}}
                w={'124px'}
                h={'37px'}
                _focus={{bg: '#ffffff'}}>
                Create Project
              </MenuItem>
            </NavLink>
            <NavLink
              to="/admin/listproject"
              activeStyle={{background: '#ffffff', color: '#1c1c1c'}}
              style={{background: '#ffffff', color: '#1c1c1c'}}>
              <MenuItem
                _hover={{color: 'blue.100', bg: 'none'}}
                w={'124px'}
                h={'37px'}>
                Listing Projects
              </MenuItem>
            </NavLink>
          </MenuList>
        </Menu>
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
      px={8}
      py={4}
      pr={3}
      pos="absolute"
      zIndex={1000}
      {...rest}>
      {children}
    </Flex>
  );
};
