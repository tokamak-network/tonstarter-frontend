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
} from '@chakra-ui/react';
import React, {useCallback, useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {swapWTONtoTOS} from '../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {CloseButton} from 'components/Modal/CloseButton';
import {convertToRay} from 'utils/number';
import {LoadingDots} from 'components/Loader/LoadingDots';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';

export const SwapModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useActiveWeb3React();
  const {
    data: {contractAddress, swapBalance, originalSwapBalance, currentTosPrice},
  } = sub;
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [value, setValue] = useState<number>(0);
  const [swapValue, setSwapValue] = useState<number>(0);

  const {handleCloseConfirmModal} = useModal();
  const {checkBalance} = useCheckBalance();

  const setMax = useCallback((_e) => setValue(swapBalance), [swapBalance]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    /*eslint-disable*/
  }, []);

  useEffect(() => {
    setSwapValue(value * Number(currentTosPrice));
  }, [value, currentTosPrice]);

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setValue(0);
  };

  return (
    <Modal
      // isOpen={sub.type === 'manage_swap' ? true : false}
      isOpen={true}
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
              border={'1px solid #d7d9df'}
              flexDir={'column'}
              borderRadius={10}
              pl={'25px'}
              pr={'14px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'16px'}>
                <Text
                  fontSize={16}
                  fontWeight={600}
                  color={'#3d495d'}
                  textAlign={'center'}
                  lineHeight={'24px'}>
                  TON
                </Text>
                <Input
                  h={'24px'}
                  variant={'outline'}
                  borderWidth={0}
                  textAlign={'right'}
                  value={value}
                  onChange={handleChange}
                  placeholder={'0.00'}
                  fontSize={20}
                  fontWeight={'bold'}
                  _placeholder={{
                    color: '#dee4ef',
                  }}
                  _focus={{
                    borderWidth: 0,
                  }}
                />
              </Flex>
              <Flex alignItems={'center'} pb={'14px'} pt={'13px'}>
                <Text
                  fontSize={12}
                  fontWeight={600}
                  color={'#808992'}
                  w={'104px'}
                  mr={'10px'}>
                  Balance: {swapBalance} TON
                </Text>
                <Button
                  w={'50px'}
                  h={'20px'}
                  fontSize={12}
                  fontWeight={600}
                  onClick={setMax}
                  type={'button'}
                  variant="outline"
                  _focus={{
                    outline: 'none',
                  }}>
                  Max
                </Button>
              </Flex>
            </Flex>
          </Stack>
          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Image src={swapArrow} w={5} h={5} alt="" />
          </Stack>
          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Flex
              w={'300px'}
              border={'1px solid #d7d9df'}
              flexDir={'column'}
              borderRadius={10}
              pl={'25px'}
              pr={'14px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'16px'}>
                <Text
                  fontSize={16}
                  fontWeight={600}
                  color={'#3d495d'}
                  textAlign={'center'}
                  lineHeight={'24px'}>
                  TOS
                </Text>
                <Input
                  h={'24px'}
                  variant={'outline'}
                  borderWidth={0}
                  textAlign={'right'}
                  value={Number(swapValue).toFixed(2)}
                  placeholder={'0.00'}
                  fontSize={20}
                  fontWeight={'bold'}
                  _placeholder={{
                    color: '#dee4ef',
                  }}
                  _focus={{
                    borderWidth: 0,
                  }}
                />
              </Flex>
              <Flex alignItems={'center'} pb={'16px'} pt={'13px'}>
                <Flex flexDir={'column'} h={'30px'}>
                  <Text fontSize={12} fontWeight={600} color={'#808992'}>
                    Current price : {currentTosPrice} TOS / WTO
                  </Text>
                  <Text fontSize={12} fontWeight={600} color={'#808992'}>
                    Minimum amount TOS : {79}
                  </Text>
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
          <Box
            pt={'35px'}
            pb={'25px'}
            pr={'25px'}
            pl={'25px'}
            fontSize={12}
            textAlign={'center'}>
            <Text>
              Depending on the liquidity of the WTON-TOS pool, slippage may
              occur.{' '}
              <span style={{color: '#ff3b3b'}}>
                If slippage of 10% or more occurs, the operation will be
                cancelled. Therefore, it is recommended to input an appropriate
                amount of TON according to the liquidity of the pool.
              </span>
              {''}
              If the exchange rate of WTON-TOS is not within the range of the
              average exchange rate of the last 2 minutes + -5% of the exchange
              rate of WTON-TOS, the operation will be canceled.
            </Text>
          </Box>

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
              onClick={() => {
                const isBalance = checkBalance(
                  Number(value),
                  Number(swapBalance),
                );
                if (isBalance) {
                  const amountRay = convertToRay(value.toString());
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
