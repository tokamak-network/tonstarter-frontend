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
import { withdraw } from '../staking.reducer';

export const WithdrawalOptionModal = () => {
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {account, library} = useWeb3React();

  let balance = data?.data?.user?.stakeBalanceTON;
  const [value, setValue] = useState<number>(balance);

  const handleChange = useCallback(e => setValue(e.target.value), []);
  const withdrawalDelay = data?.data?.globalWithdrawalDelay;

  const handleCloseModal = useCallback(() => dispatch(closeModal()), [
    dispatch,
  ]);

  return (
    <Modal
      isOpen={data.modal === 'withdraw' ? true : false}
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
              Withdraw
            </Heading>
            <Stack>
              <Text>
                You can withdraw after {withdrawalDelay}  Blocks
              </Text>
            </Stack>
            {/* <Stack>
              <Text>
                date data
              </Text>
            </Stack> */}
            <Box py={4} as={Flex} justifyContent={'center'}>
              <Button
                type={'submit'}
                onClick={() =>
                  withdraw({
                    userAddress:account, 
                    contractAddress: data.data.contractAddress,
                    miningEndTime: data?.data?.miningEndTime,
                    library: library,
                    handleCloseModal: dispatch(closeModal()),
                  })
                }
                disabled={+balance <= 0}
                colorScheme={'blue'}>
                Withdraw
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>

    </Modal>

  )
}