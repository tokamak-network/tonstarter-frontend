import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Avatar,
  Stack,
  useTheme,

  useColorMode,
 
} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import {getSigner} from 'utils/contract';
import {checkTokenType} from 'utils/token';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {useCallback, useEffect, useState, useRef} from 'react';
import {ethers} from 'ethers';
import {CloseButton} from 'components/Modal/CloseButton';
// import {CustomTabs} from 'components/Basic/index';
import {Tab} from '../types';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import {Contract} from '@ethersproject/contracts';
// import { selectBalance } from 'store/app/user.reducer';

//   import {ModalTabs} from '../components/Tabs';
const {TON_ADDRESS, TOS_ADDRESS, WTON_ADDRESS, DOC_ADDRESS,AURA_ADDRESS} = DEPLOYED;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const SearchModal = () => {
  
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [decimal, setDecimal] = useState<number>(0);
  const [validAddress, setValidAddress] = useState<boolean>(false);
  //select tab
  const focusTarget = useRef<any>([]);
  const tabList: Tab[] = ['Search', 'Custom'];
  // const [tab, setTab] = useState<Tab>('Search');
  const [tokenLists, setTokenLists] = useState<any[]>([]);
  const [tokenInfo, setTokenInfo] = useState<(string | number)[]>([]);
  const [balance, setBalance] = useState(0)
  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  useEffect(() => {
    const tokenArray = [address, symbol, decimal, balance];
    setTokenInfo(tokenArray);
  }, [address, symbol, decimal, balance]);

  useEffect(() => {    
    const tokenList = [TON_ADDRESS, TOS_ADDRESS, WTON_ADDRESS, DOC_ADDRESS, AURA_ADDRESS];
    setTokenLists(tokenList);
  }, [data]);

  const themeDesign = {
    border: {
      light: 'solid 1px #f4f6f8',
      dark: 'solid 1px #363636',
    },
    font: {
      light: '#ffffff',
      dark: '#304156',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
  };
  useEffect(() => {
    const isAddress = ethers.utils.isAddress(address);
    setValidAddress(isAddress);

    async function getTokenFromContract() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      if (address === ZERO_ADDRESS) {
        setDecimal(18);
        setSymbol('ETH');
      }
      else {
        const signer = getSigner(library, account);
        try {
          const contract = new Contract(address, TOSABI.abi, library);
          const symbolContract = await contract.connect(signer).symbol();
          const decimalContract = await contract.connect(signer).decimals();
          setDecimal(decimalContract);
          setSymbol(symbolContract);
        } catch (err) {}
      }
    }
    if (isAddress) {
      getTokenFromContract();
    }
  }, [address]);

  const selectToken = (index:any, tokenAddress: string, tokenName: string) => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'transparent'));
    current[index].style.border = 'solid 1px #2a72e5';
    setAddress(tokenAddress);
    setSymbol(tokenName);
    setDecimal(18)

  }
  return (
    <Modal
      isOpen={data.modal === 'search' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        h="576px"
        pt="25px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Reward Token
            </Heading>
          </Box>

          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box mb="30px">
              {/* <CustomTabs
                w={'136px'}
                h={'26px'}
                list={tabList}
                setValue={setTab}></CustomTabs> */}
            </Box>
            <Box h="344px" m={'0 !important'}>
              {/* {tab === 'Search' ? ( */}
                <Flex
                
                  font={themeDesign.font[colorMode]}
                  fontSize={'13px'}
                  w={'290px'}
                  flexDirection={'column'}>
                  <Text
                    color={colorMode === 'light' ? '#304156' : '#9d9ea5'}
                    fontSize={'15px'}
                    fontWeight="600"
                    mb="10px">
                    Select a reward token
                  </Text>
                  <Flex flexDirection={'column'} >
                    {tokenLists.map((token: any, index: number) => {
                      const detailedToken = checkTokenType(ethers.utils.getAddress(token), colorMode);
                      return (
                        <Flex
                        p={'5px'}
                          key={index}
                          onClick={() => {selectToken(index,token, detailedToken.name )
                          }}
                          ref={(el) => (focusTarget.current[index] = el)}
                          alignItems={'center'}
                          flexDir={'row'}
                          h={'50px'}
                          _hover={{cursor:'pointer'}}
                          borderBottom={themeDesign.border[colorMode]}>
                          <Avatar
                            src={detailedToken.symbol}
                            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
                            color="#c7d1d8"
                            name="T"
                            border={
                              colorMode === 'light' ? '1px solid #e7edf3' : '1px solid #3c3c3c'
                            }                            h="26px"
                            w="26px"
                            zIndex={'100'}
                          />
                          <Text
                            ml={'10px'}
                            fontFamily={theme.fonts.fld}
                            fontSize={'17px'}
                            color={
                              colorMode === 'light' ? '#3d495d' : '#ffffff'
                            }>
                            {detailedToken.name}
                          </Text>
                        </Flex>
                      );
                    })}
                  </Flex>
                </Flex>
              {/* ) : (
                <Flex
                  font={themeDesign.font[colorMode]}
                  fontSize={'13px'}
                  w={'290px'}
                  flexDirection={'column'}>
                  <Box>
                    <Text pl="5px" pb="9px">
                      Address
                    </Text>
                    <Input
                      isInvalid={!validAddress}
                      maxLength={42}
                      mb="24px"
                      fontSize={'12px'}
                      _focus={{
                        border: themeDesign.border[colorMode],
                      }}
                      border={themeDesign.border[colorMode]}
                      w={'100%'}
                      h={'32px'}
                      value={address}
                      placeholder={'Enter Address'}
                      onChange={(e) => {
                        const {value} = e.target;
                        setAddress(value);
                      }}
                    />
                  </Box>
                  <Box>
                    <Text pl="5px" pb="9px">
                      Symbol
                    </Text>
                    <Input
                      maxLength={10}
                      mb="24px"
                      fontSize={'12px'}
                      _focus={{
                        border: themeDesign.border[colorMode],
                      }}
                      value={symbol.toUpperCase()}
                      border={themeDesign.border[colorMode]}
                      w={'100%'}
                      h={'32px'}
                      placeholder={'Enter Symbol'}
                      onChange={(e) => {
                        const {value} = e.target;
                        setSymbol(value.toUpperCase());
                      }}
                    />
                  </Box>
                  <Box>
                    <Text pl="5px" pb="9px">
                      Decimals
                    </Text>

                    <NumberInput
                      mb="24px"
                      fontSize={'12px'}
                      min={0}
                      max={36}
                      value={Number(decimal)}
                      w={'100%'}
                      h={'32px'}
                      borderColor={themeDesign.border[colorMode]}
                      _focus={{
                        borderColor: 'transparent',
                      }}
                      _active={{
                        borderColor: 'transparent',
                      }}
                      _hover={{
                        borderColor: 'transparent',
                      }}
                      onChange={(value) => {
                        setDecimal(parseInt(value));
                      }}>
                      <NumberInputField h={'32px'} />
                    </NumberInput>
                  </Box>
                </Flex>
              )} */}
            </Box>
          </Stack>

          <Box h="88px" as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{backgroundColor: 'blue.100'}}
              _focus={{backgroundColor: 'blue.100'}}
              onClick={() => {
                data?.data?.getTokenInfo(tokenInfo);
                handleCloseModal();
              }}>
              Select
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
