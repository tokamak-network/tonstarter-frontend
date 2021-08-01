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
  Input,
  Stack,
  useTheme,
  useColorMode,
  Image,
} from '@chakra-ui/react';
import React, {useCallback, useState, useEffect, useMemo } from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {openModal, selectModalType} from 'store/modal.reducer';
import {swapWTONtoTOS} from '../actions';
// import { useBestV3TradeExactIn } from '../../../hooks/useBestV3Trade';
import { useDerivedSwapInfo, useSwapState, useSwapActionHandlers } from '../../../store/swap/hooks';
import TradePrice from '../components/TradePrice';
import { Field } from '../../../store/swap/actions';
import {useUser} from 'hooks/useUser';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';
import { SwapCurrencyPanel } from '../components/SwapCurrencyPanel';
import arrow from 'assets/svgs/swap-arrow-icon.svg'

export const SwapModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useUser();
  const {
    data: {contractAddress, swapBalance},
  } = sub;
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [value, setValue] = useState<number>(0);
  const {handleCloseConfirmModal} = useModal();

  const handleChange = useCallback((e) => setValue(e.target.value), []);
  const setMax = useCallback((_e) => setValue(swapBalance), [swapBalance]);

  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    v3TradeState: { trade: v3Trade, state: v3TradeState },
    toggledTrade: trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo()
  console.log(allowedSlippage)
  console.log(trade)
  console.log(currencies)
  console.log(currencyBalances);
  const showWrap = false
  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const [swappedBalance, setSwappedBalance] = useState<string | undefined>(
    undefined,
  );
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setValue(0);
  };

  return (
    <Modal
      isOpen={sub.type === 'manage_swap' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
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
              Swap
            </Heading>
            <TradePrice
              price={trade?.executionPrice}
              showInverted={showInverted}
              setShowInverted={setShowInverted}
            />
            {/* <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              
            </Text> */}
          </Box>

          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
              <SwapCurrencyPanel
                value={formattedAmounts[Field.INPUT]}
                onUserInput={handleTypeInput}
              />
              
            {/* <Input
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              value={formattedAmounts[Field.INPUT]}
              width={'xs'}
              mr={6}
              onChange={handleChange}
              _focus={{
                borderWidth: 0,
              }}
            /> */}
            <Box position={'absolute'} right={5}>
              <Button
                onClick={setMax}
                type={'button'}
                variant="outline"
                _focus={{
                  outline: 'none',
                }}>
                Max
              </Button>
            </Box>
          </Stack>
          <Stack>
            <Image
              w={'20px'}
              h={'20px'}
              src={arrow}
              as={Flex}
              flexDir={'row'}
              justifyContent={'center'}
              alignItems={'center'}
            />
          </Stack>
          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}
          >
            <SwapCurrencyPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
            />
          </Stack>
          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box textAlign={'center'} pt="33px" pb="13px">
              <Text fontWeight={500} fontSize={'0.813em'} color={'gray.400'}>
                Available Balance
              </Text>
              <Text
                fontSize={'18px'}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {swapBalance} TON
              </Text>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() => {
                swapWTONtoTOS({
                  userAddress: account,
                  amount: value.toString(),
                  contractAddress,
                  library,
                });
                handleCloseModal();
              }}>
              Swap
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
