import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useTheme,
  useColorMode,
  Input,
  NumberInput,
  NumberInputField,
  Image,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {DEPLOYED} from 'constants/index';
import {useERC20Token} from 'hooks/useERC20Token';
import {useActiveWeb3React} from 'hooks/useWeb3';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';

const SwapModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;
  const {account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [distributable, setDistributable] = useState<number>(0);
  const [programDuration, setProgramDuration] = useState<any[]>([0, 0]);
  const [balance, setBalance] = useState('0');
  const [inputAmount, setInputAmount] = useState<string>('0');

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: '#2a72e5',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  const {tokenBalance, tokenSymbol} = useERC20Token({
    tokenAddress: TON_ADDRESS,
    isRay: false,
  });

  useEffect(() => {
    setBalance(tokenBalance);
  }, []);

  useEffect(() => {
    if (inputAmount.length > 1 && inputAmount.startsWith('0')) {
      setInputAmount(inputAmount.slice(1, inputAmount.length));
    }
    if (inputAmount.split('.')[1] !== undefined) {
      return setInputAmount(
        `${inputAmount.split('.')[0]}.${inputAmount.split('.')[1].slice(0, 2)}`,
      );
    }
  }, [inputAmount, setInputAmount]);

  return (
    <Modal
      // isOpen={data.modal === 'Launch_Swap' ? true : false}
      isOpen={false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Swap TON to TOS
              <Text
                color={colorMode === 'light' ? '#86929d' : '#9d9ea5'}
                fontSize={'12px'}
                fontWeight="normal"
                mt="2px">
                & Send TOS to Initial Liquidity Vault
              </Text>
            </Heading>
          </Box>
          <Flex justifyContent={'center'} alignItems="center" flexDir="column">
            <Flex
              w="300px"
              h="78px"
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              borderRadius="10px"
              mt="15px"
              pt={'16px'}
              pl="25px"
              pr="14px"
              flexDir={'column'}>
              <Flex justifyContent={'space-between'} alignItems="center">
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  fontSize="16px">
                  WTON
                </Text>
                <NumberInput
                  h="24px"
                  value={Number(inputAmount) <= 0 ? 0 : inputAmount}
                  onChange={(value) => {
                    if (
                      (value === '0' || value === '00') &&
                      value.length <= 2
                    ) {
                      return null;
                    }
                    if (value === '') {
                      return setInputAmount('0');
                    }
                    return setInputAmount(value);
                  }}>
                  <NumberInputField
                    placeholder="0.00"
                    h="24px"
                    textAlign={'right'}
                    errorBorderColor="red.300"
                    verticalAlign={'sub'}
                    border="none"
                    _focus={{
                      borderWidth: 0,
                    }}
                    pr="0px"
                    _active={{
                      borderWidth: 0,
                    }}></NumberInputField>
                </NumberInput>
              </Flex>
              <Flex alignItems="center" mt="6px">
                <Text
                  fontSize={'12px'}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}>
                  Balance: {tokenBalance} {tokenSymbol}
                </Text>
                <Button
                  fontSize={'12px'}
                  w={'50px'}
                  h={'20px'}
                  ml={'11px'}
                  bg="transparent"
                  _hover={{bg: 'transparent'}}
                  _focus={{bg: 'transparent'}}
                  _active={{bg: 'transparent'}}
                  color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
                  border={
                    colorMode === 'dark'
                      ? '1px solid #535353'
                      : '1px solid #d7d9df'
                  }
                  onClick={() =>
                    setInputAmount(tokenBalance.replace(/,/g, ''))
                  }>
                  MAX
                </Button>
              </Flex>
            </Flex>
            <Image m={'20px 0px'} src={swapArrow}></Image>
            <Flex
              w="300px"
              h="94px"
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              borderRadius="10px"
              pt={'14px'}
              pl="25px"
              pr="14px"
              flexDir={'column'}>
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                h="24px">
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  fontSize="16px">
                  TOS
                </Text>
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  lineHeight={1.5}
                  fontSize="20px">
                  7,146,412.05
                </Text>
              </Flex>
              <Text
                fontSize={'12px'}
                mt={'10px'}
                fontWeight={500}
                color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}>
                Current Price: {8.7} {'TOS/ WTON'}
              </Text>
              <Text
                fontSize={'12px'}
                fontWeight={500}
                color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}>
                Minimum amount TOS: {79}
              </Text>
            </Flex>
            <Text
              margin={'35px 25px 25px'}
              fontSize="12px"
              textAlign={'center'}>
              Depending on the liquidity of the WTON-TOS pool, slippage may
              occur.
              <span style={{color: '#ff3b3b'}}>
                {' '}
                If slippage of 10% or more occurs, the operation will be
                cancelled. Therefore, it is recommended to input an appropriate
                amount of TON according to the liquidity of the pool.{' '}
              </span>
              If the exchange rate of WTON-TOS is not within the range of the
              average exchange rate of the last 2 minutes + -5% of the exchange
              rate of WTON-TOS, the operation will be canceled.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter
          justifyContent={'center'}
          p="0px"
          borderTop={
            colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
          }>
          <Button
            mt="25px"
            w="150px"
            h="38px"
            bg={'#257eee'}
            _hover={{background: ''}}
            _active={{background: ''}}
            _focus={{background: ''}}
            fontSize="14px"
            color="white">
            Swap & Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SwapModal;
