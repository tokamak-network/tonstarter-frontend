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
  LightMode,
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
import tos_symbol from 'assets/svgs/tos_symbol.svg';
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
  const myairdrop = useRouteMatch('/myairdrop');
  const launch = useRouteMatch('/launch');
  const {colorMode} = useColorMode();
  const {tx} = useAppSelector(selectTxType);

  return (
    <Flex justifyContent={'space-between'}> 
      {match?.isExact || myairdrop?.isExact || launch?.isExact?  
       <Flex
      py={'18px'}
      pl={'20px'}
      pr={'10px'}
      zIndex={1000}
      // border={'1px solid red'}
      finalFocusRef={btnRef}
      justifyContent={'space-between'}
      h={'66px'}
      w={'100%'}
      // bg={colorMode === 'light' ? '#007aff' : '#222222'}
      bg={match?.isExact? colorMode === 'light'? '#2a72e5' : '#222222' : 'transparent'}
      alignItems={'center'}>
      <NavLink to="/">
        <Image
          src={match?.isExact ? logoLight : tos_symbol}
          color="white.200"
          w={match?.isExact ? '182px' : '29px'}
          h={'25px'}
          alt="TON Starter Logo"
        />
      </NavLink>
      <Text
        fontFamily={theme.fonts.fld}
        fontSize={'25px'}
        fontWeight={700}
        color={colorMode === 'light' ? '#3e495c' : '#fff'}>
        {!match?.isExact ? (myairdrop?.isExact ? 'My Airdrop' : 'Launch') : ''}
      </Text>
      <Button
        px={0}
        mx={0}
        w={'30px'}
        h={'30px'}
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
            flexDir={'row'}
            justifyContent={'space-between'}>
            <Flex>
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
                    fontFamily={'Titillium Web, sans-serif'}
                    color={'#fff'}>
                    My Airdrop
                  </Text>
                </Flex>
              </NavLink>
            </Flex>
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
              <Flex alignItems={'center'} h={'30px'} onClick={onClose}>
                <Text
                  fontFamily={'Rajdhani'}
                  fontWeight={700}
                  fontSize={'24px'}
                  color={'#2a72e5'}
                  mr={'7px'}>
                  Launch
                </Text>
                <Flex
                  w={'48px'}
                  h={'20px'}
                  borderRadius={'10px'}
                  bg={'#257eee'}
                  alignItems={'center'}
                  justifyContent={'center'}>
                  <Text
                    textAlign={'center'}
                    fontSize={'10px'}
                    fontFamily={theme.fonts.openSans}
                    fontWeight={600}
                    color={'#ffffff'}>
                    NEW
                  </Text>
                </Flex>
              </Flex>
            </NavLink>
            <Flex
              mt={'30px'}
              fontFamily={'Rajdhani, sans-serif'}
              flexDir={'column'}>
              <Flex mb={'15px'}>
                <Text fontWeight={'bold'} fontSize={'24px'}>
                  DOCS
                </Text>
              </Flex>
              <Flex
                ml={'15px'}
                flexDir={'column'}
                fontSize={'18px'}
                fontWeight={'bold'}>
                <Text
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://github.com/Onther-Tech/tonstarter-docs/blob/main/whitepaper/TONStarter%20Whitepaper.md',
                    );
                  }}>
                  Whitepaper
                </Text>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/tonstarter-guide-en-kr-6b7cad5773f1',
                    );
                  }}>
                  Guide
                </Text>
              </Flex>
              <Flex
                ml={'25px'}
                flexDir={'column'}
                fontSize={'18px'}
                fontWeight={500}>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/tonstarter-guide-en-kr-6b7cad5773f1',
                    );
                  }}>
                  Staking
                </Text>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/wton-tos-lp-staking-reward-system-en-kr-881e57ec0568',
                    );
                  }}>
                  Pools Staking
                </Text>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/introduction-of-stos-en-kr-56c12a5440e0',
                    );
                  }}>
                  DAO Staking
                </Text>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/tonstarter-phase-3-starter-guide-en-kr-ab97bb9e50fc',
                    );
                  }}>
                  Starter
                </Text>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/tonstarter-pools-reward-program-guide-en-kr-bef9ae274afd',
                    );
                  }}>
                  Rewards Program
                </Text>
                <Text
                  mt={'15px'}
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      'https://medium.com/onther-tech/tonstarter-launch-create-project-user-guide-en-kr-82f2ae05c673',
                    );
                  }}>
                  Launch
                </Text>
              </Flex>
            </Flex>
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
    </Flex> :<></>}
  
    </Flex>
  );
};
