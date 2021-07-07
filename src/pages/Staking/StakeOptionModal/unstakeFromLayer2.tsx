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
import {unstakeL2} from '../staking.reducer';
import React, {FC, useCallback, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';

export const UnStakeFromLayer2Modal = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  let balance = data?.data?.totalStakedAmountL2;

  const [value, setValue] = useState<number>(balance);
  const handleChange = useCallback(e => setValue(e.target.value), []);
  const setMax = useCallback(_e => setValue(balance), [balance]);

  return (
    <Modal
      isOpen={data.modal === 'unstakeL2' ? true : false}
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
              Unstake From Tokamak
            </Heading>
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
                value={value}
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
              <Text>{balance ? balance : '0.00'} TON</Text>
            </Box>
          </Stack>

          <Box py={4} as={Flex} justifyContent={'center'}>
            <Button
              type={'submit'}
              onClick={() =>
                unstakeL2({
                  userAddress:account, 
                  amount: value.toString(),
                  contractAddress: data.data.contractAddress,
                  status: data?.data?.status,
                  library: library,
                  handleCloseModal: dispatch(closeModal()),
                })
              }
              disabled={+balance <= 0}
              colorScheme={'blue'}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
