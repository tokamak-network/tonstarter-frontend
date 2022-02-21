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
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal/CloseButton';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import * as PowerTONSwapperABI from 'services/abis/PowerTONSwapper.json';
import * as WTONABI from 'services/abis/WTON.json';
import {convertNumber} from 'utils/number';
import {fetchSwapPayload} from '@Staking/StakeOptionModal/utils/fetchSwapPayload';
import {useActiveWeb3React} from 'hooks/useWeb3';

export const PowerTonSwap = () => {
  const {data} = useAppSelector(selectModalType);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const [value, setValue] = useState<string>('0.00');
  const [swapValue, setSwapValue] = useState<string>('0.00');

  const {PowerTONSwapper_ADDRESS, WTON_ADDRESS} = DEPLOYED;
  const POWERTONSWAP_CONTRACT = useContract(
    PowerTONSwapper_ADDRESS,
    PowerTONSwapperABI.abi,
  );
  const STAKE_CONTROL_CONTRACT = useContract(WTON_ADDRESS, WTONABI.abi);
  const {library} = useActiveWeb3React();
  const {handleCloseModal: closeModal} = useModal();

  const handleCloseModal = () => {
    closeModal();
    setValue('0');
    setSwapValue('0');
  };

  useEffect(() => {
    async function fetchData() {
      if (STAKE_CONTROL_CONTRACT && PowerTONSwapper_ADDRESS) {
        const res = await STAKE_CONTROL_CONTRACT?.balanceOf(
          PowerTONSwapper_ADDRESS,
        );
        const convertedNum = convertNumber({
          amount: res.toString(),
          type: 'ray',
        });
        const tosPrice = await fetchSwapPayload(library);
        const numSwapValue =
          Number(tosPrice) * Number(convertedNum?.replaceAll(',', ''));
        setSwapValue(
          numSwapValue.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          }) || 'fail to fetch data',
        );
        return setValue(convertedNum || 'fail to fetch data');
      }
    }
    fetchData();
  }, [STAKE_CONTROL_CONTRACT, PowerTONSwapper_ADDRESS, library]);

  return (
    <Modal
      isOpen={data.modal === 'powerTonSwap' ? true : false}
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
              Power TON Swap
            </Heading>
            <Text
              color="gray.175"
              fontSize={'0.750em'}
              textAlign={'center'}
              w={'100%'}>
              You can swap Power TON to TOS
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
              _focus={{
                borderWidth: 0,
              }}
            />
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
              value={swapValue}
              width={'xs'}
              // mr={6}
              _focus={{
                borderWidth: 0,
              }}
            />
          </Stack>

          <Box as={Flex} mt={10} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() => {
                POWERTONSWAP_CONTRACT?.swap(3000, 1000, 0, 0);
              }}>
              Swap
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
