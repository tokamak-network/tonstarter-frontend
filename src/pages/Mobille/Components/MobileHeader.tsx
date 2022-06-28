import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Image,
  useTheme,
  CircularProgress,
  useColorMode,
  Text,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  // Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import {HamburgerIcon, CloseIcon} from '@chakra-ui/icons';
import {useDisclosure} from '@chakra-ui/react';
import {useEffect, useRef} from 'react';
import {NavLink, useRouteMatch} from 'react-router-dom';
import logoLight from 'assets/svgs/fld_bi_white.svg';
import logoGray from 'assets/svgs/fld_bi_gray.svg';
import m_Burger_icon from 'assets/svgs/m_Burger_icon.svg';
import Burger_icon from 'assets/svgs/Burger_icon.svg';
import {ThemeSwitcher} from 'components/ThemeSwitcher';
import {useAppSelector} from 'hooks/useRedux';
import {selectTxType} from 'store/tx.reducer';
import {shortenAddress} from 'utils';
import theme from 'theme';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';

type MobileHeaderProps = {
  walletopen: () => void;
  account: string | undefined | null;
};

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  account,
  walletopen,
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const btnRef = useRef<any>([]);
  const match = useRouteMatch('/');
  const {colorMode} = useColorMode();
  const {tx} = useAppSelector(selectTxType);
  return (
    <Flex
      py={'18px'}
      pl={'20px'}
      pr={'10px'}
      finalFocusRef={btnRef}
      justifyContent={'space-between'}
      h={'66px'}
      bg={colorMode === 'light' ? '#007aff' : '#222222'}
      alignItems={'center'}>
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
          w={'182px'}
          h={'25px'}
          alt="TON Starter Logo"
        />
      </NavLink>
      <Button
        onClick={onOpen}
        bg={'transparent'}
        _focus={{
          bg: 'transparent',
        }}
        _active={{
          bg: 'transparent',
        }}>
        <Image
          w={'30px'}
          h={'30px'}
          src={
            match?.isExact
              ? m_Burger_icon
              : colorMode === 'light'
              ? Burger_icon
              : m_Burger_icon
          }
        />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={'full'}>
        <DrawerOverlay />
        <DrawerContent bg={colorMode === 'light' ? '#fff' : '#222222'}>
          {/* <DrawerCloseButton maxH={'30px'} maxW={'30px'} /> */}
          <DrawerHeader
            h={'68px'}
            alignItems={'center'}
            pr={'10px'}
            pl={'20px'}
            display={'flex'}
            flexDir={'row'}>
            <Button
              border="solid 1px #d7d9df"
              color={colorMode === 'dark' ? '#ffffff' : '#86929d'}
              w={account ? (tx === true ? 136 : 151) : 136}
              h={35}
              fontSize={15}
              mr={'12px'}
              fontWeight={600}
              onClick={walletopen}
              borderRadius={'17.5px'}
              bg={'transparent'}
              zIndex={100}
              fontFamily={'Titillium Web, sans-serif'}
              _hover={{}}>
              {account ? (
                tx === true ? (
                  <Text
                    fontWeight={100}
                    fontSize={'14px'}
                    ml={'18px'}
                    pt={'1px'}>
                    Tx PENDING
                  </Text>
                ) : (
                  <Flex flexDir={'row'} alignItems={'center'} px={'5px'}>
                    <Box h={'25px'} ml={'-5px'} mr={'10px'}>
                      {' '}
                      <Jazzicon
                        diameter={25}
                        seed={jsNumberForAddress(account)}
                      />
                    </Box>
                    <Text fontSize={'14px'}>{shortenAddress(account)}</Text>
                  </Flex>
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
            <NavLink to="/myairdrop">
              <Flex
                onClick={onClose}
                w={'110px'}
                h={'35px'}
                bg={'#2a72e5'}
                borderRadius={'17.5px'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Text
                  fontSize={'15px'}
                  fontFamily={'Titillium Web, sans-serif'}>
                  My Airdrop
                </Text>
              </Flex>
            </NavLink>
            <IconButton
              onClick={onClose}
              aria-label={`Close Navigation`}
              ml={'27px'}
              bg={'transparent'}
              icon={<CloseIcon h={4} w={4} />}
              _focus={{bg: 'transparent'}}
              _active={{bg: 'transparent'}}
            />
          </DrawerHeader>

          <DrawerBody pt={'20px'}>
            <NavLink to="/launch">
           <Flex alignItems={'center'}>
              <Text fontFamily={'Rajdhani'} fontWeight={'bold'} fontSize={'24px'}>Launch</Text>
              <Box>
                <Text>NEW</Text>
              </Box>
              </Flex>
            </NavLink>
          </DrawerBody>

          <DrawerFooter
            borderTop={
              colorMode === 'light' ? '1px solid #dfe4ee' : '1px solid #373737'
            }
            alignItems={'center'}
            h={'70px'}
            px={'20px'}
            justifyContent={'flex-start'}>
            {/* <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button> */}
            <ThemeSwitcher
              style={{
                marginLeft: '0',
                color: colorMode === 'light' ? '#000000' : '#fff',
              }}
            />
            <Text
              ml={'10px'}
              fontFamily={theme.fonts.fld}
              fontSize={'20px'}
              fontWeight={600}>
              Brightness setting
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
