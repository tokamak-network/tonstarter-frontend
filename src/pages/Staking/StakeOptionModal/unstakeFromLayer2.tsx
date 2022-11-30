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
} from '@chakra-ui/react';
import {unstakeL2} from '../actions';
import React, {useCallback, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useUser} from 'hooks/useUser';
import {useModal} from 'hooks/useModal';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {CloseButton} from 'components/Modal/CloseButton';

export const UnStakeFromLayer2Modal = () => {
  const {account, library} = useUser();
  const {sub} = useAppSelector(selectModalType);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {handleCloseConfirmModal} = useModal();
  const {checkBalance} = useCheckBalance();

  const {
    data: {contractAddress, totalStakedAmountL2},
  } = sub;

  const [value, setValue] = useState<number>(0);
  const handleChange = useCallback((e) => setValue(e.target.value), []);
  const setMax = useCallback(
    (_e) => setValue(totalStakedAmountL2),
    [totalStakedAmountL2],
  );


  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setValue(0);
  };

  return (
    <Modal
      isOpen={sub.type === 'manage_unstakeL2' ? true : false}
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
              Unstake From Tokamak
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn TON and POWER
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
              w="60%"
              mr={6}
              onChange={handleChange}
              _focus={{
                borderWidth: 0,
              }}
            />
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
                TON Balance
              </Text>
              <Text
                fontSize={'18px'}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {totalStakedAmountL2} TON
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
                  Number(totalStakedAmountL2),
                );
                if (isBalance) {
                  unstakeL2({
                    type: value === totalStakedAmountL2 ? true : false,
                    userAddress: account,
                    amount: value.toString(),
                    contractAddress,
                    library: library,
                  });
                  handleCloseModal();
                }
              }}
              colorScheme={'blue'}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
