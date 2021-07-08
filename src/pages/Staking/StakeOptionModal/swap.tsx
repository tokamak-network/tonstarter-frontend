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
} from '@chakra-ui/react';
import React, {useCallback, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {swapWTONtoTOS} from '../staking.reducer';

export const SwapModal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  let balance = data?.data?.totalStakedAmountL2;

  const [value, setValue] = useState<number>(balance);

  const handleChange = useCallback((e) => setValue(e.target.value), []);
  const setMax = useCallback((_e) => setValue(balance), [balance]);

  return (
    <Modal
      isOpen={data.modal === 'swap' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box my={3} textAlign="center">
            <Heading
              fontWeight={'normal'}
              fontSize={'3xl'}
              textAlign={'center'}>
              Swap
            </Heading>
            {/* <Text>{payToken}</Text> */}
          </Box>

          <Stack
            as={Flex}
            py={10}
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
              // value={value}
              width={'xs'}
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
            pb={5}
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box textAlign={'center'}>
              <Text>Available Balance</Text>
              <Text>{balance} TON</Text>
            </Box>
          </Stack>

          <Box py={4} as={Flex} justifyContent={'center'}>
            <Button
              colorScheme={'blue'}
              onClick={() =>
                swapWTONtoTOS({
                  userAddress: account,
                  amount: value.toString(),
                  contractAddress: data?.data?.contractAddress,
                  status: data?.data?.status,
                  library: library,
                  handleCloseModal: dispatch(closeModal()),
                })
              }>
              Swap
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};