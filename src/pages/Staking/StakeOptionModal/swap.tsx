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
import {useUser} from 'hooks/useUser';
import {useModal} from 'hooks/useModal';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {CloseButton} from 'components/Modal/CloseButton';
import {convertToRay} from 'utils/number';
import {LoadingDots} from 'components/Loader/LoadingDots';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';

export const SwapModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useUser();
  const {
    data: {contractAddress, swapBalance, originalSwapBalance, currentTosPrice},
  } = sub;
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [value, setValue] = useState<number>(Number(swapBalance));
  const [swapValue, setSwapValue] = useState<number>(0);

  const {handleCloseConfirmModal} = useModal();
  const {checkBalance} = useCheckBalance();

  // const setMax = useCallback((_e) => setValue(swapBalance), [swapBalance]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    /*eslint-disable*/
  }, []);

  useEffect(() => {
    setSwapValue(value * Number(currentTosPrice));
  }, [value, currentTosPrice]);

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setValue(swapBalance);
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
              textAlign={'center'}
              mb={'3px'}>
              Swap
            </Heading>
            <Text
              color="gray.175"
              fontSize={'0.750em'}
              textAlign={'center'}
              w={'100%'}>
              Current price{' '}
              {currentTosPrice === '0' ? <LoadingDots /> : currentTosPrice} TOS
              per TON
            </Text>
            <Text
              color="gray.175"
              fontSize={'0.750em'}
              textAlign={'center'}
              w={'100%'}>
              Withdrawn TON seig from this product will be swapped to TOS
            </Text>
          </Box>

          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Input
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              value={value}
              width={'xs'}
              // mr={6}
              onChange={handleChange}
              _focus={{
                borderWidth: 0,
              }}
            />
            {/* <Box position={'absolute'} right={5}>
              <Button
                onClick={setMax}
                type={'button'}
                variant="outline"
                _focus={{
                  outline: 'none',
                }}>
                Max
              </Button>
            </Box> */}
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
            <Input
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              value={Number(swapValue).toFixed(2)}
              width={'xs'}
              // mr={6}
              _focus={{
                borderWidth: 0,
              }}
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
