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
  Image,
  useColorMode,
  Avatar,
  NumberInput,
  NumberInputField,
  Link,
} from '@chakra-ui/react';
import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {swapWTONtoTOS} from '../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {CloseButton} from 'components/Modal/CloseButton';
import {convertToRay} from 'utils/number';
// import {LoadingDots} from 'components/Loader/LoadingDots';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';
import commafy from 'utils/commafy';
import TON_SYMBOL from 'assets/tokens/TON_symbol_nobg.svg';
import TOS_SYMBOL from 'assets/tokens/TOS_symbol.svg';
import TOS_symbolDark from 'assets/tokens/TOS_symbolDark.svg';
import {useSwapModal} from '@Launch/hooks/useSwapModal';
// import {useSwapMax} from '@Launch/hooks/useSwapMax';
import {useSwapStake} from '../hooks/useSwapStake';
import {useStable} from '../hooks/useStable';

export const SwapModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useActiveWeb3React();
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [max, setMax] = useState<string>('0');

  const {
    data: {contractAddress, swapBalance, originalSwapBalance, currentTosPrice},
  } = sub;

  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {handleCloseConfirmModal} = useModal();
  const {checkBalance} = useCheckBalance();

  const maxAmount = useSwapStake(Number(swapBalance));
  const maxInput = useSwapStake(Number(inputAmount.replaceAll(',', '')));

  const stableAmount = useStable()
  console.log('stableAmount',stableAmount);
  
  // console.log('maxAmount', maxAmount);

  useEffect(() => {
    setMax(maxAmount);
  }, [maxAmount]);

  const {tosAmountOut: basicPrice} = useSwapModal(1);

  const {tosAmountOut} = useSwapModal(
    isNaN(Number(inputAmount.replaceAll(',', ''))) ||
      Number(inputAmount.replaceAll(',', '')) === 0
      ? 0
      : Number(inputAmount.replaceAll(',', '')),
  );

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setInputAmount('0');
  };

  const priceImpact = useMemo(() => {
    const numTosAmountOut = Number(tosAmountOut.replaceAll(',', ''));

    const numBasicPrice = Number(basicPrice.replaceAll(',', ''));

    const numInputAmount = Number(inputAmount.replaceAll(',', ''));

    const theoreticalValue = numInputAmount * numBasicPrice;

    const priceDiff = (theoreticalValue - numTosAmountOut) / theoreticalValue;
    const result = priceDiff * 100;

    return isNaN(result) || result === Infinity || result === -Infinity
      ? '-'
      : commafy(result);
  }, [tosAmountOut, basicPrice, inputAmount]);

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

  // console.log(
  //   'Number(max)',
  //   Number(max),
  //   'Number(inputAmount)',
  //   Number(inputAmount),
  // );
console.log('priceImpact',priceImpact);

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
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}
              mb={'3px'}>
              Swap
            </Heading>
          </Box>

          <Stack
            pt="15px"
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Flex
              w={'300px'}
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              flexDir={'column'}
              borderRadius={10}
              pt="12px"
              pl={'25px'}
              pr={'14px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'16px'}>
                <Avatar
                  src={TON_SYMBOL}
                  backgroundColor={'transparent'}
                  bg="transparent"
                  color="#c7d1d8"
                  name={'token_image'}
                  border={
                    colorMode === 'light'
                      ? '1px solid #e7edf3'
                      : '1px solid #3c3c3c'
                  }
                  borderRadius={25}
                  h="26px"
                  w="26px"
                  mr="6px"
                />

                <Text
                  fontSize={16}
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
                  textAlign={'center'}
                  lineHeight={'24px'}>
                  TON
                </Text>
                <NumberInput
                  h="26px"
                  ml="10px"
                  borderRadius={'4px'}
                  border={
                    Number(inputAmount) > Number(maxAmount)
                      ? '1px solid red'
                      : ''
                  }
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
                    // errorBorderColor="red.300"
                    verticalAlign={'sub'}
                    fontSize={20}
                    fontWeight={'bold'}
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
              <Flex alignItems={'center'} pb={'14px'} pt={'13px'}>
                <Text
                  fontSize={'12px'}
                  fontWeight={500}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                  lineHeight={1.33}
                  mr={'10px'}>
                  Balance: {Number(swapBalance).toLocaleString() || '-'} TON
                </Text>

                <Button
                  w={'50px'}
                  h={'20px'}
                  fontSize={12}
                  fontWeight={600}
                  onClick={() => setInputAmount(max.replace(/,/g, ''))}
                  type={'button'}
                  variant="outline"
                  mr="6px"
                  borderColor={colorMode === 'dark' ? '#535353' : '#9d9ea5'}
                  _focus={{
                    outline: 'none',
                  }}>
                  Max
                </Button>
                <Button
                  w={'50px'}
                  h={'20px'}
                  fontSize={12}
                  fontWeight={600}
                  onClick={() => setInputAmount(stableAmount.replace(/,/g, ''))}
                  type={'button'}
                  variant="outline"
                  borderColor={colorMode === 'dark' ? '#535353' : '#9d9ea5'}
                  _focus={{
                    outline: 'none',
                  }}>
                  Stable
                </Button>
              </Flex>
            </Flex>
          </Stack>
          <Stack
            pt="20px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Image src={swapArrow} w={5} h={5} alt="" />
          </Stack>
          <Stack
            pt="20px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Flex
              w={'300px'}
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              flexDir={'column'}
              borderRadius={10}
              pl={'25px'}
              pr={'14px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'16px'}>
                <Flex>
                  <Avatar
                    src={colorMode === 'light' ? TOS_SYMBOL : TOS_symbolDark}
                    backgroundColor={'transparent'}
                    bg="transparent"
                    color="#c7d1d8"
                    name={'token_image'}
                    border={
                      colorMode === 'light'
                        ? '1px solid #e7edf3'
                        : '1px solid #3c3c3c'
                    }
                    borderRadius={25}
                    h="26px"
                    w="26px"
                    mr="6px"
                  />
                  <Text
                    fontSize={16}
                    fontWeight={600}
                    color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
                    textAlign={'center'}
                    lineHeight={'24px'}>
                    TOS
                  </Text>
                </Flex>

                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  lineHeight={1.5}
                  fontSize="20px">
                  {Number(inputAmount) <= 0 ? '0.00' : commafy(tosAmountOut)}
                </Text>
              </Flex>
              <Flex alignItems={'center'} pb={'16px'} pt={'13px'}>
                <Flex flexDir={'column'} h={'30px'}>
                  <Text
                    fontSize={'12px'}
                    fontWeight={500}
                    color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                    lineHeight={1.33}>
                    1 TON = {commafy(basicPrice)} TOS
                  </Text>
                  <Text
                    fontSize={'12px'}
                    fontWeight={500}
                    color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                    lineHeight={1.33}>
                    Price Impact : {priceImpact}%
                  </Text>
                  {/* <Text fontSize={12} fontWeight={600} color={'#808992'}>
                    Minimum amount TOS : {commafy(swapValue * 0.95 * 0.9)}
                  </Text> */}
                </Flex>
              </Flex>
            </Flex>
          </Stack>
          {/* <Text
            color="gray.175"
            fontSize={'0.750em'}
            textAlign={'center'}
            w={'100%'}>
            Current price{' '}
            {currentTosPrice === '0' ? <LoadingDots /> : currentTosPrice} TOS
            per TON
          </Text> */}
          {/* <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}></Stack> */}
          {Number(priceImpact) >= 5.5 ? (
            <Text
              margin={'0px 25px 25px'}
              fontSize="12px"
              textAlign={'center'}
              color={'#ff3b3b'}
              mt="30px">
              Price impact has to be less than 10%
            </Text>
          ) : null}

          <Text
            margin={'0px 25px 25px'}
            fontSize="12px"
            textAlign={'center'}
            mt="30px">
            Swap will take place in Uniswap V3's{' '}
            <Link
              isExternal={true}
              href={
                'https://info.uniswap.org/#/pools/0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4'
              }
              color={'blue.100'}>
              WTON-TOS pool
            </Link>
            , but will not be executed if the last 2-minute average price
            differs from the current price by more than 4.8%. Slippage is
            designed to be a maximum of 5.5%.
          </Text>
          <Box
            as={Flex}
            justifyContent={'center'}
            pt={'25px'}
            borderTop={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              disabled={
                Number(maxAmount) === 0 ||
                Number(inputAmount) === 0 ||
                Number(inputAmount) > Number(maxAmount)
              }
              onClick={() => {
                const isBalance = checkBalance(
                  Number(inputAmount),
                  Number(swapBalance),
                );
                if (isBalance) {
                  const amountRay = convertToRay(inputAmount.toString());
                  swapWTONtoTOS({
                    userAddress: account,
                    amount:
                      isBalance !== 'balanceAll'
                        ? amountRay
                        : originalSwapBalance.toString(),
                    contractAddress,
                    library,
                  }).then(() => {
                    handleCloseModal();
                  });
                }
              }}>
              Swap
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
